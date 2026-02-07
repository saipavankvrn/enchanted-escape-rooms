import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './useAuth';

interface GameState {
  currentLevel: number;
  completedLevels: number[];
  startTime: Date | null;
  endTime: Date | null;
  levelTimestamps: Record<number, string>; // ISO strings from DB or Date objects
  totalTimeSeconds: number | null;
  isCompleted: boolean;
}

interface GameContextType {
  gameState: GameState;
  startGame: () => void;
  completeLevel: (level: number, secretKey: string) => Promise<boolean>;
  resetGame: () => void;
  elapsedTime: number;
  isPlaying: boolean;
}

const levelSecrets: Record<number, string> = {
  2: 'SHADOW',
  3: 'CIPHER',
  4: 'ENIGMA',
  5: 'ESCAPE',
};

const GameContext = createContext<GameContextType | undefined>(undefined);

const API_URL = `http://${window.location.hostname}:5000/api/game`;

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 1,
    completedLevels: [],
    startTime: null,
    endTime: null,
    levelTimestamps: {},
    totalTimeSeconds: null,
    isCompleted: false,
  });
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load game state from database
  useEffect(() => {
    if (user) {
      loadGameState();
    }
  }, [user]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && gameState.startTime && !gameState.isCompleted) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - gameState.startTime!.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameState.startTime, gameState.isCompleted]);

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
          totalTimeSeconds: data.total_time_seconds,
          isCompleted: data.is_completed || false,
        });

        if (startTime && !data.is_completed) {
          setIsPlaying(true);
          const now = new Date();
          const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
          setElapsedTime(elapsed);
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

  const completeLevel = useCallback(async (level: number, secretKey: string): Promise<boolean> => {
    // Level 1 completes without a key
    if (level === 1) {
      const now = new Date();
      const newCompletedLevels = [...gameState.completedLevels, 1];
      const newCurrentLevel = 2;
      const newTimestamps = { ...gameState.levelTimestamps, 1: now.toISOString() };

      setGameState(prev => ({
        ...prev,
        completedLevels: newCompletedLevels,
        currentLevel: newCurrentLevel,
        levelTimestamps: newTimestamps,
      }));

      await saveGameState({
        completedLevels: newCompletedLevels,
        currentLevel: newCurrentLevel,
        levelTimestamps: newTimestamps
      });
      return true;
    }

    // For levels 2-5, check the secret key
    const nextLevel = level + 1;
    const expectedKey = levelSecrets[nextLevel];

    if (secretKey.toUpperCase() === expectedKey || level === 5) {
      const now = new Date();
      const newCompletedLevels = [...gameState.completedLevels, level];
      const newTimestamps = { ...gameState.levelTimestamps, [level]: now.toISOString() };

      if (level === 5) {
        // Game completed!
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
          currentLevel: 5,
          endTime: now,
          levelTimestamps: newTimestamps,
          totalTimeSeconds: totalTime,
          isCompleted: true,
        });
      } else {
        setGameState(prev => ({
          ...prev,
          completedLevels: newCompletedLevels,
          currentLevel: nextLevel,
          levelTimestamps: newTimestamps
        }));

        await saveGameState({
          completedLevels: newCompletedLevels,
          currentLevel: nextLevel,
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
      totalTimeSeconds: null,
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
      isCompleted: false,
    });

  }, [saveGameState]);

  return (
    <GameContext.Provider value={{
      gameState,
      startGame,
      completeLevel,
      resetGame,
      elapsedTime,
      isPlaying
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
