import { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
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
    description: "A wave of emails has flooded the corporate inbox. You must classify 7 suspicious emails into 'Legitimate' or 'Phishing' folders. Correctly identifying all threats will generate the access key.",
    hint: "Check the sender's domain (e.g., 'micros0ft' instead of 'microsoft'), urgent language, and suspicious links.",
    action: "Begin Analysis",
    secretHint: "To unmask the impostors, look for the 'Three Traps': a number hiding as a letter, a personal address for professional business, and a file that wants to 'run' instead of 'read'.",
    penalty: 60,
  },
  {
    title: "The Hall of Mirrors",
    description: "This is a Cold Case investigation. The answers are not hidden in the source code—they are hidden in logic. Analyze 5 mirrors, connect the contradictions, and deduce the truth. You are not a hacker here; you are a detective.",
    hint: "Use the 'Sherlock Hint' system if you get stuck. It costs time but provides a leading thought.",
    action: "Enter the Hall of Mirrors",
    secretHint: "1. 60m overlap. 2. 6h time difference. 3. Windows OS. 4. Mirror B is the trap. 5. 120km/h.",
    penalty: 60,
  },
  {
    title: "The Cold Kitchen",
    description: "Two encrypted messages block your path. A rogue intern and an overconfident developer have left behind puzzles they claim are 'unbreakable'. Decode them both to proceed.",
    hint: "For the first, try substituting letters. For the second, reverse the layers of encoding.",
    action: "Access Decryption Module",
    secretHint: "P1: ROT13 -> Base64. P2: URL Decode -> Base64 -> Reverse.",
    penalty: 120,
  },
  {
    title: "The Cursed Library",
    description: "Mission: You have found the hidden server for 'Omega Corp.' However, the login is locked. You need to scrape the company’s own website to build a custom password list and then use a brute-force tool to find the admin's password.",
    hint: "Harvest their vocabulary from their story, append the current year to every word, and then overwhelm the login gate.",
    action: "Launch Terminal",
    secretHint: "Gather 'seeds' from the About page, modify the stream with 2026, and use a multi-headed attack to crack the admin code.",
    penalty: 120,
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
  const { trackHintUsage } = useGameState();
  const [showHint, setShowHint] = useState(() => {
    return localStorage.getItem(`level_${level}_hint_revealed`) === 'true';
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(`level_${level}_hint_revealed`, showHint.toString());
  }, [showHint, level]);

  useEffect(() => {
    setShowHint(localStorage.getItem(`level_${level}_hint_revealed`) === 'true');
  }, [level]);
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
            <HallOfMirrors onPenalty={onPenalty} />
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
        ) : level === 4 ? (
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

        {!showHint && puzzle.hint && level !== 2 && level !== 5 && (
          <Button
            onClick={() => {
              if (puzzle.penalty && onPenalty) {
                if (confirm(`Warning: This hint costs ${puzzle.penalty / 60} minute(s) penalty. Proceed?`)) {
                  onPenalty(puzzle.penalty);
                  setShowHint(true);
                  trackHintUsage();
                }
              } else {
                setShowHint(true);
                trackHintUsage();
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
