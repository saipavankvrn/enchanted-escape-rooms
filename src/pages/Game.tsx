import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useGameState } from '@/hooks/useGameState';
import { Button } from '@/components/ui/button';
import Room3D from '@/components/game/Room3D';
import LevelCard from '@/components/game/LevelCard';
import LevelPuzzle from '@/components/game/LevelPuzzle';
import Timer from '@/components/game/Timer';
import { LogOut, Trophy, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const TOTAL_TIME = 50 * 60; // 50 minutes in seconds

const Game = () => {
  const { user, signOut, loading, isAdmin } = useAuth();
  const { gameState, startGame, completeLevel, elapsedTime, isPlaying } = useGameState();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [isInMission, setIsInMission] = useState(false);
  const navigate = useNavigate();

  const remainingTime = Math.max(0, TOTAL_TIME - elapsedTime);
  const isDefeated = elapsedTime >= TOTAL_TIME && !gameState.isCompleted && (isPlaying || gameState.startTime !== null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (gameState.currentLevel && !gameState.isCompleted && !isDefeated) {
      setSelectedLevel(gameState.currentLevel);
    }
  }, [gameState.currentLevel, gameState.isCompleted, isDefeated]);

  const handleLevelClick = (level: number) => {
    if (isDefeated) return;

    if (!gameState.completedLevels.includes(level - 1) && level !== 1 && level !== gameState.currentLevel) {
      return;
    }

    setSelectedLevel(level);

    // Only enter mission mode if it's the current incomplete level
    if (level === gameState.currentLevel && !gameState.isCompleted) {
      if (level === 1 && !isPlaying) {
        startGame();
      }
      setIsInMission(true);
    }
  };

  const handleCompleteLevel = async (key?: string) => {
    if (!selectedLevel || isDefeated) return;

    // Level 1 start game logic is moved to handleLevelClick for immediate feedback, 
    // but we check here just in case.
    if (selectedLevel === 1 && !isPlaying) {
      startGame();
    }

    const success = await completeLevel(selectedLevel, key || '');

    if (success) {
      setIsInMission(false); // Return to dashboard on success
      if (selectedLevel === 5) {
        toast.success('🎉 Congratulations! You escaped!', {
          description: `Total time: ${formatTime(elapsedTime)}`,
        });
      } else {
        toast.success(`Level ${selectedLevel} completed!`, {
          description: `Moving to Level ${selectedLevel + 1}...`,
        });
        setSelectedLevel(selectedLevel + 1);
      }
    } else {
      toast.error('Wrong key! Try again.');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const isLevelLocked = (level: number) => {
    if (level === 1) return false;
    return !gameState.completedLevels.includes(level - 1);
  };

  const showKeyInput = (level: number) => {
    // Enable key input for level 1 as well, so user can enter "LEVEL-1-COMPLETE"
    if (level === 1) return true;
    return gameState.completedLevels.includes(level - 1);
  };

  const getLevelDuration = (level: number) => {
    if (!gameState.startTime) return null;

    let start = gameState.startTime;
    if (level > 1) {
      const prevTimestamp = gameState.levelTimestamps[level - 1];
      if (!prevTimestamp) return null; // Previous level not finished yet? Should be impossible if unlocked.
      start = new Date(prevTimestamp);
    }

    let end = new Date(); // Default to now if playing
    const levelTimestamp = gameState.levelTimestamps[level];

    // If level is completed, use its timestamp
    if (gameState.completedLevels.includes(level)) {
      if (levelTimestamp) {
        end = new Date(levelTimestamp);
      }
      // If completed but no timestamp (legacy data), maybe use next level's start? 
      // Or just fail gracefully.
    } else if (gameState.currentLevel === level && isPlaying) {
      // If current level, use now.
      end = new Date();
    } else if (gameState.isCompleted && level === 5) {
      // If game completed and checking level 5
      if (gameState.endTime) end = gameState.endTime;
    } else {
      // Level locked or not started
      return null;
    }

    const durationSeconds = Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000));
    return formatTime(durationSeconds);
  };

  if (loading) {
    return (
      <div className="min-h-screen escape-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isDefeated) {
    return (
      <div className="min-h-screen escape-gradient">
        <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/50">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-display font-bold neon-text">ESCAPE ROOM</h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-12 pt-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <AlertTriangle className="w-24 h-24 mx-auto text-destructive animate-pulse" />
            </div>
            <h2 className="text-4xl font-display font-bold text-destructive mb-4">
              MISSION FAILED
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Time has run out. The Shadow has taken control.
            </p>
            <div className="glass-panel rounded-2xl p-8 mb-8">
              <p className="text-muted-foreground mb-2">You survived for</p>
              <p className="text-5xl font-display font-bold text-muted-foreground">
                50m 00s
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen escape-gradient">
      {/* Header - Always visible for Timer access */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-display font-bold neon-text">ESCAPE ROOM</h1>

          <div className="flex items-center gap-4">
            <Timer seconds={remainingTime} isRunning={isPlaying && !isDefeated} />

            {isInMission && (
              <Button variant="ghost" size="sm" onClick={() => setIsInMission(false)}>
                Back to HQ
              </Button>
            )}

            {isAdmin && (
              <Button variant="neonPurple" size="sm" onClick={() => navigate('/admin')}>
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </Button>
            )}

            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8 min-h-screen flex flex-col">
        {gameState.isCompleted ? (
          // ... (Success Screen unchanged)
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <Trophy className="w-24 h-24 mx-auto text-warning animate-pulse" />
              </div>
              <h2 className="text-4xl font-display font-bold neon-text mb-4">
                🎉 YOU ESCAPED! 🎉
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Congratulations! You've completed all 5 levels.
              </p>
              <div className="glass-panel rounded-2xl p-8 mb-8">
                <p className="text-muted-foreground mb-2">Your Total Time</p>
                <p className="text-5xl font-display font-bold text-primary">
                  {formatTime(gameState.totalTimeSeconds || elapsedTime)}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 max-w-md mx-auto">
                {[1, 2, 3, 4, 5].map(lvl => (
                  <div key={lvl} className="flex justify-between text-muted-foreground bg-secondary/20 p-2 rounded">
                    <span>Level {lvl}</span>
                    <span>{getLevelDuration(lvl) || '--'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : isInMission && selectedLevel ? (
          // FULL SCREEN MISSION MODE
          <div className="flex-1 container mx-auto px-4 flex flex-col">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-display font-bold text-white mb-2">Level {selectedLevel}</h2>
              <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary border border-primary/50 text-sm font-display">
                ⏱️ Time: {getLevelDuration(selectedLevel) || '0s'}
              </span>
            </div>
            <div className="flex-1">
              <LevelPuzzle
                level={selectedLevel}
                onComplete={handleCompleteLevel}
                showKeyInput={showKeyInput(selectedLevel)}
              />
            </div>
          </div>
        ) : (
          // DASHBOARD MODE
          <div className="container mx-auto px-4">
            {/* 3D Room View */}
            <div className="h-[300px] md:h-[400px] mb-8 rounded-2xl overflow-hidden neon-box relative group">
              <Room3D level={selectedLevel || 1} isActive={true} />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <p className="text-white font-display text-lg tracking-widest">VISUALIZING SECTOR {selectedLevel || 1}</p>
              </div>
            </div>

            {/* Level Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[1, 2, 3, 4, 5].map((level) => (
                <LevelCard
                  key={level}
                  level={level}
                  isLocked={isLevelLocked(level)}
                  isCompleted={gameState.completedLevels.includes(level)}
                  isCurrent={gameState.currentLevel === level}
                  onClick={() => handleLevelClick(level)}
                />
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-muted-foreground">Select current mission to engage.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Game;
