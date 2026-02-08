import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Search, CheckCircle2, AlertTriangle, Video } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { toast } from 'sonner';

const HallOfMirrors = () => {
    const { gameState, completeSubTask } = useGameState();
    const [airportInput, setAirportInput] = useState('');
    const [timeInput, setTimeInput] = useState('');
    const [analyzing, setAnalyzing] = useState(false);

    // Single task completion check
    const collectedBytes = gameState.subTasksCompleted[2] || [];
    const hasKey = collectedBytes.includes('byte_1');

    const handleSubmit = async () => {
        setAnalyzing(true);
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const normalize = (str: string) => str.toLowerCase().trim().replace(/[^a-z0-9]/g, '');

        const validAirport = normalize(airportInput).includes('chandigarh');
        const validTime = timeInput.includes('9:14') || timeInput.includes('21:14') || (timeInput.includes('9') && timeInput.includes('14'));

        if (validAirport && validTime) {
            if (!hasKey) {
                toast.success("OSINT SUCCESS: Location & Time Verified", {
                    description: "Target Acquired. System Key Generated: 'SHADOW'",
                    duration: 5000
                });
                completeSubTask(2, 'byte_1');
            } else {
                toast.info("Analysis already verified as correct.");
            }
        } else {
            if (!validAirport) toast.error("Incorrect Location. Analyze the flight boards or architectural landmarks closer.");
            else if (!validTime) toast.error("Incorrect Time. Look for clocks or flight arrival/departure screens.");
        }
        setAnalyzing(false);
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-4 flex flex-col gap-8">
            {/* Progress HUD */}
            <div className="flex justify-center gap-4 mb-2 shrink-0">
                <div className={`px-4 py-2 rounded border transition-colors ${hasKey ? 'bg-green-900/50 border-green-500 text-green-200' : 'bg-black/40 border-slate-700 text-slate-500'}`}>
                    <span className="text-xs uppercase font-bold block">Status</span>
                    <div className="flex items-center gap-2">
                        {hasKey ? <CheckCircle2 className="w-4 h-4" /> : <Search className="w-4 h-4 animate-pulse" />}
                        <span>{hasKey ? "TARGET LOCATED" : "AWAITING INTELLIGENCE"}</span>
                    </div>
                </div>

                {hasKey && (
                    <div className="px-4 py-2 rounded border bg-yellow-500/20 border-yellow-500 text-yellow-200 animate-pulse">
                        <span className="text-xs uppercase font-bold block">Mission Complete</span>
                        <span>KEY: SHADOW</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* Visual Evidence Column */}
                <div className="space-y-4">
                    <div className="glass-panel p-1 bg-slate-900 relative rounded-xl overflow-hidden shadow-2xl border border-slate-700">
                        <div className="absolute top-4 left-4 z-10 bg-red-600 px-2 py-1 rounded text-xs font-bold text-white animate-pulse flex items-center gap-2">
                            <Video className="w-3 h-3" /> EYES ONLY
                        </div>
                        <video
                            src="/level2_osint.mp4"
                            controls
                            className="w-full rounded-lg aspect-auto bg-black"
                            poster="/placeholder-video-poster.jpg"
                        >
                            Your browser does not support the video tag.
                        </video>
                        <div className="p-4 bg-slate-900/90 text-sm text-slate-400 font-mono">
                            <p>EVIDENCE #882-ALPHA</p>
                            <p>SOURCE: INTERCEPTED UPLOAD</p>
                            <p>DURATION: 00:28</p>
                        </div>
                    </div>

                    <div className="glass-panel p-6 bg-slate-900/50 border-l-4 border-l-primary/50">
                        <h3 className="text-lg font-display font-bold text-white mb-2">Briefing</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Airports are global hubs where cultures, languages, and lives briefly intersect. Millions of people pass through them each day. On an undisclosed date and at an unknown location, one of these travellers recorded a TV screen for 28 seconds.
                        </p>
                        <p className="text-slate-300 text-sm leading-relaxed mt-4">
                            <strong>Objective:</strong> Locate the origin of this recording.
                        </p>
                    </div>
                </div>

                {/* Analysis Terminal Column */}
                <div className="glass-panel p-8 flex flex-col gap-6 relative overflow-hidden">
                    {/* Decorative BG */}
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <MapPin className="w-64 h-64 text-primary" />
                    </div>

                    <div>
                        <h2 className="text-2xl font-display font-bold text-white mb-1">Geospatial Analysis</h2>
                        <p className="text-slate-500 text-sm">Input your findings regarding the location and time.</p>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" /> Identified Airport
                            </label>
                            <input
                                type="text"
                                value={airportInput}
                                onChange={(e) => setAirportInput(e.target.value)}
                                placeholder="e.g. Heathrow Airport"
                                className="w-full bg-black/50 border border-slate-700 rounded-lg p-3 text-white placeholder:text-slate-600 focus:border-primary/50 focus:outline-none transition-colors font-mono"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" /> Exact Time Found
                            </label>
                            <input
                                type="text"
                                value={timeInput}
                                onChange={(e) => setTimeInput(e.target.value)}
                                placeholder="e.g. 14:30 or 2:30 PM"
                                className="w-full bg-black/50 border border-slate-700 rounded-lg p-3 text-white placeholder:text-slate-600 focus:border-primary/50 focus:outline-none transition-colors font-mono"
                            />
                        </div>

                        <div className="pt-4">
                            <Button
                                onClick={handleSubmit}
                                disabled={analyzing || hasKey}
                                className={`w-full h-12 text-lg font-bold tracking-widest transition-all ${hasKey ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary/80'}`}
                            >
                                {analyzing ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        VERIFYING...
                                    </span>
                                ) : hasKey ? (
                                    <span className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5" /> ANALYSIS CONFIRMED
                                    </span>
                                ) : (
                                    "SUBMIT ANALYSIS"
                                )}
                            </Button>
                        </div>

                        {hasKey && (
                            <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg animate-in fade-in slide-in-from-bottom-2">
                                <h4 className="text-green-400 font-bold mb-1 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> Intelligence Verified
                                </h4>
                                <p className="text-green-200/80 text-sm">
                                    The location has been successfully triangulated to <strong>Chandigarh International Airport</strong> at <strong>21:14</strong>. The Shadow cannot hide from the truth.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HallOfMirrors;
