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
    levelStartTimes?: (string | null)[]; // Optional if not tracked precisely per level
    currentLevel: number;
    onResetLevel: (level: number) => void;
}

export const LevelModal: React.FC<LevelModalProps> = ({
    isOpen,
    onClose,
    teamName,
    levelsCompleted,
    currentLevel,
    onResetLevel
}) => {
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
