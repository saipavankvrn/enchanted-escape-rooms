import { useState, useRef, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { toast } from 'sonner';
import { Terminal, Globe, Lock, Cpu, Server, FileText } from 'lucide-react';

const CursedLibrary = () => {
    const { gameState, completeSubTask } = useGameState();
    const [terminalOutput, setTerminalOutput] = useState<{ text: string; type: 'info' | 'success' | 'error' | 'default' }[]>([
        { text: "KALI LINUX - PENTEST STATION", type: 'default' },
        { text: "IP: 10.10.10.99 | Target: 10.10.10.55 (Omega Corp)", type: 'default' },
        { text: "---------------------------------------------------", type: 'default' },
        { text: "MISSION: Gain SSH access. Standard wordlists have failed.", type: 'info' },
        { text: "HINT: Generate a custom wordlist based on the target's website content.", type: 'info' },
        { text: "---------------------------------------------------", type: 'default' },
        { text: "Available Tools: nmap, cewl, cat, hydra, clear, help", type: 'default' },
        { text: "", type: 'default' },
    ]);
    const [command, setCommand] = useState('');
    const [fileSystem, setFileSystem] = useState<Record<string, string>>({
        "readme.txt": "Target IP: 10.10.10.55\nGoal: SSH Access"
    });
    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const collectedBytes = gameState.subTasksCompleted[3] || [];
    const hasKey = collectedBytes.includes('byte_1');

    // Site Words for cewl
    const SITE_WORDS = [
        "Omega", "Corp", "Building", "Future", "Today", "2019", "Eleanor", "Vance",
        "Synergy", "Innovation", "Seattle", "2026", "Strategic", "Vision", "Project",
        "Titan", "CyberBlade", "Excellence", "admin", "Portal"
    ];
    const PASSWORD = "admin";

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalOutput]);

    const print = (text: string, type: 'info' | 'success' | 'error' | 'default' = 'default') => {
        setTerminalOutput(prev => [...prev, { text, type }]);
    };

    const handleCommand = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const raw = command.trim();
            print(`root@kali:~# ${raw}`, 'default');
            setCommand('');

            if (!raw) return;

            const parts = raw.split(' ');
            const cmd = parts[0];
            const args = parts.slice(1);

            // Simulation Delay
            await new Promise(r => setTimeout(r, 200));

            if (cmd === 'help') {
                print("Available Commands:");
                print("  nmap <ip>              - Scan network ports");
                print("  cewl <url> -w <file>   - Spider a site and create a wordlist");
                print("  hydra -l <user> -P <file> <ip>  - Brute force login");
                print("  ls                     - List files");
                print("  cat <file>             - Read file");
                print("  clear                  - Clear terminal");
            }
            else if (cmd === 'clear') {
                setTerminalOutput([]);
            }
            else if (cmd === 'ls') {
                print(Object.keys(fileSystem).join("  "));
            }
            else if (cmd === 'cat') {
                if (!args[0]) print("Usage: cat <filename>", "error");
                else if (fileSystem[args[0]]) print(fileSystem[args[0]]);
                else print(`cat: ${args[0]}: No such file or directory`, "error");
            }
            else if (cmd === 'nmap') {
                if (!args[0]) print("Usage: nmap <target_ip>", "error");
                else {
                    print(`Starting Nmap 7.92 scan against ${args[0]}...`);
                    await new Promise(r => setTimeout(r, 1000));
                    print(`Host is up (0.002s latency).`);
                    print(`PORT   STATE SERVICE`);
                    print(`22/tcp OPEN  ssh`);
                    print(`80/tcp OPEN  http`);
                    print(`443/tcp OPEN https`);
                    print('5000/tcp OPEN admin-portal');
                    print('8080/tcp OPEN tomcat');
                    print('9000/tcp OPEN jboss');
                    print('10000/tcp OPEN jenkins');
                }
            }
            else if (cmd === 'cewl') {
                // cewl <url> -w <file>
                if (args.length < 3 || args[1] !== '-w') {
                    print("Usage: cewl <url> -w <output_file>", "error");
                    return;
                }
                const url = args[0];
                const filename = args[2];

                print(`CeWL 5.4.3 (Custom Word List generator)`);
                print(`Target: ${url}`);
                print(`Spidering site...`, "info");

                await new Promise(r => setTimeout(r, 1500));
                print(`[+] Parsing text...`);
                print(`[+] Found ${SITE_WORDS.length} unique words.`);
                print(`[+] Writing to file: ${filename}`, "success");

                setFileSystem(prev => ({ ...prev, [filename]: SITE_WORDS.join("\n") }));
            }
            else if (cmd === 'hydra') {
                // hydra -l admin -P words.txt 10.10.10.55
                if (args.length < 5 || args[0] !== '-l' || args[2] !== '-P') {
                    print("Usage: hydra -l <user> -P <wordlist> <target_ip>", "error");
                    return;
                }
                const wordlist = args[3];
                const target = args[4];
                const user = args[1];

                if (!fileSystem[wordlist]) {
                    print(`Error: Wordlist '${wordlist}' not found. Did you run cewl?`, "error");
                    return;
                }

                print(`Hydra v9.1 (Rocking since 2000)`);
                print(`[DATA] attacking ssh://${target}:22/`);
                print(`[DATA] loading ${SITE_WORDS.length} passwords from ${wordlist}`);

                let i = 0;
                const interval = setInterval(() => {
                    if (i >= SITE_WORDS.length) {
                        clearInterval(interval);
                        print(`[FAIL] Password not found in list.`, "error");
                        return;
                    }

                    const attempt = SITE_WORDS[i];
                    // Don't flood terminal, maybe verify internal state only or print occasionally?
                    // User code prints every attempt. Let's print every 3rd or just simulate.
                    // Actually, let's print a few.
                    if (Math.random() > 0.7) print(`[ATTEMPT] user: ${user} pass: ${attempt}`);

                    if (attempt === PASSWORD) {
                        clearInterval(interval);
                        print(`[22][ssh] host: ${target}   login: ${user}   password: ${attempt}`, "success");
                        print(`[STATUS] Attack finished. 1 valid credential found.`, "success");

                        if (!hasKey) {
                            setTimeout(() => {
                                toast.success("SYSTEM COMPROMISED: SSH Access Granted", {
                                    description: "Flag: [DICT_ATTACK_MASTER]. Key Generated.",
                                    duration: 5000
                                });
                                completeSubTask(3, 'byte_1');
                            }, 1000);
                        }
                    }
                    i++;
                }, 100);
            }
            else {
                print(`Command not found: ${cmd}. Type 'help'.`, "error");
            }
        }
    };

    return (
        <div className="w-full h-full max-h-[600px] flex flex-col md:flex-row border-2 border-slate-700 bg-black rounded-lg overflow-hidden shadow-2xl">
            {/* LEFT: Browser */}
            <div className="md:w-1/2 flex flex-col border-r border-slate-700 bg-slate-100">
                {/* URL Bar */}
                <div className="bg-slate-800 p-2 flex items-center gap-2 border-b border-black">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value="https://omega-corp.internal/about-us"
                        readOnly
                        className="w-full bg-black text-green-500 font-mono text-xs p-2 rounded border border-slate-600 focus:outline-none"
                    />
                </div>
                {/* Web Content */}
                <div className="flex-1 overflow-y-auto p-8 font-serif text-slate-800 bg-white">
                    <div className="text-center border-b-2 border-slate-200 pb-4 mb-6">
                        <h1 className="text-4xl font-bold text-slate-900 mb-1">OMEGA CORP</h1>
                        <p className="text-slate-500 italic">"Building the Future, Today."</p>
                    </div>

                    <div className="prose prose-sm max-w-none">
                        <h2 className="text-xl font-bold text-orange-700 mt-6 mb-2">Our Leadership</h2>
                        <p>Founded in <strong>2019</strong> by our visionary CEO, <strong>Eleanor</strong> Vance, Omega Corp has grown into a global leader in cybersecurity solutions.</p>

                        <h2 className="text-xl font-bold text-orange-700 mt-6 mb-2">Our Philosophy</h2>
                        <p>We believe in <strong>Synergy</strong> and <strong>Innovation</strong>. Our headquarters in <strong>Seattle</strong> serves as the hub for our operations.</p>

                        <h2 className="text-xl font-bold text-orange-700 mt-6 mb-2">2026 Strategic Vision</h2>
                        <p>Project <strong>Titan</strong> is our newest initiative. We are launching the <strong>CyberBlade</strong> product line this fall. We are committed to <strong>Excellence</strong>.</p>

                        <hr className="my-8" />
                        <p className="text-xs text-slate-400 text-center">
                            Copyright © 2026 Omega Corp. All rights reserved. <br />
                            <span className="font-mono text-slate-600">Admin Portal: ssh://10.10.10.55</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT: Terminal */}
            <div className="md:w-1/2 flex flex-col bg-black font-mono text-sm relative" onClick={() => inputRef.current?.focus()}>
                <div className="bg-slate-900 p-1 px-4 text-xs text-slate-500 flex justify-between items-center select-none">
                    <span>root@kali:~</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                </div>

                <div ref={terminalRef} className="flex-1 overflow-y-auto p-4 space-y-1 text-green-400">
                    {terminalOutput.map((line, i) => (
                        <div key={i} className={`whitespace-pre-wrap break-all ${line.type === 'error' ? 'text-red-500' :
                            line.type === 'success' ? 'text-green-300 font-bold' :
                                line.type === 'info' ? 'text-cyan-400' :
                                    'text-slate-300'
                            }`}>
                            {line.text}
                        </div>
                    ))}
                    <div className="flex items-center pt-2">
                        <span className="text-green-500 mr-2 font-bold">root@kali:~#</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={command}
                            onChange={(e) => setCommand(e.target.value)}
                            onKeyDown={handleCommand}
                            className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0"
                            autoComplete="off"
                            autoFocus
                        />
                    </div>
                </div>

                {hasKey && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 backdrop-blur-sm">
                        <div className="bg-slate-900 border-2 border-green-500 p-8 rounded-lg max-w-md text-center shadow-[0_0_50px_rgba(0,255,0,0.2)]">
                            <h2 className="text-2xl font-bold text-green-500 mb-4 animate-pulse">SYSTEM COMPROMISED</h2>
                            <p className="text-slate-300 mb-4">Access Granted. You successfully cracked the password using a targeted dictionary attack.</p>
                            <div className="border border-dashed border-green-500/50 bg-green-500/10 p-4 mb-4 font-mono text-xl text-green-400">
                                FLAG: [DICT_ATTACK_MASTER]
                            </div>
                            <p className="text-xs text-slate-500">Key synchronized with system core.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CursedLibrary;
