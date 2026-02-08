import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, FileKey, AlertTriangle, EyeOff } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { toast } from 'sonner';

const EnigmaVault = () => {
    const { applyPenalty } = useGameState();
    const [hintRevealed, setHintRevealed] = useState(false);

    const handleRequestHint = () => {
        if (confirm("WARNING: Requesting this hint will deduct 2 minutes from your remaining time. Proceed?")) {
            applyPenalty(120);
            setHintRevealed(true);
            toast.warning("Time Penalty Applied: -2 Minutes");
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-4 flex flex-col gap-8">
            <div className="bg-slate-900/80 border border-primary/30 rounded-xl p-8 relative overflow-hidden backdrop-blur-sm shadow-[0_0_50px_rgba(139,92,246,0.1)]">
                {/* Decorative Grid */}
                <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center space-y-8">

                    <div className="space-y-2">
                        <Lock className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
                        <h3 className="text-2xl font-display font-bold text-white tracking-wider">
                            ENCRYPTED DATA FRAGMENT
                        </h3>
                        <p className="text-slate-400 max-w-md mx-auto">
                            We have recovered a strange data string from a rogue server's temporary memory.
                            Our tools are failing to decode it.
                        </p>
                    </div>

                    <div className="w-full max-w-lg bg-black/60 border-2 border-primary/20 rounded-lg p-6 font-mono text-center relative group">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-3 text-xs text-primary uppercase tracking-widest border border-primary/20 rounded">
                            The Artifact
                        </div>
                        <p className="text-2xl md:text-3xl text-white font-bold tracking-widest break-all">
                            VRvgX000c2euTGZqLqBynyH=
                        </p>
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-yellow-900/20 border border-yellow-500/30 px-6 py-4 rounded-lg flex items-center gap-3">
                            <FileKey className="w-5 h-5 text-yellow-500" />
                            <div className="text-left">
                                <p className="text-xs text-yellow-500 uppercase tracking-wider font-bold">Sticky Note Found</p>
                                <p className="text-xl font-mono text-white tracking-widest">"ALPHA"</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />

                    <div className="space-y-4">
                        {!hintRevealed ? (
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-red-500/50 text-red-400 hover:bg-red-950/30 hover:border-red-500 group"
                                onClick={handleRequestHint}
                            >
                                <EyeOff className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                Decrypt Hint (-2:00 Penalty)
                            </Button>
                        ) : (
                            <div className="animate-in fade-in zoom-in duration-500 bg-red-950/20 border border-red-500/40 rounded-lg p-6 max-w-md">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                    <span className="text-red-500 font-bold uppercase tracking-widest text-sm">Hint Decrypted</span>
                                </div>
                                <p className="text-lg text-white font-handwriting italic">
                                    "My mother use Vigenere while cooking!!!!"
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EnigmaVault;
