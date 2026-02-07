import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lightbulb } from 'lucide-react';
import SecretKeyInput from './SecretKeyInput';
import PasswordRoom from './PasswordRoom';
import WhisperingPorch from './level1/WhisperingPorch';
import HallOfMirrors from './level2/HallOfMirrors';
import CursedLibrary from './level3/CursedLibrary';
import EnigmaVault from './level4/EnigmaVault';
import FinalEscape from './level5/FinalEscape';

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
    title: "The Hall of Mirrors",
    description: "Identity is fluid here. Reflections lie. To find the key, you must discern truth from fabrication across three realms: Time, Space, and Voice.",
    hint: "Check the tabs for different investigations. Look for inconsistencies.",
    action: "Solve & Proceed",
    secretHint: "Collect the 3 shards to form the key: SH - AD - OW",
  },
  {
    title: "The Cursed Library",
    description: "Ancient texts and forbidden scrolls surround you. The knowledge is protected by layers of complexity. Only those who calculate strength can unlock the voltage gate.",
    hint: "Find the strong passwords. Then order them by length.",
    action: "Decode & Proceed",
    secretHint: "Combine the fragments: CIP - HER",
  },
  {
    title: "The Enigma Vault",
    description: "The vault door is locked by a database query. A vulnerability lies within the schema. Manipulate the input to bypass authentication.",
    hint: "Identify the vulnerable column, then use SQL Injection on the username.",
    action: "Unravel & Proceed",
    secretHint: "The key is ENIGMA.",
  },
  {
    title: "The Final Escape",
    description: "The core of the system. You must breach the firewall, decrypt the master sequence, and execute the override command.",
    hint: "Network -> Cipher -> Terminal. Follow the flow.",
    action: "Complete & Escape!",
    secretHint: "Combine fragments: ES - CA - PE.",
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
          <>
            <WhisperingPorch />
            {showKeyInput && (
              <div className="mt-8 pt-8 border-t border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <p className="text-center text-sm text-muted-foreground mb-4">
                  SYSTEM KEY FRAGMENTS RECOVERED. ASSEMBLE TO PROCEED.
                </p>
                <SecretKeyInput onSubmit={handleKeySubmit} />
              </div>
            )}
          </>
        ) : level === 2 ? (
          <>
            <HallOfMirrors />
            {showKeyInput && (
              <div className="mt-8 pt-8 border-t border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <p className="text-center text-sm text-muted-foreground mb-4">
                  MIRROR SHARDS ALIGNED. KEY SYNTHESIS READY.
                </p>
                <SecretKeyInput onSubmit={handleKeySubmit} />
              </div>
            )}
          </>
        ) : level === 3 ? (
          <>
            <CursedLibrary />
            {showKeyInput && (
              <div className="mt-8 pt-8 border-t border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <p className="text-center text-sm text-muted-foreground mb-4">
                  VOLTAGE GATE OPEN. ENTER ACCESS CODE.
                </p>
                <SecretKeyInput onSubmit={handleKeySubmit} />
              </div>
            )}
          </>
        ) : level === 4 ? (
          <>
            <EnigmaVault />
            {showKeyInput && (
              <div className="mt-8 pt-8 border-t border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <p className="text-center text-sm text-muted-foreground mb-4">
                  DATABASE BREACHED. ADMIN ACCESS GRANTED.
                </p>
                <SecretKeyInput onSubmit={handleKeySubmit} />
              </div>
            )}
          </>
        ) : level === 5 ? (
          <>
            <FinalEscape />
            {showKeyInput && (
              <div className="mt-8 pt-8 border-t border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <p className="text-center text-sm text-muted-foreground mb-4">
                  SYSTEM OVERRIDE SUCCESSFUL. INITIATING FINAL PROTOCOL.
                </p>
                <SecretKeyInput onSubmit={handleKeySubmit} />
              </div>
            )}
          </>
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
            className="w-full text-muted-foreground hover:text-primary"
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
