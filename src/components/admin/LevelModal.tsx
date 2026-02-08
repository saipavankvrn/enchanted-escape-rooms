import React from 'react';
import { X, CheckCircle, Circle, AlertTriangle, Activity } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { LEVELS_COUNT } from '@/types/admin';
import { format } from 'date-fns';

interface LevelModalProps {
    isOpen: boolean;
    onClose: () => void;
    teamName: string;
    levelsCompleted: number[];
    levelTimestamps?: Record<number, string>;
    gameStartTime?: string;
    currentLevel: number;
    onResetLevel: (level: number) => void;
    onResetTimer: () => void;
    onDeleteUser: () => void;
}

const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}m ${s}s`;
};

const formatTime = (dateStr: string) => {
    try {
        return format(new Date(dateStr), 'hh:mm:ss a');
    } catch (e) {
        return '--';
    }
};

export const LevelModal: React.FC<LevelModalProps> = ({
    isOpen,
    onClose,
    teamName,
    levelsCompleted,
    currentLevel,
    levelTimestamps,
    gameStartTime,
    onResetLevel,
    onResetTimer,
    onDeleteUser
}) => {

    // We need a force update or local state to tick the "current" level timer if we want it live.
    // For now, static snapshot on open is fine.

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="glass-panel border-primary/20 bg-[#0A0A0F]/95 text-foreground max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="neon-text-purple text-xl tracking-widest flex items-center justify-between border-b border-primary/20 pb-4">
                        <span>MISSION STATUS: {teamName}</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-5 gap-4 py-6">
                    {Array.from({ length: LEVELS_COUNT }).map((_, index) => {
                        const levelNum = index + 1;
                        const isCompleted = levelsCompleted.includes(levelNum);
                        const isCurrent = currentLevel === levelNum;

                        // Calculate Timeline
                        let startTime: string | null = null;
                        let endTime: string | null = null;

                        if (levelNum === 1) {
                            startTime = gameStartTime || null;
                        } else {
                            // Start time is end of previous level
                            startTime = levelTimestamps ? levelTimestamps[levelNum - 1] : null;
                        }

                        // End time is completion of this level
                        if (isCompleted) {
                            endTime = levelTimestamps ? levelTimestamps[levelNum] : null;
                        } else if (isCurrent) {
                            // For current level, "end" is technically "now" for duration calc
                            endTime = new Date().toISOString();
                        }

                        let duration = "--";
                        if (startTime && endTime) {
                            const start = new Date(startTime).getTime();
                            const end = new Date(endTime).getTime();
                            duration = formatDuration(Math.max(0, end - start));
                        }

                        return (
                            <div
                                key={levelNum}
                                className={`
                                    relative flex flex-col p-4 rounded-xl border-2 transition-all duration-300
                                    ${isCompleted ? 'bg-green-900/10 border-green-500/50' :
                                        isCurrent ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(139,92,246,0.2)]' :
                                            'bg-muted/5 border-white/5 opacity-60'}
                                `}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`text-xl font-display font-bold ${isCompleted ? 'text-green-400' : isCurrent ? 'text-primary' : 'text-slate-500'}`}>
                                        LVL {levelNum}
                                    </span>
                                    {isCompleted ? <CheckCircle className="w-5 h-5 text-green-500" /> :
                                        isCurrent ? <Activity className="w-5 h-5 text-primary animate-pulse" /> :
                                            <Circle className="w-5 h-5 text-slate-700" />}
                                </div>

                                <div className="space-y-2 text-xs font-mono mb-4 flex-1">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Duration:</span>
                                        <span className={`font-bold ${isCompleted ? 'text-white' : isCurrent ? 'text-yellow-400 animate-pulse' : 'text-slate-600'}`}>
                                            {duration}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Started:</span>
                                        <span className="text-slate-300">{startTime ? formatTime(startTime) : '--'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Completed:</span>
                                        <span className="text-slate-300">{isCompleted && levelTimestamps?.[levelNum] ? formatTime(levelTimestamps[levelNum]) : '--'}</span>
                                    </div>
                                </div>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full text-xs h-7 border-slate-700 hover:bg-destructive hover:text-white hover:border-destructive transition-colors"
                                    onClick={() => {
                                        if (confirm(`RESET LEVEL PROGRESS?\n\nTeam: ${teamName}\nTarget Level: ${levelNum}\n\nWARNING: This will wipe progress for this level and all subsequent levels.`)) {
                                            onResetLevel(levelNum);
                                            onClose();
                                        }
                                    }}
                                >
                                    Reset
                                </Button>
                            </div>
                        );
                    })}
                </div>

                <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                    <div className="flex gap-2">
                        <Button
                            variant="destructive"
                            className="bg-red-900/40 hover:bg-red-800 text-red-100 border border-red-800"
                            onClick={() => {
                                onClose();
                                onDeleteUser();
                            }}
                        >
                            Delete Team
                        </Button>
                        <Button
                            variant="secondary"
                            className="bg-yellow-900/40 hover:bg-yellow-800 text-yellow-100 border border-yellow-800"
                            onClick={() => {
                                onClose();
                                onResetTimer();
                            }}
                        >
                            Reset Timer
                        </Button>
                    </div>
                    <div className="text-xs text-slate-400 font-mono text-right">
                        <div>SESSION ID: {btoa(teamName).substring(0, 8)}</div>
                        <div>TOTAL UPLINKS: {levelsCompleted.length} / {LEVELS_COUNT}</div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
