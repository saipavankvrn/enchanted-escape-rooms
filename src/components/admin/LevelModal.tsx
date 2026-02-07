import React from 'react';
import { X, CheckCircle, Circle, AlertTriangle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { LEVELS_COUNT } from '@/types/admin';

interface LevelModalProps {
    isOpen: boolean;
    onClose: () => void;
    teamName: string;
    levelsCompleted: number[];
    levelTimestamps?: Record<number, string>; // Replaced array with map
    gameStartTime?: string;
    currentLevel: number;
    onResetLevel: (level: number) => void;
}

const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
};

export const LevelModal: React.FC<LevelModalProps> = ({
    isOpen,
    onClose,
    teamName,
    levelsCompleted,
    currentLevel,
    levelTimestamps,
    gameStartTime,
    onResetLevel
}) => {
    const getDuration = (level: number) => {
        // Determine Start of this level
        let startTime: number | null = null;

        if (level === 1) {
            if (gameStartTime) {
                startTime = new Date(gameStartTime).getTime();
            }
        } else {
            const prevTimestampStr = levelTimestamps ? levelTimestamps[level - 1] : null;
            if (prevTimestampStr) {
                startTime = new Date(prevTimestampStr).getTime();
            }
        }

        // Determine End of this level
        const currentTimestampStr = levelTimestamps ? levelTimestamps[level] : null;
        let endTime = currentTimestampStr ? new Date(currentTimestampStr).getTime() : null;

        // If level is completed but no timestamp (legacy data), we can't show duration
        const isCompleted = levelsCompleted.includes(level);
        if (isCompleted && !endTime) {
            return 'Legacy (No Time)';
        }

        // If level is current (active) and not completed, use Now as end time for display
        // Note: This won't tick live unless we add a state, but it will show snapshot on open
        if (currentLevel === level && !isCompleted && startTime) {
            // Check if we are "in" the level. 
            // If we have startTime, we are in it.
            endTime = Date.now();
        }

        if (startTime && endTime) {
            // Prevent negative time if clocks out of sync or something weird
            return formatTime(Math.max(0, endTime - startTime));
        }

        return '--';
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="glass-panel border-primary/20 bg-[#0A0A0F]/95 text-foreground max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="neon-text-purple text-xl flex justify-between items-center">
                        <span>LEVEL STATUS: {teamName}</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-5 gap-4 my-6">
                    {Array.from({ length: LEVELS_COUNT }).map((_, index) => {
                        const levelNum = index + 1;
                        const isCompleted = levelsCompleted.includes(levelNum);
                        const isCurrent = currentLevel === levelNum;

                        return (
                            <div
                                key={levelNum}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${isCompleted
                                    ? 'bg-success/20 border-success text-success'
                                    : isCurrent
                                        ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                                        : 'bg-muted/10 border-muted text-muted-foreground'
                                    }`}
                            >
                                <div className="font-bold mb-2">LVL {levelNum}</div>
                                {isCompleted ? (
                                    <CheckCircle className="w-6 h-6" />
                                ) : isCurrent ? (
                                    <ActivityIcon className="w-6 h-6 animate-pulse" />
                                ) : (
                                    <Circle className="w-6 h-6" />
                                )}

                                <div className="text-[10px] mt-1 font-mono opacity-80 h-4 min-w-[50px] text-center">
                                    {getDuration(levelNum)}
                                </div>

                                <div className="mt-4 w-full">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full text-[10px] h-6 border border-white/10 hover:bg-destructive/20 hover:text-destructive"
                                        onClick={() => {
                                            if (confirm(`Are you sure you want to RESET ${teamName} to Level ${levelNum}? This will clear progress for levels ${levelNum} and above.`)) {
                                                onResetLevel(levelNum);
                                            }
                                        }}
                                    >
                                        Reset Here
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="text-center text-muted-foreground text-sm">
                    STATUS: {levelsCompleted.length} / {LEVELS_COUNT} UPLINKS ESTABLISHED
                </div>
            </DialogContent>
        </Dialog>
    );
};

const ActivityIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);
