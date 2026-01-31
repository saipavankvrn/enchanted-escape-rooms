import { Clock } from 'lucide-react';

interface TimerProps {
  seconds: number;
  isRunning: boolean;
}

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const Timer = ({ seconds, isRunning }: TimerProps) => {
  return (
    <div className="flex items-center gap-3 glass-panel rounded-lg px-4 py-2">
      <Clock className={`w-5 h-5 ${isRunning ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
      <span className="font-display text-2xl tracking-wider tabular-nums">
        {formatTime(seconds)}
      </span>
    </div>
  );
};

export default Timer;
