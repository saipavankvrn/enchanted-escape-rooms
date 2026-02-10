import { Lock, CheckCircle, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LevelCardProps {
  level: number;
  isLocked: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
  onClick: () => void;
}

const levelNames = [
  'The Whispering Porch',
  'The Hall of Mirrors',
  'The Cold Kitchen',
  'The Cursed Library',
  'The Shadow Heart',
];

const levelDescriptions = [
  'Identify and neutralize the malware threat.',
  'Find the truth amidst the reflections.',
  'Decrypt the enigma code.',
  'Bypass the vault security with SQL injection.',
  'Execute the final override command.',
];

const LevelCard = ({ level, isLocked, isCompleted, isCurrent, onClick }: LevelCardProps) => {
  const levelIndex = level - 1;

  return (
    <div
      onClick={!isLocked ? onClick : undefined}
      className={cn(
        'level-card p-6 min-h-[200px] flex flex-col justify-between',
        isLocked && 'level-card-locked cursor-not-allowed',
        !isLocked && !isCompleted && 'level-card-unlocked',
        isCompleted && 'level-card-completed',
        isCurrent && !isCompleted && 'level-card-current'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-display uppercase tracking-wider text-muted-foreground">
            Level {level}
          </span>
          <h3 className={cn(
            'mt-1 text-xl font-display font-bold',
            isCurrent && !isCompleted && 'neon-text',
            isCompleted && 'text-success'
          )}>
            {levelNames[levelIndex]}
          </h3>
        </div>

        <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-border">
          {isLocked && <Lock className="w-5 h-5 text-muted-foreground" />}
          {isCompleted && <CheckCircle className="w-5 h-5 text-success" />}
          {!isLocked && !isCompleted && isCurrent && (
            <Play className="w-5 h-5 text-primary animate-pulse" />
          )}
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {levelDescriptions[levelIndex]}
      </p>

      <div className="mt-4 flex items-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-all duration-500',
              i < level ? 'bg-primary/50' : 'bg-border',
              i === levelIndex && isCurrent && 'bg-primary animate-pulse'
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default LevelCard;
