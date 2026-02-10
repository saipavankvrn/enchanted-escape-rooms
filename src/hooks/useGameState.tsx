import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface GameState {
  currentLevel: number;
  completedLevels: number[];
  startTime: Date | null;
  endTime: Date | null;
  levelTimestamps: Record<number, string>; // ISO strings from DB or Date objects
  subTasksCompleted: Record<number, string[]>;
  totalTimeSeconds: number | null;
  hintsUsed: number;
  isCompleted: boolean;
}

interface GameContextType {
  gameState: GameState;
  startGame: () => void;
  completeLevel: (level: number, secretKey: string) => Promise<boolean>;
  completeSubTask: (level: number, taskId: string) => Promise<void>;
  resetGame: () => void;
  elapsedTime: number;
  isPlaying: boolean;
  applyPenalty: (seconds: number) => Promise<void>;
  trackHintUsage: () => Promise<void>;
}

const levelSecrets: Record<number, string> = {
  1: 'LEVEL-1-COMPLETE',
  2: 'SPOOFED_2026',
  3: 'TH3_M4SK_0F_Z0RR0',
  4: 'DICT_ATTACK_MASTER',
  5: 'P64P_4N4L7S1S_SU55355FUL_4624A8B6',
  // Note: Level 1 key is revealed in PasswordRoom
};

const GameContext = createContext<GameContextType | undefined>(undefined);

const API_URL = `http://${window.location.hostname}:5000/api/game`;

