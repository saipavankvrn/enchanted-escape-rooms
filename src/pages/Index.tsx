import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Room3D from '@/components/game/Room3D';
import { Play, LogIn } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/game');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen escape-gradient relative overflow-hidden">
      {/* Background 3D Scene */}
      <div className="absolute inset-0 opacity-50">
        <Room3D level={1} isActive={true} />
      </div>

      {/* Overlay Grid */}
      <div className="absolute inset-0 cyber-grid opacity-30" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-display font-black tracking-tight">
              <span className="neon-text">ESCAPE</span>
              <br />
              <span className="neon-text-purple">ROOM</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-foreground/80 mb-4 font-light">
            5 Levels • 5 Mysteries • 1 Escape
          </p>
          <p className="text-muted-foreground mb-12 max-w-md mx-auto">
            Enter the immersive 3D escape room experience. Solve puzzles, find secret keys,
            and race against time to escape!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="cyber"
              size="xl"
              onClick={() => navigate('/auth')}
              className="group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Start Playing
            </Button>
            <Button
              variant="neon"
              size="xl"
              onClick={() => navigate('/auth')}
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </Button>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-display font-bold text-primary mb-2">5</div>
              <div className="text-sm text-muted-foreground">Challenging Levels</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-display font-bold text-secondary mb-2">3D</div>
              <div className="text-sm text-muted-foreground">Immersive Rooms</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-display font-bold text-accent mb-2">∞</div>
              <div className="text-sm text-muted-foreground">Replay Value</div>
            </div>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-4 left-0 right-0 text-center text-xs text-muted-foreground">
        © 2025 Escape Room
      </footer>
    </div>
  );
};

export default Index;
