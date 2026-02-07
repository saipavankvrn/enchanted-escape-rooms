import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Terminal, Shield, Wifi, Globe, Lock, Code, AlertTriangle } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { toast } from 'sonner';

const FinalEscape = () => {
    const { gameState, completeSubTask } = useGameState();

    // Level 5: The Master Terminal
    // Requires applying knowledge from Levels 1-4.
    // Task 1: Firewall Deactivation (Network Analysis)
    // Task 2: Decrypt Master Key (Cipher)
    // Task 3: Execute Override (Command Line)

    const collectedBytes = gameState.subTasksCompleted[5] || [];
    const hasByte1 = collectedBytes.includes('byte_1'); // Firewall
    const hasByte2 = collectedBytes.includes('byte_2'); // Decrypt
    const hasByte3 = collectedBytes.includes('byte_3'); // Override

    const [activePanel, setActivePanel] = useState<'network' | 'cipher' | 'terminal'>('network');
    const [timeLeft, setTimeLeft] = useState(300); // 5 min local countdown for pressure

    // --- Task 1: Firewall (Network) ---
    // A grid of nodes. Find the weak one (Port 80/HTTP vs 443/HTTPS).
    const NODES = [
        { id: 1, ip: "192.168.1.10", port: "443", protocol: "HTTPS", status: "Secure" },
        { id: 2, ip: "192.168.1.12", port: "22", protocol: "SSH", status: "Locked" },
        { id: 3, ip: "192.168.1.15", port: "80", protocol: "HTTP", status: "Vulnerable" }, // Target
        { id: 4, ip: "192.168.1.20", port: "443", protocol: "HTTPS", status: "Secure" },
    ];

    const handleNodeHack = (node: typeof NODES[0]) => {
        if (node.status === "Vulnerable") {
            if (!hasByte1) {
                toast.success("FIREWALL BYPASSED: Insecure Protocol Exploited.", { description: "Shard 1/3: 'ES'" });
                completeSubTask(5, 'byte_1');
                setActivePanel('cipher');
            }
        } else {
            toast.error("ACCESS DENIED: Node is secure. Find the weak link.");
            // Penalty: Reset terminal or subtract time?
        }
    };

    // --- Task 2: Decrypt (Cipher) ---
    // ROT13 or similar simple cipher.
    // "U3110_W0RLD" -> "HELLO_WORLD"? No let's do hex or binary.
    // Cipher: "43 41 50 45" -> "CAPE". 
    // Key is "ESCAPE". So "45 53 43 41 50 45".
    // Let's make it a mix of patterns.
    // Pattern: "The key to escape is hidden in the shadows."
    // Cipher Text: "E_____ (Level 4 Key) + (Level 2 Key)" ? No too complex.
    // Let's do a shift cipher.
    // "H V F D S H" (Shift -3) -> "E S C A P E".

    const [cipherInput, setCipherInput] = useState("");

    const handleDecrypt = (e: React.FormEvent) => {
        e.preventDefault();
        if (cipherInput.toUpperCase() === "ESCAPE") {
            if (!hasByte2) {
                toast.success("KEY DECRYPTED: Master Sequence Revealed.", { description: "Shard 2/3: 'CA'" });
                completeSubTask(5, 'byte_2');
                setActivePanel('terminal');
            }
        } else {
            toast.error("DECRYPTION FAILED: Invalid Key.");
        }
    };

    // --- Task 3: Terminal Override ---
    // Type commands to execute the escape.
    // 1. sudo mount /dev/master
    // 2. run exploit.exe
    // Let's simplify: Just type "sudo execute escape" or similar.
    // Hint: "Mount the drive, then execute the final command."

    const [terminalInput, setTerminalInput] = useState("");
    const [logs, setLogs] = useState<string[]>([
        "> SYSTEM FAILURE IMMINENT",
        "> CONNECTING TO MAINFRAME...",
        "> AWAITING OVERRIDE COMMAND..."
    ]);

    const handleTerminalCommand = (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = terminalInput.trim().toLowerCase();

        setLogs(prev => [...prev, `> ${terminalInput}`]);
        setTerminalInput("");

        if (cmd === "help") {
            setLogs(prev => [...prev, "AVAILABLE COMMANDS:", "- connect [ip]", "- decrypt [hash]", "- sudo system_override"]);
        } else if (cmd === "sudo system_override") {
            if (!hasByte1 || !hasByte2) {
                setLogs(prev => [...prev, "ERROR: Prerequisites not met. Bypass firewall and decrypt key first."]);
                toast.error("System Locked.");
                return;
            }
            if (!hasByte3) {
                setLogs(prev => [...prev, "OVERRIDE INITIATED...", "SUCCESS. SYSTEM SHUTDOWN."]);
                toast.success("SYSTEM OVERRIDE COMPLETE", { description: "Shard 3/3: 'PE'" });
                completeSubTask(5, 'byte_3');
            }
        } else {
            setLogs(prev => [...prev, "ERROR: Command not recognized. Type 'help'."]);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-4 flex flex-col gap-6">
            {/* Master HUD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className={`p-4 border rounded bg-black/60 flex flex-col items-center justify-center ${activePanel === 'network' ? 'border-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'border-white/10 opacity-50'}`}>
                    <Wifi className="w-6 h-6 mb-2 text-primary" />
                    <span className="text-xs uppercase tracking-widest">Network Layer</span>
                    <span className={`font-bold ${hasByte1 ? 'text-success' : 'text-slate-500'}`}>{hasByte1 ? "BYPASSED [ES]" : "LOCKED"}</span>
                </div>
                <div className={`p-4 border rounded bg-black/60 flex flex-col items-center justify-center ${activePanel === 'cipher' ? 'border-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'border-white/10 opacity-50'}`}>
                    <Code className="w-6 h-6 mb-2 text-primary" />
                    <span className="text-xs uppercase tracking-widest">Encryption Layer</span>
                    <span className={`font-bold ${hasByte2 ? 'text-success' : 'text-slate-500'}`}>{hasByte2 ? "DECRYPTED [CA]" : "LOCKED"}</span>
                </div>
                <div className={`p-4 border rounded bg-black/60 flex flex-col items-center justify-center ${activePanel === 'terminal' ? 'border-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'border-white/10 opacity-50'}`}>
                    <Terminal className="w-6 h-6 mb-2 text-primary" />
                    <span className="text-xs uppercase tracking-widest">Kernel Layer</span>
                    <span className={`font-bold ${hasByte3 ? 'text-success' : 'text-slate-500'}`}>{hasByte3 ? "OVERRIDDEN [PE]" : "LOCKED"}</span>
                </div>
            </div>

            <div className="bg-slate-900 border border-primary/30 rounded-xl p-8 min-h-[400px] relative overflow-hidden">
                {/* Background Grid Animation */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                {/* LAYER 1: NETWORK */}
                {activePanel === 'network' && (
                    <div className="relative z-10 flex flex-col h-full animate-in fade-in zoom-in duration-500">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-red-500" /> Perimeter Defense System
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {NODES.map(node => (
                                <button
                                    key={node.id}
                                    onClick={() => handleNodeHack(node)}
                                    className={`p-4 rounded border flex flex-col gap-2 transition-all hover:scale-105 ${node.status === 'Vulnerable' ? 'border-yellow-500/50 hover:bg-yellow-500/10' : 'border-green-500/30 hover:bg-green-500/10'}`}
                                >
                                    <Globe className="w-8 h-8 text-slate-400" />
                                    <div className="text-xs font-mono text-slate-500">{node.ip}</div>
                                    <div className="font-bold text-white">{node.protocol} :{node.port}</div>
                                    <div className={`text-xs uppercase font-bold ${node.status === 'Vulnerable' ? 'text-yellow-500' : 'text-green-500'}`}>
                                        {/* Hide status text in difficulty increase? No, keep logic simple. */}
                                        {node.status === 'Vulnerable' ? 'Scanning...' : 'Encrypted'}
                                    </div>
                                </button>
                            ))}
                        </div>
                        <p className="mt-8 text-sm text-slate-400 font-mono">
                            <AlertTriangle className="w-4 h-4 inline mr-2 text-yellow-500" />
                            HINT: Secure protocols (HTTPS, SSH) are hardened. Look for unencrypted traffic.
                        </p>
                    </div>
                )}

                {/* LAYER 2: CIPHER */}
                {activePanel === 'cipher' && (
                    <div className="relative z-10 flex flex-col items-center justify-center h-full animate-in fade-in slide-in-from-right duration-500">
                        <h3 className="text-xl font-bold text-white mb-8">Decryption Module</h3>

                        <div className="bg-black/50 p-6 rounded border border-white/10 mb-8 text-center">
                            <p className="text-xs text-slate-500 uppercase tracking-[0.2em] mb-2">Intercepted Hash</p>
                            <div className="text-4xl font-mono font-bold text-primary tracking-widest glitch-text">
                                H V F D S H
                            </div>
                            <p className="mt-4 text-xs text-slate-400">Algorithm: Caesar Cipher (Shift -3)</p>
                        </div>

                        <form onSubmit={handleDecrypt} className="flex gap-4 w-full max-w-md">
                            <input
                                type="text"
                                className="flex-1 bg-slate-800 border border-slate-600 rounded px-4 py-2 text-white font-mono uppercase focus:border-primary focus:outline-none"
                                placeholder="ENTER DECRYPTED KEY"
                                value={cipherInput}
                                onChange={e => setCipherInput(e.target.value)}
                            />
                            <Button type="submit" variant="neon">Unlock</Button>
                        </form>
                    </div>
                )}

                {/* LAYER 3: TERMINAL */}
                {activePanel === 'terminal' && (
                    <div className="relative z-10 flex flex-col h-full animate-in fade-in slide-in-from-bottom duration-500">
                        <div className="flex-1 bg-black p-4 font-mono text-sm text-green-500/90 rounded border border-slate-700 overflow-hidden flex flex-col shadow-inner">
                            <div className="flex-1 overflow-y-auto space-y-1">
                                {logs.map((log, i) => (
                                    <div key={i}>{log}</div>
                                ))}
                            </div>
                            <form onSubmit={handleTerminalCommand} className="mt-2 flex gap-2 border-t border-white/10 pt-2">
                                <span className="text-primary">{">"}</span>
                                <input
                                    autoFocus
                                    type="text"
                                    className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0"
                                    value={terminalInput}
                                    onChange={e => setTerminalInput(e.target.value)}
                                    placeholder="Type 'help' for commands..."
                                />
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinalEscape;
