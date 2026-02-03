import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Unlock, Key, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface PasswordRoomProps {
    onKeyFound: (key: string) => void;
}

const PasswordRoom = ({ onKeyFound }: PasswordRoomProps) => {
    const [unlocked, setUnlocked] = useState(false);
    const [showKey, setShowKey] = useState(false);

    const passwords = [
        { id: 1, text: "password123", strength: "weak" },
        { id: 2, text: "admin", strength: "weak" },
        { id: 3, text: "S7r0ngP@ss!#99", strength: "strong" },
        { id: 4, text: "12345678", strength: "weak" },
        { id: 5, text: "qwerty", strength: "weak" },
    ];

    const handlePasswordClick = (strength: string) => {
        if (strength === "strong") {
            setUnlocked(true);
            setShowKey(true);
            toast.success("Correct! That's a strong password.");
        } else {
            toast.error("Access Denied: Weak Password Detected", {
                description: "Try selecting a stronger password."
            });
        }
    };

    const handleDoorClick = () => {
        if (unlocked) {
            onKeyFound("LEVEL-1-COMPLETE");
        } else {
            toast.error("The door is locked!", {
                description: "Find the correct password to unlock it."
            });
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div className="relative aspect-video bg-slate-900 border-4 border-slate-700 rounded-lg overflow-hidden shadow-2xl">
                {/* Room Background Effect */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-80" />

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

                {/* Content Container */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-primary font-display mb-2">SECURITY CHECKPOINT</h2>
                        <p className="text-primary/70">Select the strongest password to unlock the system.</p>
                    </div>

                    {/* Passwords Grid */}
                    {!showKey ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                            {passwords.map((pwd) => (
                                <button
                                    key={pwd.id}
                                    onClick={() => handlePasswordClick(pwd.strength)}
                                    className="group relative p-4 bg-black/40 border border-primary/30 rounded hover:bg-primary/10 hover:border-primary transition-all duration-300"
                                >
                                    <div className="flex items-center gap-2 text-primary/80 group-hover:text-primary font-mono text-lg">
                                        <Shield className="w-4 h-4" />
                                        {pwd.text}
                                    </div>
                                    {/* Glitch Effect on Hover */}
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 animate-pulse rounded" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 mb-8 animate-in zoom-in duration-500">
                            <div className="p-6 bg-success/20 border-2 border-success rounded-xl flex items-center gap-4">
                                <CheckCircle2 className="w-8 h-8 text-success" />
                                <div>
                                    <h3 className="text-xl font-bold text-success mb-1">ACCESS GRANTED</h3>
                                    <p className="text-success/80">System Unlocked</p>
                                </div>
                            </div>
                            <div className="p-4 bg-black/60 rounded border border-primary/50 text-center">
                                <p className="text-sm text-primary/60 mb-2">SECRET KEY GENERATED</p>
                                <code className="text-2xl font-mono text-primary font-bold tracking-wider">LEVEL-1-COMPLETE</code>
                            </div>
                        </div>
                    )}

                    {/* Door / Exit */}
                    <div className="mt-auto">
                        <Button
                            size="lg"
                            variant="neon"
                            className={`w-48 h-16 text-lg font-bold gap-2 transition-all duration-500 ${unlocked
                                ? "animate-pulse shadow-[0_0_20px_rgba(34,197,94,0.5)] bg-success/20 text-success border-success hover:bg-success/30"
                                : "opacity-50 cursor-not-allowed hover:bg-transparent"
                                }`}
                            onClick={handleDoorClick}
                        >
                            {unlocked ? (
                                <>
                                    <Unlock className="w-6 h-6" />
                                    ENTER DOOR
                                </>
                            ) : (
                                <>
                                    <Lock className="w-6 h-6" />
                                    LOCKED
                                </>
                            )}
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PasswordRoom;
