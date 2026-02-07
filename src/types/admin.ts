export interface PlayerData {
    id: string;
    username: string;
    current_level: number;
    completed_levels: number[];
    total_time_seconds: number | null;
    is_completed: boolean;
    created_at: string;
    end_time: string | null;
    start_time?: string; // Add start_time if backend returns it (it should)
}

export interface Team extends PlayerData {
    // Alias for compatibility if needed, but mainly we use PlayerData
    // We can add projected fields like 'remainingTime' if we calculate it on frontend
    remainingTime?: number;
    status?: 'Active' | 'Completed' | 'Not Started';
}

export const LEVELS_COUNT = 5;
export const TOTAL_GAME_TIME_SECONDS = 50 * 60; // 50 minutes
