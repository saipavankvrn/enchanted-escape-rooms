import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface GameState {
  currentLevel: number;
  completedLevels: number[];
  startTime: Date | null;
  endTime: Date | null;
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

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 1,
    completedLevels: [],
    startTime: null,
    endTime: null,
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

    const { data, error } = await supabase
      .from('profiles')
      .select('current_level, completed_levels, start_time, end_time, total_time_seconds, is_completed')
      .eq('user_id', user.id)
      .single();

    if (data && !error) {
      const startTime = data.start_time ? new Date(data.start_time) : null;
      setGameState({
        currentLevel: data.current_level || 1,
        completedLevels: data.completed_levels || [],
        startTime,
        endTime: data.end_time ? new Date(data.end_time) : null,
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
  };

  const saveGameState = useCallback(async (newState: Partial<GameState>) => {
    if (!user) return;

    const updateData: Record<string, unknown> = {};
    
    if (newState.currentLevel !== undefined) updateData.current_level = newState.currentLevel;
    if (newState.completedLevels !== undefined) updateData.completed_levels = newState.completedLevels;
    if (newState.startTime !== undefined) updateData.start_time = newState.startTime?.toISOString();
    if (newState.endTime !== undefined) updateData.end_time = newState.endTime?.toISOString();
    if (newState.totalTimeSeconds !== undefined) updateData.total_time_seconds = newState.totalTimeSeconds;
    if (newState.isCompleted !== undefined) updateData.is_completed = newState.isCompleted;

    await supabase
      .from('profiles')
      .update(updateData)
      .eq('user_id', user.id);
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
      const newCompletedLevels = [...gameState.completedLevels, 1];
      const newCurrentLevel = 2;
      
      setGameState(prev => ({
        ...prev,
        completedLevels: newCompletedLevels,
        currentLevel: newCurrentLevel,
      }));
      
      await saveGameState({ 
        completedLevels: newCompletedLevels, 
        currentLevel: newCurrentLevel 
      });
      return true;
    }

    // For levels 2-5, check the secret key
    const nextLevel = level + 1;
    const expectedKey = levelSecrets[nextLevel];
    
    if (secretKey.toUpperCase() === expectedKey || level === 5) {
      const newCompletedLevels = [...gameState.completedLevels, level];
      
      if (level === 5) {
        // Game completed!
        const now = new Date();
        const totalTime = gameState.startTime 
          ? Math.floor((now.getTime() - gameState.startTime.getTime()) / 1000)
          : 0;
        
        setGameState(prev => ({
          ...prev,
          completedLevels: newCompletedLevels,
          currentLevel: 5,
          endTime: now,
          totalTimeSeconds: totalTime,
          isCompleted: true,
        }));
        setIsPlaying(false);
        
        await saveGameState({
          completedLevels: newCompletedLevels,
          currentLevel: 5,
          endTime: now,
          totalTimeSeconds: totalTime,
          isCompleted: true,
        });
      } else {
        setGameState(prev => ({
          ...prev,
          completedLevels: newCompletedLevels,
          currentLevel: nextLevel,
        }));
        
        await saveGameState({
          completedLevels: newCompletedLevels,
          currentLevel: nextLevel,
        });
      }
      return true;
    }
    
    return false;
  }, [gameState.completedLevels, gameState.startTime, saveGameState]);

  const resetGame = useCallback(async () => {
    setGameState({
      currentLevel: 1,
      completedLevels: [],
      startTime: null,
      endTime: null,
      totalTimeSeconds: null,
      isCompleted: false,
    });
    setElapsedTime(0);
    setIsPlaying(false);
    
    await saveGameState({
      currentLevel: 1,
      completedLevels: [],
      startTime: undefined,
      endTime: undefined,
      totalTimeSeconds: undefined,
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
