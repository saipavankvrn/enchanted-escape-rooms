import { useState, useRef, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { toast } from 'sonner';
import { Globe } from 'lucide-react';

const CursedLibrary = () => {
    const { gameState, completeSubTask } = useGameState();
    const [initialState] = useState(() => [
        { text: "KALI LINUX - PENTEST STATION", type: 'system' as const },
        { text: "CONNECTED TO: OMEGA CORP INTERNAL NETWORK", type: 'default' as const },
        { text: "> [LIBRARIAN]: Access denied. The gate is locked.", type: 'info' as const },
        { text: "> [LIBRARIAN]: A hunter doesn't bring their own bait; they find it in the environment.", type: 'info' as const },
        { text: "> [SUGGESTION]: Scrape the 'About Us' page to find the words... and maybe the year.", type: 'info' as const },
        { text: "---------------------------------------------------", type: 'default' as const },
        { text: "Available Tools: nmap, cewl, cat, sed, hydra, clear, help", type: 'default' as const },
        { text: "", type: 'default' as const },
    ]);

    const [terminalOutput, setTerminalOutput] = useState<{ text: string; type: 'info' | 'success' | 'error' | 'default' | 'system' }[]>(() => {
        const saved = localStorage.getItem('level3_terminal_output');
        return saved ? JSON.parse(saved) : [
            { text: "KALI LINUX - PENTEST STATION", type: 'system' },
            { text: "CONNECTED TO: OMEGA CORP INTERNAL NETWORK", type: 'default' },
            { text: "> [LIBRARIAN]: Access denied. The gate is locked.", type: 'info' },
            { text: "> [LIBRARIAN]: A hunter doesn't bring their own bait; they find it in the environment.", type: 'info' },
            { text: "> [SUGGESTION]: Scrape the 'About Us' page to find the words... and maybe the year.", type: 'info' },
            { text: "---------------------------------------------------", type: 'default' },
            { text: "Available Tools: nmap, cewl, cat, sed, hydra, clear, help", type: 'default' },
            { text: "", type: 'default' },
        ];
    });
    const [command, setCommand] = useState(() => localStorage.getItem('level3_command') || '');

    // File system state
    const [fileSystem, setFileSystem] = useState<Record<string, string>>(() => {
        const saved = localStorage.getItem('level3_filesystem');
        return saved ? JSON.parse(saved) : {
            "readme.txt": "Target IP: 10.10.10.55\nGoal: SSH Access via 'admin' user.\nHint: Harvest the site’s words, append the current year (2026), and unleash the beast to find the one true key."
        };
    });

    useEffect(() => {
        localStorage.setItem('level3_terminal_output', JSON.stringify(terminalOutput));
    }, [terminalOutput]);

    useEffect(() => {
        localStorage.setItem('level3_command', command);
    }, [command]);

    useEffect(() => {
        localStorage.setItem('level3_filesystem', JSON.stringify(fileSystem));
    }, [fileSystem]);

    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const collectedBytes = gameState.subTasksCompleted[3] || [];
    const hasKey = collectedBytes.includes('byte_1');

    // Base words found on the site
    const SITE_WORDS_BASE = [
        "Omega", "Corp", "Titan", "Eleanor", "Research", "Seattle", "Vision", "Future", "Synergy"
    ];

    // The correct password logic: A word (Titan) + Year (2026)
    const TARGET_PASSWORD = "Titan2026";

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalOutput]);

    const print = (text: string, type: 'info' | 'success' | 'error' | 'default' | 'system' = 'default') => {
        setTerminalOutput(prev => [...prev, { text, type }]);
    };

    const handleCommand = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const raw = command.trim();
            print(`root@kali:~# ${raw}`, 'default');
            setCommand('');

            if (!raw) return;

            // Simple command parsing
            // We need to support checks for specific flags and file redirection >
            const parts = raw.split(' ');
            const cmd = parts[0];

            // Simulation Delay
            await new Promise(r => setTimeout(r, 200));

            if (cmd === 'help') {
                print("Available Commands:");
                print("  nmap <ip>                        - Scan network ports");
                print("  cewl <url> -w <file>             - Spider a site and create a wordlist");
                print("  sed 's/$/<suffix>/' <in> > <out> - Append text to lines");
                print("  hydra -l <user> -P <file> <ip>   - Brute force login");
                print("  ls                               - List files");
                print("  cat <file>                       - Read file");
                print("  clear                            - Clear terminal");
            }
            else if (cmd === 'clear') {
                setTerminalOutput([]);
            }
            else if (cmd === 'ls') {
                print(Object.keys(fileSystem).join("  "));
            }
            else if (cmd === 'cat') {
                if (!parts[1]) print("Usage: cat <filename>", "error");
                else if (fileSystem[parts[1]]) print(fileSystem[parts[1]]);
                else print(`cat: ${parts[1]}: No such file or directory`, "error");
            }
            else if (cmd === 'nmap') {
                if (!parts[1]) print("Usage: nmap <target_ip>", "error");
                else {
                    print(`Starting Nmap 7.92 scan against ${parts[1]}...`);
                    await new Promise(r => setTimeout(r, 1000));
                    print(`Host is up (0.002s latency).`);
                    print(`PORT   STATE SERVICE`);
                    print(`22/tcp OPEN  ssh`);
                    print(`80/tcp OPEN  http`);
                }
            }
            else if (cmd === 'cewl') {
                // cewl https://omega-corp.internal/about-us -w words.txt
                const wIndex = parts.indexOf('-w');
                if (parts.length < 4 || wIndex === -1 || wIndex === parts.length - 1) {
                    print("Usage: cewl <url> -w <output_file>", "error");
                    return;
                }
                const url = parts[1];
                const filename = parts[wIndex + 1];

                if (!url.includes('omega-corp')) {
                    print("Error: Could not resolve host. Are you targeting the right domain?", "error");
                    return;
                }

                print(`CeWL 5.4.3 (Custom Word List generator)`);
                print(`Target: ${url}`);
                print(`Spidering site...`, "info");

                await new Promise(r => setTimeout(r, 1500));
                print(`[+] Parsing text...`);
                print(`[+] Found ${SITE_WORDS_BASE.length} unique words.`);
                print(`[+] Writing to file: ${filename}`, "success");

                setFileSystem(prev => ({ ...prev, [filename]: SITE_WORDS_BASE.join("\n") }));
            }
            else if (cmd === 'sed') {
                // sed 's/$/2026/' words.txt > final_list.txt
                // This is a bit complex to parse perfectly, so we'll look for key signature
                const fullCmd = raw;
                if (!fullCmd.includes("s/$/") || !fullCmd.includes(">")) {
                    print("Usage: sed 's/$/SUFFIX/' input_file > output_file", "error");
                    print("Hint: You want to append the year (2026) to every word.", "info");
                    return;
                }

                // parse suffix
                // expecting 's/$/2026/'
                const match = fullCmd.match(/s\/\$\/(.*?)\//);
                if (!match) {
                    print("sed: parsing error. Ensure format is 's/$/SUFFIX/'", "error");
                    return;
                }
                const suffix = match[1];

                // parse input and output files
                // simple split by >
                const splitByRedirect = fullCmd.split('>');
                if (splitByRedirect.length !== 2) {
                    print("sed: missing output redirection >", "error");
                    return;
                }

                const leftPart = splitByRedirect[0].trim().split(' ');
                const inputFile = leftPart[leftPart.length - 1]; // last word before >
                const outputFile = splitByRedirect[1].trim();

                if (!fileSystem[inputFile]) {
                    print(`sed: cannot read ${inputFile}: No such file`, "error");
                    return;
                }

                const content = fileSystem[inputFile];
                const lines = content.split('\n');
                const newContent = lines.map(line => line + suffix).join('\n');

                setFileSystem(prev => ({ ...prev, [outputFile]: newContent }));
                print(""); // empty line
            }
            else if (cmd === 'hydra') {
                // hydra -l admin -P final_list.txt 10.10.10.55
                if (parts.length < 5) {
                    print("Usage: hydra -l <user> -P <wordlist> <target_ip>", "error");
                    return;
                }

                const lIndex = parts.indexOf('-l');
                const pIndex = parts.indexOf('-P');

                if (lIndex === -1 || pIndex === -1) {
                    print("Missing -l or -P arguments.", "error");
                    return;
                }

                const user = parts[lIndex + 1];
                const wordlist = parts[pIndex + 1];
                const target = parts[parts.length - 1]; // assume last arg is IP

                if (!fileSystem[wordlist]) {
                    print(`Error: Wordlist '${wordlist}' not found.`, "error");
                    return;
                }

                const content = fileSystem[wordlist];
                const words = content.split('\n');

                print(`Hydra v9.1 (Rocking since 2000)`);
                print(`[DATA] attacking ssh://${target}:22/`);
                print(`[DATA] loading ${words.length} passwords from ${wordlist}`);

                let found = false;

                // Simulate checking
                let i = 0;
                const interval = setInterval(() => {
                    if (i >= words.length) {
                        clearInterval(interval);
                        if (!found) {
                            print(`[FAIL] 0 valid passwords found.`, "error");
                            print(`[HINT] Did you add the year 2026 to the words?`, "info");
                        }
                        return;
                    }

                    const attempt = words[i];
                    if (Math.random() > 0.8) print(`[ATTEMPT] user: ${user} pass: ${attempt}`);

                    if (attempt === TARGET_PASSWORD && user === 'admin') {
                        found = true;
                        clearInterval(interval);
                        print(`[22][ssh] host: ${target}   login: ${user}   password: ${attempt}`, "success");
                        print(`[STATUS] Attack finished. 1 valid credential found.`, "success");

                        if (!hasKey) {
                            setTimeout(() => {
                                toast.success("SYSTEM COMPROMISED", {
                                    description: "Root Access Granted. Flag Found.",
                                    action: {
                                        label: "View Flag",
                                        onClick: () => console.log("Flag")
                                    }
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
        <div className="w-full h-full min-h-[500px] flex flex-col md:flex-row border-2 border-slate-700 bg-black rounded-lg overflow-hidden shadow-2xl">
            {/* LEFT: Browser */}
            <div className="md:w-1/2 flex flex-col bg-slate-100 border-r border-slate-700">
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
                        <h1 className="text-4xl font-bold text-slate-900 mb-1 tracking-tighter">OMEGA CORP</h1>
                        <p className="text-slate-500 italic">"Pioneering the Future."</p>
                    </div>

                    <div className="prose prose-sm max-w-none text-justify">
                        <p>
                            Welcome to <strong>Omega Corp</strong>. Since our founding in <strong>2019</strong>, we have dedicated ourselves to pushing the boundaries of technology.
                        </p>

                        <h3 className="text-lg font-bold text-indigo-900 mt-6 mb-2">Our Leadership</h3>
                        <p>
                            Under the guidance of <strong>Eleanor</strong> Vance, our CEO, we have expanded from a small garage in <strong>Seattle</strong> to a global powerhouse. Her <strong>Vision</strong> drives us forward.
                        </p>

                        <h3 className="text-lg font-bold text-indigo-900 mt-6 mb-2">Strategic Initiatives</h3>
                        <p>
                            Our latest endeavor, Project <strong>Titan</strong>, represents the pinnacle of our <strong>Research</strong>. We believe that true <strong>Synergy</strong> comes from combining human ingenuity with machine precision.
                        </p>

                        <div className="mt-8 bg-slate-100 p-4 rounded border-l-4 border-indigo-900">
                            <h4 className="font-bold text-indigo-900">News Update</h4>
                            <p className="text-xs">
                                We are proud to announce record-breaking growth as we approach our next big milestone in <strong>2026</strong>.
                            </p>
                        </div>

                        <hr className="my-8" />
                        <div className="text-center text-xs text-slate-400">
                            <p>© 2026 Omega Corp. All rights reserved.</p>
                            <p className="mt-2 font-mono">Internal Access: ssh://10.10.10.55</p>
                        </div>
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

                <div ref={terminalRef} className="flex-1 overflow-y-auto p-4 space-y-1 text-green-400 font-code">
                    {terminalOutput.map((line, i) => (
                        <div key={i} className={`whitespace-pre-wrap break-all ${line.type === 'error' ? 'text-red-500' :
                            line.type === 'success' ? 'text-green-400 font-bold' :
                                line.type === 'info' ? 'text-blue-400' :
                                    line.type === 'system' ? 'text-purple-400 font-bold' :
                                        'text-slate-300'
                            }`}>
                            {line.text}
                        </div>
                    ))}
                    <div className="flex items-center pt-2">
                        <span className="text-red-500 mr-2 font-bold">root@kali:~#</span>
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
                            <h2 className="text-2xl font-bold text-green-500 mb-4 animate-pulse">ACCESS GRANTED</h2>
                            <p className="text-slate-300 mb-4">You have successfully breached the Omega Corp servers.</p>
                            <div className="border border-dashed border-green-500/50 bg-green-500/10 p-4 mb-4 font-mono text-xl text-green-400">
                                FLAG: [DICT_ATTACK_MASTER]
                            </div>
                            <p className="text-xs text-slate-500">File 'clearance_level_4.pdf' downloaded.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CursedLibrary;
