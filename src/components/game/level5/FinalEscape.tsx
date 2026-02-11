import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Download, AlertTriangle, Network, FileDown } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const FinalEscape = () => {
    const { user } = useAuth();
    const { applyPenalty } = useGameState();
    const [hintRevealed, setHintRevealed] = useState(false);

    useEffect(() => {
        if (user) {
            setHintRevealed(localStorage.getItem(`user_${user.id}_level5_hint_revealed`) === 'true');
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            localStorage.setItem(`user_${user.id}_level5_hint_revealed`, hintRevealed.toString());
        }
    }, [hintRevealed, user]);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = '/assets/level5/traffic_dump.pcap';
        link.download = 'traffic_dump.pcap';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Download Initiated: traffic_dump.pcap");
    };

    const handleRequestHint = () => {
        if (confirm("WARNING: Requesting high-level intelligence will cost 3 MINUTES of operation time. Proceed?")) {
            applyPenalty(180); // 3 minutes
            setHintRevealed(true);
            toast.warning("Time Penalty Applied: -3 Minutes");
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-8 animate-in fade-in duration-700">
            {/* Mission Header */}
            <div className="text-center space-y-4">
                <div className="inline-block p-3 rounded-full bg-blue-900/30 border border-blue-500/50 mb-2">
                    <Network className="w-8 h-8 text-blue-400 animate-pulse" />
                </div>
                <h2 className="text-3xl font-display font-bold text-white tracking-widest uppercase text-shadow-blue">
                    Operation: Needle in the Haystack
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    Adversary communication intercepted. Analysis required.
                </p>
            </div>

            {/* Main Interface */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Evidence Card */}
                <div className="bg-slate-900/80 border border-blue-500/30 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-6 shadow-[0_0_30px_rgba(59,130,246,0.1)] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors duration-500" />

                    <div className="relative z-10 w-full">
                        <h3 className="text-xl font-bold text-blue-400 mb-2 uppercase tracking-wider">
                            Evidence Locker
                        </h3>
                        <p className="text-sm text-slate-500 mb-6">
                            Contains raw packet capture (PCAP) from the suspect node.
                        </p>

                        <div className="bg-black/50 border border-slate-700 rounded-lg p-4 mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileDown className="w-8 h-8 text-slate-400" />
                                <div className="text-left">
                                    <div className="text-white font-mono font-bold">traffic_dump.pcap</div>
                                    <div className="text-xs text-slate-500">104 KB • TCP/UDP Data</div>
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 text-lg shadow-lg shadow-blue-900/50"
                            onClick={handleDownload}
                        >
                            <Download className="w-6 h-6 mr-2" />
                            DOWNLOAD PACKET DUMP
                        </Button>
                    </div>
                </div>

                {/* Intelligence Card */}
                <div className="bg-slate-900/80 border border-yellow-500/30 rounded-xl p-6 flex flex-col items-center text-center space-y-6 shadow-[0_0_30px_rgba(234,179,8,0.1)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-yellow-500/5" />

                    <div className="relative z-10 w-full h-full flex flex-col">
                        <h3 className="text-xl font-bold text-yellow-500 mb-2 uppercase tracking-wider flex items-center justify-center gap-2">
                            <ShieldCheck className="w-5 h-5" /> Intelligence Support
                        </h3>
                        <p className="text-sm text-slate-500 mb-6">
                            HQ can provide a geolocated trace hint, but it will consume mission time.
                        </p>

                        <div className="flex-1 flex flex-col items-center justify-center">
                            {!hintRevealed ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-red-950/30 border border-red-500/50 rounded text-red-400 text-xs font-mono">
                                        PENALTY WARNING: -3:00 MINUTES
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="border-yellow-600 text-yellow-500 hover:bg-yellow-900/50 hover:border-yellow-400 hover:text-yellow-300 w-full"
                                        onClick={handleRequestHint}
                                    >
                                        <AlertTriangle className="w-4 h-4 mr-2" />
                                        REQUEST TARGET INTEL
                                    </Button>
                                </div>
                            ) : (
                                <div className="w-full bg-black/60 border border-yellow-500/50 rounded-lg p-6 animate-in zoom-in duration-300">
                                    <div className="text-xs text-yellow-600 uppercase mb-2 font-bold tracking-widest">
                                        Decrypted Transmission
                                    </div>
                                    <p className="text-lg text-white font-handwriting italic leading-relaxed">
                                        "Today i am travelling from Chennai(20) to Delhi(21) for Cyber Catalyst 2026"
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            <div className="text-center text-xs text-slate-600 font-mono mt-8">
                SECURE CHANNEL ESTABLISHED // MONITORING ACTIVE
            </div>
        </div>
    );
};

export default FinalEscape;
