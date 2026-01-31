import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Trophy, Clock, RefreshCw } from 'lucide-react';

interface PlayerData {
  id: string;
  username: string;
  current_level: number;
  completed_levels: number[];
  total_time_seconds: number | null;
  is_completed: boolean;
  created_at: string;
}

const Admin = () => {
  const { user, loading, isAdmin } = useAuth();
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/game');
    }
  }, [user, loading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchPlayers();
    }
  }, [isAdmin]);

  const fetchPlayers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setPlayers(data as PlayerData[]);
    }
    setIsLoading(false);
  };

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '—';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const completedPlayers = players.filter(p => p.is_completed);
  const activePlayers = players.filter(p => !p.is_completed && p.current_level > 1);

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
                  <p className="text-muted-foreground text-sm">Completed</p>
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
                  <p className="text-muted-foreground text-sm">Active Players</p>
                  <p className="text-3xl font-display font-bold">{activePlayers.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Players Table */}
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-display font-bold">All Players</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 font-display text-sm uppercase tracking-wider text-muted-foreground">
                      Username
                    </th>
                    <th className="text-left p-4 font-display text-sm uppercase tracking-wider text-muted-foreground">
                      Current Level
                    </th>
                    <th className="text-left p-4 font-display text-sm uppercase tracking-wider text-muted-foreground">
                      Levels Completed
                    </th>
                    <th className="text-left p-4 font-display text-sm uppercase tracking-wider text-muted-foreground">
                      Total Time
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
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-display font-bold">
                          {player.current_level}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                                player.completed_levels?.includes(level)
                                  ? 'bg-success text-background'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {level}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 font-display">
                        {formatTime(player.total_time_seconds)}
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
