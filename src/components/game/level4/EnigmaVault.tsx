import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Database, ShieldAlert, Terminal, Lock } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { toast } from 'sonner';

const EnigmaVault = () => {
    const { gameState, completeSubTask } = useGameState();
    const terminalRef = useRef<HTMLDivElement>(null);

    // Track gathered fragments
    const collectedBytes = gameState.subTasksCompleted[4] || [];
    const hasByte1 = collectedBytes.includes('byte_1'); // SQL Map
    const hasByte2 = collectedBytes.includes('byte_2'); // Login Bypass

    // --- Task 1: Database Schema Analysis (SQL Map) ---
    // User must click "Analyze Schema" to find the vulnerable table/column.
    // Let's make it interactive: A list of tables. Click to expand.
    // Hidden in `users` table -> field `is_admin`.

    const TABLES = [
        { name: "products", columns: ["id", "name", "price", "stock"] },
        { name: "orders", columns: ["id", "user_id", "total", "status"] },
        { name: "users", columns: ["id", "username", "password_hash", "is_admin (vulnerable)"] }, // The hint is in the name for now
    ];

    const handleTableInspect = (column: string) => {
        if (column.includes("vulnerable")) {
            if (!hasByte1) {
                toast.success("VULNERABILITY DETECTED: Unsanitized Column Found", { description: "Fragment 1/2 Recovered: 'ENIG'" });
                completeSubTask(4, 'byte_1');
            }
        } else {
            toast.info("Column appears secure. No injection points found.");
        }
    };

    // --- Task 2: Login Bypass (SQL Injection) ---
    // A fake login form.
    // Username: admin' --
    // Password: (anything)
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [consoleLogs, setConsoleLogs] = useState<string[]>([
        "> System.init()",
        "> Database connection established.",
        "> Waiting for admin authentication..."
    ]);

    const addToLog = (msg: string) => {
        setConsoleLogs(prev => [...prev.slice(-4), msg]);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        addToLog(`> POST /auth/login { user: "${username}" }`);

        // Check for SQL Injection pattern
        // Simple check: contains ' OR '1'='1 or admin' -- 
        // Let's accept: admin' -- or admin' #

        const injectionPattern = /admin'\s*(--|#)/i;

        if (injectionPattern.test(username)) {
            addToLog("> Query Details: SELECT * FROM users WHERE username = 'admin' --' AND password = '...'");
            addToLog("> Comment bypass detected. Password check skipped.");
            addToLog("> ACCESS GRANTED.");

            if (!hasByte2) {
                toast.success("SYSTEM BREACHED: Authentication Bypassed", { description: "Fragment 2/2 Recovered: 'MA'" });
                completeSubTask(4, 'byte_2');
            }
        } else {
            addToLog("> Query Details: SELECT * FROM users WHERE username = '" + username + "' AND password = '***'");
            addToLog("> Access Denied: Invalid credentials.");
            toast.error("Access Denied. Try manipulating the query.");
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-6">

            {/* Status Header */}
            <div className="flex justify-center gap-4">
                <div className={`px-6 py-3 rounded border flex flex-col items-center ${hasByte1 ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-black/40 border-slate-700 text-slate-500'}`}>
                    <span className="text-xs uppercase tracking-widest mb-1">Schema Fragment</span>
                    <span className="font-bold text-lg">{hasByte1 ? "ENIG" : "???"}</span>
                </div>
                <div className={`px-6 py-3 rounded border flex flex-col items-center ${hasByte2 ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-black/40 border-slate-700 text-slate-500'}`}>
                    <span className="text-xs uppercase tracking-widest mb-1">Auth Fragment</span>
                    <span className="font-bold text-lg">{hasByte2 ? "MA" : "???"}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* LEFT: Database Explorer */}
                <div className="bg-slate-900 border border-primary/20 rounded-xl p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                        <Database className="w-5 h-5" /> Database Schema
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                        Inspect table structures to identify injection vectors. Click columns to run vulnerability scan.
                    </p>

                    <div className="space-y-3 flex-1">
                        {TABLES.map((table, idx) => (
                            <div key={idx} className="border border-white/5 rounded bg-black/20 overflow-hidden">
                                <div className="bg-white/5 px-4 py-2 font-mono text-sm text-slate-300 border-b border-white/5 font-bold">
                                    {table.name}
                                </div>
                                <div className="p-2 space-y-1">
                                    {table.columns.map((col, cIdx) => (
                                        <button
                                            key={cIdx}
                                            onClick={() => handleTableInspect(col)}
                                            className="w-full text-left px-3 py-1.5 text-xs font-mono text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-colors rounded flex items-center justify-between group"
                                        >
                                            {col}
                                            <ShieldAlert className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: Admin Login Panel */}
                <div className="bg-slate-900 border border-primary/20 rounded-xl p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5" /> Admin Portal
                    </h3>

                    {/* Simulated Terminal Log */}
                    <div className="bg-black rounded border border-slate-700 p-4 font-mono text-xs h-32 overflow-y-auto mb-4 text-green-500/80 shadow-inner">
                        {consoleLogs.map((log, i) => (
                            <div key={i} className="mb-1">{log}</div>
                        ))}
                        <div ref={terminalRef} />
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-slate-500">Username</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full bg-black/50 border border-slate-700 rounded p-2 text-sm text-white font-mono focus:border-primary focus:outline-none"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <Terminal className="absolute right-3 top-2.5 w-4 h-4 text-slate-600" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-slate-500">Password</label>
                            <input
                                type="password"
                                className="w-full bg-black/50 border border-slate-700 rounded p-2 text-sm text-white font-mono focus:border-primary focus:outline-none"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button type="submit" variant="destructive" className="w-full" disabled={!hasByte1 || hasByte2}>
                            {hasByte2 ? "ACCESS GRANTED" : "AUTHENTICATE"}
                        </Button>
                        {!hasByte1 && <p className="text-[10px] text-center text-red-500/50">LOCKED: Vulnerability Scan Required</p>}
                        {hasByte1 && !hasByte2 && <p className="text-[10px] text-center text-slate-500">Hint: Bypass via username comment injection</p>}
                    </form>
                </div>

            </div>
        </div>
    );
};

export default EnigmaVault;
