import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Trophy, Clock, RefreshCw } from 'lucide-react';
import { io } from 'socket.io-client';
import { TeamList } from '@/components/admin/TeamList';
import { PlayerData } from '@/types/admin';
import { toast } from 'sonner';

const API_URL = `http://${window.location.hostname}:5000/api/admin`;
const SOCKET_URL = `http://${window.location.hostname}:5000`;

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

  const handleResetLevel = async (id: string, level: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/players/${id}/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ level })
      });

      if (res.ok) {
        toast.success(`Team reset to Level ${level}`);
        fetchPlayers();
      } else {
        toast.error('Failed to reset level');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error resetting level');
    }
  };

  const handleTimeAdjustment = async (id: string, type: 'add' | 'deduct') => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/players/${id}/time`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ seconds: 300, action: type }) // 5 minutes = 300s
      });

      if (res.ok) {
        toast.success(type === 'add' ? 'Time added (+5m)' : 'Time deducted (-5m)');
        fetchPlayers();
      } else {
        toast.error('Failed to update time');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating time');
    }
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

          {/* Players Table / TeamList */}
          <TeamList
            teams={players}
            onDeductTime={(id) => handleTimeAdjustment(id, 'deduct')}
            onAddTime={(id) => handleTimeAdjustment(id, 'add')}
            onResetLevel={handleResetLevel}
          />
        </div>
      </main>
    </div>
  );
};

export default Admin;
