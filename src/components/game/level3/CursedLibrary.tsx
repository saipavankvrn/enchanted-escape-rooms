import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Book, Zap, StickyNote, Lock, AlertTriangle } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { toast } from 'sonner';

const CursedLibrary = () => {
    const { gameState, completeSubTask } = useGameState();

    // Track gathered fragments
    const collectedBytes = gameState.subTasksCompleted[3] || [];
    const hasByte1 = collectedBytes.includes('byte_1'); // Valid Notes Selected
    const hasByte2 = collectedBytes.includes('byte_2'); // Voltage Meter Sequence

    // --- Task 1: Sticky Notes (Complexity) ---
    const NOTES = [
        { id: 1, text: "admin123", valid: false }, // No symbol, no caps specific mix? Usually weak.
        { id: 2, text: "S7r0ng!", valid: true },   // Caps, Num, Sym
        { id: 3, text: "pass", valid: false },     // Too short
        { id: 4, text: "#C0d3r", valid: true },    // Caps, Num, Sym
        { id: 5, text: "Guest", valid: false },    // Weak
        { id: 6, text: "L0ck&Key", valid: true }   // Caps, Num, Sym
    ];
    // Need 3 valid ones. Let's use 6 notes to be safe, find 3 valid.

    const [selectedNotes, setSelectedNotes] = useState<number[]>([]);

    const handleNoteClick = (id: number) => {
        if (hasByte1) return;

        if (selectedNotes.includes(id)) {
            setSelectedNotes(prev => prev.filter(n => n !== id));
        } else {
            if (selectedNotes.length >= 3) {
                toast.warning("You can only combine 3 passwords.");
                return;
            }
            setSelectedNotes(prev => [...prev, id]);
        }
    };

    const handleCombineNotes = () => {
        // Check if the 3 selected are the 3 valid ones
        const selected = NOTES.filter(n => selectedNotes.includes(n.id));
        const allValid = selected.every(n => n.valid);
        const count = selected.length;

        if (count === 3 && allValid) {
            if (!hasByte1) {
                toast.success("COMPLEXITY MATCHED: Valid Passwords Identified", { description: "Fragment 1/2 Recovered: 'CIP'" });
                completeSubTask(3, 'byte_1');
            }
        } else {
            toast.error("Combination Failed. Ensure you selected exactly 3 STRONG passwords (Capital, Number, Symbol).");
            setSelectedNotes([]);
        }
    };

    // --- Task 2: Voltage Meter (Sequence) ---
    // User must click the 3 valid passwords in order of Strength (Length?) to power the meter.
    // Let's simplify: Just drag/drop or click in order?
    // Let's do: "Input the combined string".
    // Since we just "found" them, maybe now we have to "charge" them.
    // UI: A "Voltage Meter" slot.
    // Logic: Click "Charge" button. A pattern flashes? Or just simulated brute force?
    // User Request: "Input the combined string... If order is wrong... drains time."
    // Let's make it: Click the 3 valid notes in Ascending Order of Length? 
    // Notes: "S7r0ng!" (7), "#C0d3r" (6), "L0ck&Key" (8).
    // Order: #C0d3r -> S7r0ng! -> L0ck&Key.

    const [sequence, setSequence] = useState<number[]>([]);

    const validNotes = NOTES.filter(n => n.valid); // 2, 4, 6
    // Lengths: 4(#C0d3r)=6, 2(S7r0ng!)=7, 6(L0ck&Key)=8.
    const sortedIds = [4, 2, 6];

    const handleVoltageInput = (id: number) => {
        if (!hasByte1) {
            toast.error("Identify the valid passwords first!");
            return;
        }
        if (hasByte2) return;

        const newSeq = [...sequence, id];
        setSequence(newSeq);

        // Check validation immediately or wait for 3?
        if (newSeq.length === 3) {
            // Check order
            if (JSON.stringify(newSeq) === JSON.stringify(sortedIds)) {
                toast.success("VOLTAGE STABILIZED: Brute Force Successful", { description: "Fragment 2/2 Recovered: 'HER'" });
                completeSubTask(3, 'byte_2');
            } else {
                toast.error("VOLTAGE SURGE: Incorrect Sequence! (Hint: Shortest to Longest)", { duration: 3000 });
                // Penalty could be applied here (deduct time), but for now just reset
                setSequence([]);
            }
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-8">
            {/* Status Header */}
            <div className="flex justify-center gap-4">
                <div className={`px-6 py-3 rounded border flex flex-col items-center ${hasByte1 ? 'bg-yellow-900/50 border-yellow-500 text-yellow-200' : 'bg-black/40 border-slate-700 text-slate-500'}`}>
                    <span className="text-xs uppercase tracking-widest mb-1">Book Fragment</span>
                    <span className="font-bold text-lg">{hasByte1 ? "CIP" : "???"}</span>
                </div>
                <div className={`px-6 py-3 rounded border flex flex-col items-center ${hasByte2 ? 'bg-yellow-900/50 border-yellow-500 text-yellow-200' : 'bg-black/40 border-slate-700 text-slate-500'}`}>
                    <span className="text-xs uppercase tracking-widest mb-1">Meter Fragment</span>
                    <span className="font-bold text-lg">{hasByte2 ? "HER" : "???"}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* LEFT: The Sticky Notes */}
                <div className="bg-slate-900/80 p-6 rounded-xl border border-primary/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    <h3 className="text-xl font-display font-bold text-primary mb-4 flex items-center gap-2">
                        <StickyNote className="w-5 h-5" /> Password Dump
                    </h3>
                    <p className="text-sm text-slate-400 mb-6">
                        Select exactly 3 passwords that meet the complexity standard: <br />
                        <span className="text-white font-mono">1. Uppercase &nbsp; 2. Number &nbsp; 3. Symbol</span>
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        {NOTES.map(note => (
                            <button
                                key={note.id}
                                onClick={() => handleNoteClick(note.id)}
                                disabled={hasByte1}
                                className={`relative p-4 rounded transform transition-all duration-300 font-mono text-lg shadow-lg
                                    ${hasByte1 && note.valid
                                        ? 'bg-success/20 border-2 border-success text-success rotate-0 scale-100'
                                        : hasByte1
                                            ? 'opacity-20 grayscale scale-90'
                                            : selectedNotes.includes(note.id)
                                                ? 'bg-yellow-100 text-black border-2 border-yellow-500 -rotate-2 scale-105'
                                                : 'bg-yellow-50 text-slate-800 border border-yellow-200 hover:rotate-1 hover:scale-105'
                                    }
                                `}
                            >
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-yellow-200/50 rotate-1"></div>
                                {note.text}
                            </button>
                        ))}
                    </div>

                    {!hasByte1 && (
                        <Button
                            className="w-full mt-6"
                            size="lg"
                            variant="neon"
                            onClick={handleCombineNotes}
                            disabled={selectedNotes.length !== 3}
                        >
                            Verify Selection
                        </Button>
                    )}
                </div>

                {/* RIGHT: Voltage Meter */}
                <div className="bg-slate-900/80 p-6 rounded-xl border border-primary/20 flex flex-col">
                    <h3 className="text-xl font-display font-bold text-primary mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5" /> Voltage Meter
                    </h3>
                    <p className="text-sm text-slate-400 mb-6">
                        {hasByte1
                            ? "Power the meter by engaging the 3 valid passwords in ASCENDING order of length (Shortest -> Longest)."
                            : "System Locked. Analyze passwords first."}
                    </p>

                    {/* Meter Display */}
                    <div className="flex-1 bg-black/60 rounded-lg p-8 flex flex-col items-center justify-center border-2 border-slate-800 mb-4 relative">
                        {hasByte2 ? (
                            <div className="text-center animate-pulse">
                                <div className="text-success text-4xl font-black mb-2">100%</div>
                                <div className="text-success/80 font-mono text-sm">OUTPUT STABLE</div>
                            </div>
                        ) : (
                            <div className="w-full">
                                <div className="flex justify-between text-xs text-slate-500 mb-1 font-mono">
                                    <span>0V</span>
                                    <span>500V</span>
                                    <span>1000V</span>
                                </div>
                                <div className="w-full h-8 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                    <div
                                        className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-500 ease-out"
                                        style={{ width: `${(sequence.length / 3) * 100}%` }}
                                    />
                                </div>
                                <div className="text-center mt-4 font-mono text-primary">
                                    INPUT SEQUENCE: {sequence.length} / 3
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Controls (Only valid notes appear here after Phase 1) */}
                    <div className="flex gap-2 justify-center">
                        {NOTES.filter(n => n.valid).map(note => (
                            <Button
                                key={note.id}
                                disabled={!hasByte1 || hasByte2 || sequence.includes(note.id)}
                                variant="outline"
                                className={`font-mono ${sequence.includes(note.id) ? 'opacity-50' : ''}`}
                                onClick={() => handleVoltageInput(note.id)}
                            >
                                {note.text}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CursedLibrary;
