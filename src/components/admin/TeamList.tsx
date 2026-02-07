
import React, { useState, useEffect } from 'react';
import { Eye, Clock, Hash, Activity, Trophy, Play, Pause, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LevelModal } from './LevelModal';
import { PlayerData, Team } from '@/types/admin';

interface TeamListProps {
    teams: PlayerData[];
    onUpdateStatus?: (id: string, status: string) => void; // Not fully implemented in backend yet
    onDeductTime: (id: string) => void;
    onAddTime: (id: string) => void;
    onResetLevel: (id: string, level: number) => void;
}

export const TeamList: React.FC<TeamListProps> = ({
    teams,
    onUpdateStatus,
    onDeductTime,
    onAddTime,
    onResetLevel
}) => {
    const [sortField, setSortField] = useState<keyof PlayerData | 'rank' | 'remainingTime'>('username');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [selectedTeam, setSelectedTeam] = useState<PlayerData | null>(null);

    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(Date.now());
        }, 5000); // Refresh every 5 seconds
        return () => clearInterval(timer);
    }, []);

    // Calculate rank and remaining time for display/sorting
    const processedTeams = teams.map((team, index) => {
        // Calculate remaining time relative to start time?
        // Since backend handles "Total Time" for completion, 
        // for active game: Remaining = Limit - (Now - StartTime)
        // Limit = 50 mins = 3000s

        let remainingTime = 3000;
        let timeElapsed = 0;

        if (team.start_time) {
            const start = new Date(team.start_time).getTime();
            const now = currentTime; // Use live state
            const elapsedRaw = (now - start) / 1000;
            timeElapsed = Math.max(0, elapsedRaw);
            remainingTime = Math.max(0, 3000 - elapsedRaw);
        }

        return {
            ...team,
            rank: 0, // Will compute later
            remainingTime,
            timeElapsed,
            status: team.is_completed ? 'Completed' : (remainingTime > 0 ? 'Active' : 'Timed Out')
        };
    });

    // Sort by levels completed desc, then remaining time
    const rankedTeams = [...processedTeams].sort((a, b) => {
        const aLevels = a.current_level + (a.is_completed ? 1 : 0);
        const bLevels = b.current_level + (b.is_completed ? 1 : 0);

        if (aLevels !== bLevels) return bLevels - aLevels;
        return b.remainingTime - a.remainingTime;
    }).map((t, i) => ({ ...t, rank: i + 1 }));


    // Sort based on user selection
    const sortedDisplayTeams = [...rankedTeams].sort((a, b) => {
        const aValue = a[sortField as keyof typeof a];
        const bValue = b[sortField as keyof typeof b];

        if (aValue === bValue) return 0;
        // @ts-ignore
        if (aValue < bValue!) return sortDirection === 'asc' ? -1 : 1;
        // @ts-ignore
        if (aValue > bValue!) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (field: any) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleExport = () => {
        const headers = [
            'Rank',
            'Team Name',
            'Level',
            'Status',
            'Time Consumption (m:s)',
            'Remaining Time (m:s)',
            'Start Time'
        ];

        const rows = sortedDisplayTeams.map(t => [
            t.rank,
            `"${t.username.replace(/"/g, '""')}"`, // Escape quotes
            t.current_level,
            t.status,
            formatTime(t.timeElapsed),
            formatTime(t.remainingTime),
            t.start_time ? new Date(t.start_time).toLocaleString() : '-'
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `escape_room_export_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="glass-panel overflow-hidden">
            <div className="p-4 flex justify-end">
                <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white">
                    Export to Excel
                </Button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted/20 border-b border-border text-muted-foreground font-display uppercase tracking-wider">
                        <tr>
                            <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('rank')}>
                                <div className="flex items-center gap-2"><Hash className="w-4 h-4" /> Rank</div>
                            </th>
                            <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('username')}>
                                Team Name
                            </th>
                            <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('current_level')}>
                                Level
                            </th>
                            <th className="p-4">Status</th>
                            <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('remainingTime')}>
                                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> Time</div>
                            </th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {sortedDisplayTeams.map((team) => (
                            <tr key={team.id} className="hover:bg-muted/10 transition-colors group">
                                <td className="p-4 font-mono font-bold text-lg text-primary">#{team.rank}</td>
                                <td className="p-4 font-bold text-foreground">{team.username}</td>
                                <td className="p-4">
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/50">
                                        Lvl {team.current_level}
                                    </Badge>
                                </td>
                                <td className="p-4">
                                    <div className={`flex items-center gap-2 ${team.status === 'Completed' ? 'text-success' :
                                        team.status === 'Active' ? 'text-white' : 'text-destructive'
                                        }`}>
                                        {team.status === 'Completed' ? <Trophy className="w-4 h-4" /> :
                                            team.status === 'Active' ? <Activity className="w-4 h-4 animate-pulse" /> :
                                                <AlertTriangle className="w-4 h-4" />}
                                        {team.status}
                                    </div>
                                </td>
                                <td className={`p-4 font-mono text-lg font-bold ${team.remainingTime < 300 && team.status === 'Active' ? 'text-destructive animate-pulse' : 'text-success'
                                    }`}>
                                    {team.is_completed ? formatTime(team.total_time_seconds || 0) : formatTime(team.remainingTime)}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-primary/50 text-foreground hover:bg-primary/20"
                                            onClick={() => setSelectedTeam(team)}
                                        >
                                            <Eye className="w-4 h-4 mr-1" /> Details
                                        </Button>

                                        {!team.is_completed && (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-success/50 text-success hover:bg-success/20"
                                                    onClick={() => onAddTime(team.id)}
                                                    title="+5 Minutes"
                                                >
                                                    +5m
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-destructive/50 text-destructive hover:bg-destructive/20"
                                                    onClick={() => onDeductTime(team.id)}
                                                    title="-5 Minutes (Penalty)"
                                                >
                                                    -5m
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedTeam && (
                <LevelModal
                    isOpen={!!selectedTeam}
                    onClose={() => setSelectedTeam(null)}
                    teamName={selectedTeam.username}
                    levelsCompleted={selectedTeam.completed_levels}
                    currentLevel={selectedTeam.current_level}
                    levelTimestamps={selectedTeam.level_timestamps}
                    gameStartTime={selectedTeam.start_time}
                    onResetLevel={(level) => {
                        onResetLevel(selectedTeam.id, level);
                        setSelectedTeam(null);
                    }}
                />
            )}
        </div>
    );
};
