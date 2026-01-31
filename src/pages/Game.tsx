import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useGameState } from '@/hooks/useGameState';
import { Button } from '@/components/ui/button';
import Room3D from '@/components/game/Room3D';
import LevelCard from '@/components/game/LevelCard';
import LevelPuzzle from '@/components/game/LevelPuzzle';
import Timer from '@/components/game/Timer';
import { LogOut, Trophy, RotateCcw, Shield } from 'lucide-react';
import { toast } from 'sonner';

const Game = () => {
  const { user, signOut, loading, isAdmin } = useAuth();
  const { gameState, startGame, completeLevel, resetGame, elapsedTime, isPlaying } = useGameState();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (gameState.currentLevel && !gameState.isCompleted) {
      setSelectedLevel(gameState.currentLevel);
    }
  }, [gameState.currentLevel, gameState.isCompleted]);

  const handleLevelClick = (level: number) => {
    if (!gameState.completedLevels.includes(level - 1) && level !== 1 && level !== gameState.currentLevel) {
      return;
    }
    setSelectedLevel(level);
  };

  const handleCompleteLevel = async (key?: string) => {
    if (!selectedLevel) return;

    if (selectedLevel === 1 && !isPlaying) {
      startGame();
    }

    const success = await completeLevel(selectedLevel, key || '');
    
    if (success) {
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

  const handleReset = () => {
    resetGame();
    setSelectedLevel(1);
    toast.info('Game reset. Start again!');
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

  const isLevelLocked = (level: number) => {
    if (level === 1) return false;
    return !gameState.completedLevels.includes(level - 1);
  };

  const showKeyInput = (level: number) => {
    if (level === 1) return false;
    return gameState.completedLevels.includes(level - 1);
  };

  return (
    <div className="min-h-screen escape-gradient">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-display font-bold neon-text">ESCAPE ROOM</h1>
          
          <div className="flex items-center gap-4">
            <Timer seconds={elapsedTime} isRunning={isPlaying} />
            
            {isAdmin && (
              <Button variant="neonPurple" size="sm" onClick={() => navigate('/admin')}>
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </Button>
            )}
            
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8">
        {gameState.isCompleted ? (
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
              <Button variant="neon" size="lg" onClick={handleReset}>
                <RotateCcw className="w-5 h-5 mr-2" />
                Play Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4">
            {/* 3D Room View */}
            <div className="h-[300px] md:h-[400px] mb-8 rounded-2xl overflow-hidden neon-box">
              <Room3D level={selectedLevel || 1} isActive={true} />
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

            {/* Active Puzzle */}
            {selectedLevel && (
              <LevelPuzzle
                level={selectedLevel}
                onComplete={handleCompleteLevel}
                showKeyInput={showKeyInput(selectedLevel)}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Game;
