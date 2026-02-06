import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Trophy, Clock, RefreshCw } from 'lucide-react';
import { io } from 'socket.io-client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PlayerData {
  id: string;
  username: string;
  current_level: number;
  completed_levels: number[];
  total_time_seconds: number | null;
  is_completed: boolean;
  created_at: string;
  end_time: string | null;
}

const API_URL = 'http://localhost:5000/api/admin';
const SOCKET_URL = 'http://localhost:5000';

const Admin = () => {
  const { user, loading, isAdmin } = useAuth();
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        navigate('/game');
      }
    }
  }, [user, loading, isAdmin, navigate]);

  const fetchPlayers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/players`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setPlayers(data);
      }
    } catch (error) {
      console.error('Failed to fetch players', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;

    fetchPlayers();

    // Socket.io connection
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('postgres_changes', (payload: any) => {
      console.log('Real-time update received:', payload);
      fetchPlayers();
    });

    return () => {
      socket.disconnect();
    };
  }, [isAdmin]);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '—';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString();
  };

  const completedPlayers = players.filter(p => p.is_completed);
  const activePlayers = players.filter(p => !p.is_completed && p.current_level >= 1);

  if (loading) {
    return (
      <div className="min-h-screen escape-gradient flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen escape-gradient">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/game')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Game
            </Button>
            <h1 className="text-xl font-display font-bold neon-text-purple">ADMIN DASHBOARD</h1>
          </div>

          <Button variant="ghost" size="sm" onClick={fetchPlayers}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-panel rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total Players</p>
                  <p className="text-3xl font-display font-bold">{players.length}</p>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Escaped Teams</p>
                  <p className="text-3xl font-display font-bold">{completedPlayers.length}</p>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Active Teams</p>
                  <p className="text-3xl font-display font-bold">{activePlayers.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Players Table */}
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-display font-bold">Team Progress</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 font-display text-sm uppercase tracking-wider text-muted-foreground">
                      Team / User
                    </th>

                    <th className="text-left p-4 font-display text-sm uppercase tracking-wider text-muted-foreground">
                      Current Level
                    </th>
                    <th className="text-left p-4 font-display text-sm uppercase tracking-wider text-muted-foreground">
                      Levels Completed
                    </th>
                    <th className="text-left p-4 font-display text-sm uppercase tracking-wider text-muted-foreground">
                      Completed At
                    </th>
                    <th className="text-left p-4 font-display text-sm uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr key={player.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium">{player.username}</td>

                      <td className="p-4">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-display font-bold hover:bg-primary/30 transition-colors cursor-pointer ring-0 focus:outline-none focus:ring-2 focus:ring-primary/50">
                              {player.current_level}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-4 glass-panel border-border/50 bg-[#0A0A0F]/95 backdrop-blur-xl">
                            <div className="space-y-4">
                              <div className="border-b border-border/50 pb-2">
                                <h4 className="font-display font-bold text-lg text-primary">Level Progress</h4>
                                <p className="text-xs text-muted-foreground">Team: {player.username}</p>
                              </div>
                              <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map((level) => {
                                  const isCompleted = player.completed_levels?.includes(level);
                                  const isLevel5 = level === 5;
                                  const showTimestamp = isLevel5 && player.is_completed;
                                  const timestamp = showTimestamp && player.end_time ? formatDate(player.end_time) : '—';

                                  return (
                                    <div key={level} className="flex items-center justify-between text-sm">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${isCompleted ? 'bg-success text-background' : 'bg-muted/50 text-muted-foreground'
                                          }`}>
                                          {level}
                                        </div>
                                        <span className={isCompleted ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                                          Level {level}
                                        </span>
                                      </div>
                                      <div className="text-right">
                                        <div className="flex items-center justify-end gap-1.5 mb-0.5">
                                          {isCompleted ? (
                                            <span className="text-success text-xs font-medium">Completed</span>
                                          ) : (
                                            <span className="text-muted-foreground text-xs">Not Started</span>
                                          )}
                                        </div>
                                        <div className="text-xs text-muted-foreground font-mono">
                                          {timestamp}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${player.completed_levels?.includes(level)
                                ? 'bg-success text-background'
                                : 'bg-muted text-muted-foreground'
                                }`}
                            >
                              {level}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {player.is_completed ? formatDate(player.end_time) : '—'}
                      </td>
                      <td className="p-4">
                        {player.is_completed ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/20 text-success text-xs font-medium">
                            <Trophy className="w-3 h-3" />
                            Escaped
                          </span>
                        ) : player.current_level > 1 ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                            Playing
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                            Not Started
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {players.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No players yet. Be the first to play!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
