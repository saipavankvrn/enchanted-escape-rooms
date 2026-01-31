import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lightbulb } from 'lucide-react';
import SecretKeyInput from './SecretKeyInput';

interface LevelPuzzleProps {
  level: number;
  onComplete: (key?: string) => void;
  showKeyInput: boolean;
}

const puzzles = [
  {
    title: "The Awakening",
    description: "You find yourself in a mysterious chamber. A glowing orb floats before you, pulsing with energy. To proceed, you must simply accept your fate and begin the journey.",
    hint: "Click the button to start your escape.",
    action: "Begin Journey",
    secretHint: null,
  },
  {
    title: "Shadow Realm",
    description: "Darkness surrounds you. In the shadows, whispers speak of something that follows you but never leads... What am I?",
    hint: "I am cast by light, yet I am not light itself.",
    action: "Solve & Proceed",
    secretHint: "The answer is what follows you in the light: S _ _ _ _ W",
  },
  {
    title: "Cipher Chamber",
    description: "Ancient symbols cover the walls. A cryptic message reads: 'I am a secret code, used by spies and scholars alike. What am I?'",
    hint: "Think of encryption and hidden messages.",
    action: "Decode & Proceed",
    secretHint: "The answer is what encodes messages: C _ _ _ _ R",
  },
  {
    title: "Enigma Vault",
    description: "The vault door is sealed with a riddle: 'I am a puzzle within a puzzle, a mystery wrapped in wonder. Solve me, and the path shall open.'",
    hint: "Think of something mysterious and puzzling.",
    action: "Unravel & Proceed",
    secretHint: "The answer is another word for mystery: E _ _ _ _ A",
  },
  {
    title: "Final Escape",
    description: "The exit is before you! One last challenge: 'I am what you seek, the end of your journey, the freedom you desire. What word describes leaving this place?'",
    hint: "What do you want to do from this room?",
    action: "Complete & Escape!",
    secretHint: "You want to E _ _ _ _ E from this room!",
  },
];

const LevelPuzzle = ({ level, onComplete, showKeyInput }: LevelPuzzleProps) => {
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const puzzle = puzzles[level - 1];

  const handleKeySubmit = async (key: string) => {
    setError(null);
    onComplete(key);
  };

  const handleAction = () => {
    if (level === 1) {
      onComplete();
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <span className="text-xs font-display uppercase tracking-wider text-primary">
          Level {level} of 5
        </span>
        <h2 className="mt-2 text-3xl font-display font-bold neon-text">
          {puzzle.title}
        </h2>
      </div>

      <p className="text-lg text-center text-foreground/90 leading-relaxed mb-8">
        {puzzle.description}
      </p>

      {showHint && (
        <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/30">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground/80">{puzzle.hint}</p>
              {puzzle.secretHint && (
                <p className="mt-2 text-sm font-display text-primary">{puzzle.secretHint}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-center">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {level === 1 ? (
          <Button onClick={handleAction} variant="cyber" size="xl" className="w-full">
            {puzzle.action}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        ) : showKeyInput ? (
          <SecretKeyInput onSubmit={handleKeySubmit} />
        ) : (
          <div className="text-center text-muted-foreground">
            Complete the previous level to unlock this puzzle.
          </div>
        )}

        {!showHint && puzzle.hint && (
          <Button
            onClick={() => setShowHint(true)}
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Need a hint?
          </Button>
        )}
      </div>
    </div>
  );
};

export default LevelPuzzle;
