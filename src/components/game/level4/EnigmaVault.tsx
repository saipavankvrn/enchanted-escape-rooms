import { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { toast } from 'sonner';
import { Lock, Unlock, Terminal, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EnigmaVault = () => {
    const { completeSubTask, gameState, applyPenalty } = useGameState();
    const collectedBytes = gameState.subTasksCompleted[4] || [];

    // Task 1 State
    const [answer1, setAnswer1] = useState(() => localStorage.getItem('level4_answer1') || '');
    const [solved1, setSolved1] = useState(collectedBytes.includes('byte_1'));

    // Task 2 State
    const [answer2, setAnswer2] = useState(() => localStorage.getItem('level4_answer2') || '');
    const [solved2, setSolved2] = useState(collectedBytes.includes('byte_2'));

    // Hint States
    const [hints1Revealed, setHints1Revealed] = useState(() => localStorage.getItem('level4_hint1') === 'true');
    const [hints2Revealed, setHints2Revealed] = useState(() => localStorage.getItem('level4_hint2') === 'true');

    useEffect(() => {
        localStorage.setItem('level4_answer1', answer1);
    }, [answer1]);

    useEffect(() => {
        localStorage.setItem('level4_answer2', answer2);
    }, [answer2]);

    useEffect(() => {
        localStorage.setItem('level4_hint1', hints1Revealed.toString());
    }, [hints1Revealed]);

    useEffect(() => {
        localStorage.setItem('level4_hint2', hints2Revealed.toString());
    }, [hints2Revealed]);

    useEffect(() => {
        if (collectedBytes.includes('byte_1')) setSolved1(true);
        if (collectedBytes.includes('byte_2')) setSolved2(true);
    }, [collectedBytes]);

    const revealHint1 = () => {
        if (confirm("Revealing this hint will cost you 2 minutes. Proceed?")) {
            applyPenalty(120);
            setHints1Revealed(true);
        }
    };

    const revealHint2 = () => {
        if (confirm("Revealing this hint will cost you 2 minutes. Proceed?")) {
            applyPenalty(120);
            setHints2Revealed(true);
        }
    };

    const CHALLENGE_1_HASH = "Beat_me_if_Possible!!!!";
    const CHALLENGE_2_HASH = "Veltech.Welcomes_You-All";

    const handleSubmit1 = () => {
        if (answer1.trim() === CHALLENGE_1_HASH) {
            setSolved1(true);
            completeSubTask(4, 'byte_1');
            toast.success("Correct! The rogue intern's cipher is broken.");
        } else {
            toast.error("Incorrect. Try again.");
        }
    };

    const handleSubmit2 = () => {
        if (answer2.trim() === CHALLENGE_2_HASH) {
            setSolved2(true);
            completeSubTask(4, 'byte_2');
            toast.success("Correct! The developer's layers are peeled.");
        } else {
            toast.error("Incorrect. Remember the order.");
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-4 flex flex-col md:flex-row gap-6">

            {/* Challenge 1: The Rogue Intern */}
            <div className={`flex-1 border-2 rounded-xl p-6 relative overflow-hidden transition-all duration-500 ${solved1 ? 'border-green-500/50 bg-green-950/10' : 'border-red-500/30 bg-black'}`}>
                <div className="absolute top-0 right-0 p-2 opacity-20">
                    <ShieldAlert className={`w-24 h-24 ${solved1 ? 'text-green-500' : 'text-red-500'}`} />
                </div>

                <h3 className={`text-xl font-bold font-mono mb-2 ${solved1 ? 'text-green-400' : 'text-red-400'}`}>
                    0x01: The Rogue Intern
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                    "I've created an 'unbreakable' encoding. Even beginners won't crack it. It mixes binary-safe formats with letter substitution."
                </p>

                <div className="bg-slate-900 border border-slate-700 p-4 rounded mb-6 font-mono text-center break-all text-yellow-500">
                    DzIuqS9gMI9cMy9Do3AmnJWfMFRuVFR=
                </div>

                {!solved1 ? (
                    <div className="space-y-4">
                        <div className="bg-slate-800/50 p-3 rounded text-xs text-slate-400 space-y-2">
                            {!hints1Revealed ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full border-dashed border-slate-600 text-slate-400 hover:text-white"
                                    onClick={revealHint1}
                                >
                                    Reveal Hint (-2:00 Penalty)
                                </Button>
                            ) : (
                                <div className="animate-in fade-in duration-500">
                                    <p className="italic text-yellow-500">"My mother used to make roti using base on a roti board"</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 relative z-10">
                            <input
                                type="text"
                                value={answer1}
                                onChange={(e) => setAnswer1(e.target.value)}
                                placeholder="Enter decrypted string..."
                                className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white focus:outline-none focus:border-red-500 font-mono"
                            />
                            <Button
                                onClick={handleSubmit1}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-mono"
                            >
                                <Lock className="w-4 h-4 mr-2" /> Decrypt Layer 1
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center text-green-400 font-mono font-bold animate-pulse">
                        <Unlock className="w-5 h-5 mr-2" /> DECRYPTED
                    </div>
                )}
            </div>

            {/* Challenge 2: The Lazy Developer */}
            <div className={`flex-1 border-2 rounded-xl p-6 relative overflow-hidden transition-all duration-500 ${!solved1 ? 'opacity-50 grayscale pointer-events-none border-slate-800 bg-black' : solved2 ? 'border-green-500/50 bg-green-950/10' : 'border-blue-500/30 bg-black'}`}>
                <div className="absolute top-0 right-0 p-2 opacity-20">
                    <Terminal className={`w-24 h-24 ${solved2 ? 'text-green-500' : 'text-blue-500'}`} />
                </div>

                {!solved1 && (
                    <div className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center text-center p-6">
                        <Lock className="w-12 h-12 text-slate-500 mb-4" />
                        <h3 className="text-xl font-bold font-mono text-slate-400 mb-2">LOCKED</h3>
                        <p className="text-slate-600 text-sm">Decrypt "The Rogue Intern" to access this layer.</p>
                    </div>
                )}

                <h3 className={`text-xl font-bold font-mono mb-2 ${solved2 ? 'text-green-400' : 'text-blue-400'}`}>
                    0x02: The Stacked Cipher
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                    "Encoding isn't encryption... but three times should be enough."
                </p>

                <div className="bg-slate-900 border border-slate-700 p-4 rounded mb-6 font-mono text-center break-all text-cyan-500">
                    {solved1 ? "bGxBLXVvWV9zZW1vY2xlVy5oY2V0bGVW" : "••••••••••••••••••••••••••••••••••••••••"}
                </div>

                {solved1 && !solved2 ? (
                    <div className="space-y-4">
                        <div className="bg-slate-800/50 p-3 rounded text-xs text-slate-400 space-y-2">
                            {!hints2Revealed ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full border-dashed border-slate-600 text-slate-400 hover:text-white"
                                    onClick={revealHint2}
                                >
                                    Reveal Hint (-2:00 Penalty)
                                </Button>
                            ) : (
                                <div className="animate-in fade-in duration-500">
                                    <p className="italic text-cyan-500">"The base needs to be reversed"</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 relative z-10">
                            <input
                                type="text"
                                value={answer2}
                                onChange={(e) => setAnswer2(e.target.value)}
                                placeholder="Enter decoded string..."
                                className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white focus:outline-none focus:border-blue-500 font-mono"
                            />
                            <Button
                                onClick={handleSubmit2}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-mono"
                            >
                                <Lock className="w-4 h-4 mr-2" /> Decrypt Layer 2
                            </Button>
                        </div>
                    </div>
                ) : solved2 ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="flex items-center text-green-400 font-mono font-bold">
                            <Unlock className="w-5 h-5 mr-2" /> DECRYPTED
                        </div>
                        <div className="p-3 bg-green-950/30 border border-green-500/50 rounded text-center">
                            <span className="text-xs uppercase text-green-500 block mb-1">System Key Generated</span>
                            <span className="font-mono text-xl font-bold text-white tracking-widest">TH3_M4SK_0F_Z0RR0</span>
                        </div>
                    </div>
                ) : null}
            </div>

        </div>
    );
};

export default EnigmaVault;
