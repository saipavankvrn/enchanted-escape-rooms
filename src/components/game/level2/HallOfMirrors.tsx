import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Search, CheckCircle2, AlertTriangle, Fingerprint, Globe, Layers, User, Image, Lock, Clock, Map, Ghost, Eye, HelpCircle } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { toast } from 'sonner';

const HallOfMirrors = ({ onPenalty }: { onPenalty?: (time: number) => void }) => {
    const { gameState, completeSubTask, trackHintUsage } = useGameState();
    const [activeTab, setActiveTab] = useState(0);

    // Task States
    const [answers, setAnswers] = useState(() => {
        const saved = localStorage.getItem('level2_answers');
        return saved ? JSON.parse(saved) : {
            0: '', // Alibi
            1: '', // Reflection
            2: '', // Network
            3: '', // Biometric
            4: ''  // Geographic
        };
    });

    const [solvedStages, setSolvedStages] = useState<boolean[]>(() => {
        const saved = localStorage.getItem('level2_solved');
        return saved ? JSON.parse(saved) : [false, false, false, false, false];
    });

    const [revealedHints, setRevealedHints] = useState<boolean[]>(() => {
        const saved = localStorage.getItem('level2_hints');
        return saved ? JSON.parse(saved) : [false, false, false, false, false];
    });

    useEffect(() => {
        localStorage.setItem('level2_answers', JSON.stringify(answers));
    }, [answers]);

    useEffect(() => {
        localStorage.setItem('level2_solved', JSON.stringify(solvedStages));
    }, [solvedStages]);

    useEffect(() => {
        localStorage.setItem('level2_hints', JSON.stringify(revealedHints));
    }, [revealedHints]);

    // Answers
    const SOLUTIONS = {
        0: ['60', '60 minutes', '60m', '1 hour', '60 min'],
        1: ['6', '6 hours', '6h', '6hr'],
        2: ['windows', 'windows os', 'win'],
        3: ['mirror b', 'b', 'mirror-b'],
        4: ['120', '120km/h', '120 km/h', '120kmph', '120 kph']
    };

    const handleInputChange = (index: number, val: string) => {
        setAnswers(prev => ({ ...prev, [index]: val }));
    };

    const toggleHint = (index: number) => {
        if (revealedHints[index]) return;

        if (window.confirm("Sherlock's Insight costs a 20-second penalty. Do you wish to proceed?")) {
            onPenalty?.(20);
            trackHintUsage();
            const newHints = [...revealedHints];
            newHints[index] = true;
            setRevealedHints(newHints);
        }
    };

    const checkAnswer = (index: number) => {
        const input = answers[index as keyof typeof answers].toLowerCase().trim();
        const valid = SOLUTIONS[index as keyof typeof SOLUTIONS].includes(input);

        if (valid) {
            toast.success("DEDUCTION CORRECT", { description: "Clue verified. Proceeding to next fragment." });
            const newSolved = [...solvedStages];
            newSolved[index] = true;
            setSolvedStages(newSolved);

            // Check if all solved
            if (newSolved.every(s => s)) {
                setTimeout(() => {
                    toast.success("CASE CLOSED: IDENTITY SPOOFED", {
                        description: "Shadow Agent Identified. Key: SPOOFED_2026",
                        duration: 5000
                    });
                    completeSubTask(2, 'byte_1');
                }, 1000);
            }
        } else {
            toast.error("INCORRECT DEDUCTION", { description: "Re-examine the clues. The facts don't add up." });
        }
    };

    const tasks = [
        {
            title: "The Alibi Intersection",
            icon: <Clock className="w-5 h-5" />,
            desc: "Travel Log: Lab (1 PM - 3 PM). Mirror Post: Beach (2 PM).",
            question: "What is the duration (in minutes) of the impossible overlap?",
            hint: "The timeline is fractured. Focus on the overlap. How much of that hour shouldn't exist?",
            placeholder: "e.g., 45 minutes"
        },
        {
            title: "The Reflection Paradox",
            icon: <Image className="w-5 h-5" />,
            desc: "Mirror: 10:00 AM on wall clock. Suspect's Phone: 16:00 (4 PM) on screen.",
            question: "Calculate the Time Difference (in hours) to prove the photo is staged:",
            hint: "The wall clock is analog, the phone is digital. What is the gap between morning and afternoon?",
            placeholder: "e.g., 2 hours"
        },
        {
            title: "The Network Ghost",
            icon: <Ghost className="w-5 h-5" />,
            desc: "Login Event: User logged in via 'Windows OS'. Registry: Student only owns a 'Macbook'.",
            question: "Which Operating System reveals the intruder?",
            hint: "Registry says Apple. Login says...?",
            placeholder: "e.g., Linux"
        },
        {
            title: "The 'Forgot Password' Trap",
            icon: <Lock className="w-5 h-5" />,
            desc: "Evidence: Scrapbook shows 'Green Valley Academy' uniform. Investigation: Mirror A accepted 'Green Valley Academy'. Mirror B rejected 'Green Valley Academy'. Mirror C asked for 'Pet Name'.",
            question: "Which Mirror (A, B, or C) is the Phishing Trap?",
            hint: "The real reflection knows the truth. The Shadow Clone rejects the correct password.",
            placeholder: "e.g., Mirror B"
        },
        {
            title: "The Geographic Impossible",
            icon: <Map className="w-5 h-5" />,
            desc: "Mirror A: Cafe. Mirror B: Library (10km away). Time gap: 5 minutes.",
            question: "Calculate the required Speed (km/h) to make this trip:",
            hint: "Velocity = Distance / Time. But remember to convert minutes to hours first.",
            placeholder: "e.g., 60 km/h"
        }
    ];

    const collectedBytes = gameState.subTasksCompleted[2] || [];
    const hasKey = collectedBytes.includes('byte_1');

    return (
        <div className="w-full h-full max-w-6xl mx-auto p-4 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-6 h-full">
                {/* Left: Navigation */}
                <div className="md:w-1/3 flex flex-col gap-2">
                    <div className="glass-panel p-4 bg-slate-900/50">
                        <h2 className="text-xl font-display font-bold text-white mb-4">Case Files</h2>
                        <div className="space-y-2">
                            {tasks.map((task, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveTab(idx)}
                                    className={`w-full p-3 rounded-lg flex items-center gap-3 text-sm transition-all border ${activeTab === idx
                                        ? 'bg-primary/20 border-primary text-primary'
                                        : 'bg-black/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                                        }`}
                                >
                                    <div className={`p-1.5 rounded ${solvedStages[idx] ? 'bg-green-500/20 text-green-400' : 'bg-slate-800'}`}>
                                        {solvedStages[idx] ? <CheckCircle2 className="w-4 h-4" /> : task.icon}
                                    </div>
                                    <span className="font-bold truncate">{task.title}</span>
                                    {solvedStages[idx] && <span className="ml-auto text-xs text-green-500 font-mono">SOLVED</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {hasKey && (
                        <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg flex items-center justify-between animate-pulse">
                            <div>
                                <h3 className="text-green-400 font-bold">Cold Case Closed</h3>
                                <p className="text-xs text-green-300">Identity Spoof Confirmed.</p>
                            </div>
                            <div className="font-mono text-xl font-bold text-white">KEY: SPOOFED_2026</div>
                        </div>
                    )}
                </div>

                {/* Right: Active Task */}
                <div className="md:w-2/3">
                    <div className="glass-panel p-6 bg-slate-900 h-full flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

                        <div className="relative z-10 flex flex-col h-full gap-6">
                            <div className="border-b border-slate-700 pb-4">
                                <h3 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                                    {tasks[activeTab].icon}
                                    {tasks[activeTab].title}
                                </h3>
                                <div className="mt-4 p-4 bg-black/40 border border-slate-800 rounded-lg">
                                    <p className="text-slate-300 text-sm leading-relaxed font-mono">
                                        CLUE: {tasks[activeTab].desc}
                                    </p>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col gap-4 justify-center">
                                <div className="space-y-4">
                                    <label className="text-base font-bold text-white block">
                                        {tasks[activeTab].question}
                                    </label>

                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={answers[activeTab as keyof typeof answers]}
                                            onChange={(e) => handleInputChange(activeTab, e.target.value)}
                                            placeholder={tasks[activeTab].placeholder}
                                            disabled={solvedStages[activeTab]}
                                            className="flex-1 bg-black/60 border border-slate-600 rounded p-4 text-white focus:border-primary focus:outline-none placeholder:text-slate-600 font-mono text-lg"
                                        />
                                        <Button
                                            onClick={() => checkAnswer(activeTab)}
                                            disabled={solvedStages[activeTab]}
                                            className={`h-auto px-6 ${solvedStages[activeTab] ? "bg-green-600 hover:bg-green-600" : ""}`}
                                        >
                                            {solvedStages[activeTab] ? <CheckCircle2 className="w-6 h-6" /> : "Verify Deduction"}
                                        </Button>
                                    </div>

                                    {/* Sherlock Hint System */}
                                    <div className="pt-2">
                                        {!revealedHints[activeTab] ? (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleHint(activeTab)}
                                                className="text-yellow-500/80 hover:text-yellow-400 hover:bg-yellow-500/10 flex items-center gap-2"
                                            >
                                                <HelpCircle className="w-4 h-4" />
                                                Need Sherlock's Insight?
                                            </Button>
                                        ) : (
                                            <div className="p-3 bg-yellow-900/10 border border-yellow-500/20 rounded text-xs text-yellow-400 font-mono flex items-start gap-2">
                                                <HelpCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                                <span>INSIGHT: {tasks[activeTab].hint}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="text-xs text-slate-600 font-mono mt-auto pt-4 border-t border-slate-800 flex justify-between">
                                <span>CASE FILE: #2026-{activeTab + 1}0{activeTab + 4}</span>
                                <span>STATUS: {solvedStages[activeTab] ? "SOLVED" : "OPEN"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HallOfMirrors;
