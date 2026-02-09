import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lightbulb } from 'lucide-react';
import SecretKeyInput from './SecretKeyInput';

import WhisperingPorch from './level1/WhisperingPorch';
import HallOfMirrors from './level2/HallOfMirrors';
import CursedLibrary from './level3/CursedLibrary';
import EnigmaVault from './level4/EnigmaVault';
import FinalEscape from './level5/FinalEscape';

interface LevelPuzzleProps {
  level: number;
  onComplete: (key?: string) => void;
  showKeyInput: boolean;
  onPenalty?: (seconds: number) => void;
}

const puzzles = [
  {
    title: "The Whispering Porch",
    description: "You have breached the secure perimeter. A ransomware payload is hidden within the corporate inbox. You must identify, scan, and neutralize the threat to generate the access key.",
    hint: "Pay attention to file extensions. Not everything is what it seems.",
    action: "Begin Analysis",
    secretHint: "The scanner will reveal the truth.",
  },
  {
    title: "The Hall of Mirrors",
    description: "Airports are global hubs where cultures intersect. A fugitive signal was intercepted from an undisclosed terminal. Analyze the footage to pinpoint the exact location and time.",
    hint: "The city of beauty",
    action: "Begin Analysis",
    secretHint: "Designed by Le Corbusier. It serves as the capital of two states.",
    penalty: 60,
  },
  {
    title: "Targeted Penetration",
    description: "The target is Omega Corp. You must gain SSH access to their admin server (10.10.10.55). Standard wordlists have failed, so you must generate a custom dictionary from their website content.",
    hint: "Use 'help' command",
    action: "Launch Terminal",
    secretHint: "Run 'cewl' then 'hydra' to crack the password.",
  },
  {
    title: "Cold Kitchen",
    description: "A mysterious data string has been recovered. First, you must decipher it using the Vigenere Cipher, then use a Base64 decoder to reveal the final key. A sticky note with 'ALPHA' was attached to the server.",
    hint: "Use CyberChef. Recipe: Vigenere Decode (Key: ALPHA) -> From Base64.",
    action: "Decode & Decrypt",
    secretHint: "The output of Vigenere is a Base64 string. Decode that to get the flag.",
  },
  {
    title: "The Shadow Heart",
    description: "We have successfully tapped the adversary's communication line, but they are using 'Security through Obscurity'. They have buried their secret flag inside a massive stream of network traffic. Download the captured packet file and perform a forensic deep dive to locate the hidden flag string.",
    hint: "Warning: Requesting a hint will cost you 3 minutes. The flag is buried deep.",
    action: "Deep Packet Inspection",
    secretHint: "Today i am travelling from delhi(20) to chennai(21) for Cyber Catalyst 2026",
    penalty: 180,
  },
];

const LevelPuzzle = ({ level, onComplete, showKeyInput, onPenalty }: LevelPuzzleProps) => {
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const puzzle = puzzles[level - 1];

  const handleKeySubmit = async (key: string) => {
    setError(null);
    onComplete(key);
  };

  const handleAction = () => {
    // Legacy handleAction not strictly needed for Level 1 anymore as it's interactive
    if (level === 1) {
      // onComplete(); 
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-8 w-full max-w-7xl mx-auto">
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
                  THREAT ELIMINATED. SYSTEM KEY GENERATED.
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
                  LOCATION VERIFIED. SYSTEM KEY GENERATED.
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
                  SSH SESSION ESTABLISHED. FLAG CAPTURED.
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
            onClick={() => {
              if (puzzle.penalty && onPenalty) {
                if (confirm(`Warning: This hint costs ${puzzle.penalty / 60} minute(s) penalty. Proceed?`)) {
                  onPenalty(puzzle.penalty);
                  setShowHint(true);
                }
              } else {
                setShowHint(true);
              }
            }}
            variant="ghost"
            className="w-full text-muted-foreground hover:text-primary"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Need a hint? {puzzle.penalty ? `(-${puzzle.penalty / 60}m)` : ''}
          </Button>
        )}
      </div>
    </div>
  );
};

export default LevelPuzzle;