export const GameProvider = ({ children }: { children: ReactNode }) => {
  // ... (existing state init) ...
  const { user } = useAuth();
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 1,
    completedLevels: [],
    startTime: null,
    endTime: null,
    levelTimestamps: {},
    subTasksCompleted: {},
    totalTimeSeconds: null,
    hintsUsed: 0,
    isCompleted: false,
  });
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // ... (existing effects) ...
  useEffect(() => {
    if (user) {
      loadGameState();
    }
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && gameState.startTime && !gameState.isCompleted) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - gameState.startTime!.getTime()) / 1000);
        if (elapsed >= 3000) { // 50 minutes limit
          setElapsedTime(3000);
          setIsPlaying(false);
        } else {
          setElapsedTime(elapsed);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameState.startTime, gameState.isCompleted]);

  // ... (loadGameState, saveGameState, startGame unchanged) ...
  const loadGameState = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/state`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();

        const startTime = data.start_time ? new Date(data.start_time) : null;
        setGameState({
          currentLevel: data.current_level || 1,
          completedLevels: data.completed_levels || [],
          startTime,
          endTime: data.end_time ? new Date(data.end_time) : null,
          levelTimestamps: data.level_timestamps || {},
          subTasksCompleted: data.sub_tasks_completed || {},
          totalTimeSeconds: data.total_time_seconds,
          hintsUsed: data.hints_used || 0,
          isCompleted: data.is_completed || false,
        });

        if (startTime && !data.is_completed) {
          const now = new Date();
          const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);

          if (elapsed >= 3000) {
            setElapsedTime(3000);
            setIsPlaying(false);
          } else {
            setElapsedTime(elapsed);
            setIsPlaying(true);
          }
        } else if (data.total_time_seconds) {
          setElapsedTime(data.total_time_seconds);
        }
      }
    } catch (error) {
      console.error('Failed to load game state', error);
    }
  };

  const saveGameState = useCallback(async (newState: Partial<GameState>) => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newState)
      });
    } catch (error) {
      console.error('Failed to save game state', error);
    }
  }, [user]);

  const startGame = useCallback(() => {
    const now = new Date();
    setGameState(prev => ({
      ...prev,
      startTime: now,
      currentLevel: 1,
    }));
    setIsPlaying(true);
    setElapsedTime(0);
    saveGameState({ startTime: now, currentLevel: 1 });
  }, [saveGameState]);

  const applyPenalty = useCallback(async (seconds: number) => {
    if (!gameState.startTime) return;

    // Moving start time BACK makes elapsed time larger, thus reducing remaining time.
    const newStartTime = new Date(gameState.startTime.getTime() - seconds * 1000);

    setGameState(prev => ({
      ...prev,
      startTime: newStartTime
    }));

    // Update elapsed time immediately for UI responsiveness
    const now = new Date();
    setElapsedTime(Math.floor((now.getTime() - newStartTime.getTime()) / 1000));

    await saveGameState({ startTime: newStartTime });
    toast.error(`Time Penalty Applied: -${Math.floor(seconds / 60)}m`);
  }, [gameState.startTime, saveGameState]);

  const completeSubTask = useCallback(async (level: number, taskId: string) => {
    const currentTasks = gameState.subTasksCompleted[level] || [];
    if (currentTasks.includes(taskId)) return;

    const newTasks = [...currentTasks, taskId];
    const newSubTasksCompleted = { ...gameState.subTasksCompleted, [level]: newTasks };

    setGameState(prev => ({
      ...prev,
      subTasksCompleted: newSubTasksCompleted
    }));

    await saveGameState({ subTasksCompleted: newSubTasksCompleted });
  }, [gameState.subTasksCompleted, saveGameState]);

  const trackHintUsage = useCallback(async () => {
    const newHintsUsed = (gameState.hintsUsed || 0) + 1;
    setGameState(prev => ({
      ...prev,
      hintsUsed: newHintsUsed
    }));
    await saveGameState({ hintsUsed: newHintsUsed });
  }, [gameState.hintsUsed, saveGameState]);

  const completeLevel = useCallback(async (level: number, secretKey: string): Promise<boolean> => {
    // Check Secret Key for ALL levels now
    // For level 1, the next level is 2. The key checks current level completion?
    // Usually completeLevel(1, key) means "I am finishing level 1 with this key".
    // So we check levelSecrets[1].

    // Wait, levelSecrets logic previously was:
    // const nextLevel = level + 1;
    // const expectedKey = levelSecrets[nextLevel]; 
    // This implies key for level 1 unlocks level 2? 
    // Or "key found IN level 1" is the key to ENTER level 2?
    // Typically "Level 1 Key" completes Level 1.
    // Let's adjust logic to be: Key for Level X completes Level X.

    // Previous logic:
    // const expectedKey = levelSecrets[nextLevel];
    // This matched {2: 'SHADOW'} -> completing level 1 (next=2) needed 'SHADOW'.
    // That seems weird. Usually you find 'SHADOW' in level 2?
    // Let's look at LevelPuzzle.tsx.
    // Level 2 Title "Shadow Realm". SecretHint "S _ _ _ _ W". 
    // So 'SHADOW' is the answer for Level 2.
    // So completeLevel(2, 'SHADOW') should succeed.

    // So if I call completeLevel(1, 'KEY'), I expect it to check levelSecrets[1].
    // Previous logic was `levelSecrets[level + 1]`. 
    // If I complete Level 2, next is 3. `levelSecrets[3]` is 'CIPHER'.
    // But 'SHADOW' is capable of completing Level 2?
    // No, wait. 
    // previous logic: `if (secretKey.toUpperCase() === expectedKey || level === 5)`
    // where `expectedKey = levelSecrets[nextLevel]`.
    // So to complete Level 2 (going to 3), you needed `levelSecrets[3]` ('CIPHER')?
    // That conflicts with the hint in Level 2 "S_ _ _ _ W".

    // This implies the previous logic might have been buggy or I misunderstood it.
    // OR `levelSecrets` keys refer to the level they UNLOCK?
    // `2: 'SHADOW'` -> Key to Unlock Level 2?
    // But you find 'SHADOW' INSIDE Level 2.
    // If you are inside Level 2, you are already unlocked.
    // You want to complete it.

    // Let's fix the logic to be intuitive:
    // `levelSecrets[completedLevel]` is the key required to complete.
    // So `levelSecrets[1]` = Key to complete Level 1.

    const expectedKey = levelSecrets[level];

    if (secretKey.toUpperCase() === expectedKey) {
      // Logic for success
      const now = new Date();
      const newCompletedLevels = [...gameState.completedLevels, level];
      const newCurrentLevel = level + 1;
      const newTimestamps = { ...gameState.levelTimestamps, [level]: now.toISOString() };

      if (level === 5) {
        // ... (existing level 5 logic)
        const totalTime = gameState.startTime
          ? Math.floor((now.getTime() - gameState.startTime.getTime()) / 1000)
          : 0;

        setGameState(prev => ({
          ...prev,
          completedLevels: newCompletedLevels,
          currentLevel: 5,
          endTime: now,
          levelTimestamps: newTimestamps,
          totalTimeSeconds: totalTime,
          isCompleted: true,
        }));
        setIsPlaying(false);

        await saveGameState({
          completedLevels: newCompletedLevels,
          totalTimeSeconds: totalTime,
          levelTimestamps: newTimestamps,
          isCompleted: true,
          endTime: now,
        });
        setElapsedTime(totalTime); // Force final time display
      } else {
        setGameState(prev => ({
          ...prev,
          completedLevels: newCompletedLevels,
          currentLevel: newCurrentLevel,
          levelTimestamps: newTimestamps
        }));

        await saveGameState({
          completedLevels: newCompletedLevels,
          currentLevel: newCurrentLevel,
          levelTimestamps: newTimestamps,
        });
      }
      return true;
    }

    return false;
  }, [gameState.completedLevels, gameState.startTime, gameState.levelTimestamps, saveGameState]);

  const resetGame = useCallback(async () => {
    setGameState({
      currentLevel: 1,
      completedLevels: [],
      startTime: null,
      endTime: null,
      levelTimestamps: {},
      subTasksCompleted: {},
      totalTimeSeconds: null,
      hintsUsed: 0,
      isCompleted: false,
    });
    setElapsedTime(0);
    setIsPlaying(false);

    await saveGameState({
      currentLevel: 1,
      completedLevels: [],
      startTime: undefined, // undefined won't be sent in JSON stringify usually, handling needed?
      // actually JSON.stringify will omit undefined. 
      // But my backend checks `if (startTime !== undefined)`.
      // So to reset, I might need to send null?
      // My backend schema has default null.
      // But update logic: `if (value !== undefined) updateData.val = val`.
      // If I want to set it to null, I should pass null.
      // JS undefined vs null.
      // Let's pass `null` explicitly for resets if I want to clear it.
    });

    // Fix: Pass null for reset
    await saveGameState({
      currentLevel: 1,
      completedLevels: [],
      startTime: null as unknown as Date, // Hack to satisfy type if strict
      endTime: null as unknown as Date,
      totalTimeSeconds: null as unknown as number,
      hintsUsed: 0,
      isCompleted: false,
    });

  }, [saveGameState]);

  return (
    <GameContext.Provider value={{
      gameState,
      startGame,
      completeLevel,
      completeSubTask,
      resetGame,
      elapsedTime,
      isPlaying,
      applyPenalty,
      trackHintUsage
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
};
