import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Copy, Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const LEVEL_DATA = [
    {
        level: 1,
        title: "The Whispering Porch",
        theme: "Advanced Phishing Detection",
        key: "LEVEL-1-COMPLETE",
        tasks: [
            { name: "Phishing Classification", solution: "Drag 7 emails to correct folders. 3 Legitimate (HR, Payroll, Sarah), 4 Phishing (IT, CEO, Amazon, Admin).", fragment: "Threat ID" },
            { name: "Verification", solution: "Click 'SUBMIT CLASSIFICATION'. System checks if placements align with hidden 'isMalware' flags.", fragment: "LEVEL-1-COMPLETE" }
        ],
        tools: ["Drag & Drop Interface", "Email Analyzer"],
        hints: [
            "Check the sender domain carefully. 'amazon-security.net' is suspicious.",
            "Generic greetings like 'Dear User' often indicate phishing.",
            "Hover over links to see the actual destination URL before clicking."
        ]
    },
    {
        level: 2,
        title: "The Hall of Mirrors",
        theme: "Logic & Deduction (Cold Case)",
        key: "SPOOFED_2026",
        tasks: [
            { name: "1. Alibi Intersection", solution: "60 minutes (Overlap Duration)", fragment: "SPO" },
            { name: "2. Reflection Paradox", solution: "6 hours (Time Difference)", fragment: "OF" },
            { name: "3. Network Ghost", solution: "Windows OS (Device Mismatch)", fragment: "ED_" },
            { name: "4. Password Trap", solution: "Mirror B", fragment: "20" },
            { name: "5. Geographic Impossible", solution: "120km/h (Required Speed)", fragment: "26" }
        ],
        tools: ["Logic", "Calculator", "Attention to Detail"],
        hints: [
            "Task 1: Calculate the duration of the overlap.",
            "Task 2: Phone time minus Mirror time.",
            "Task 3: Which OS does not match the registry?",
            "Task 4: Check the ID badge logo.",
            "Task 5: Speed = Distance / Time."
        ]
    },
    {
        level: 3,
        title: "The Cold Kitchen",
        theme: "Cryptography",
        key: "TH3_M4SK_0F_Z0RR0",
        tasks: [
            { name: "Rogue Intern", solution: "ROT13 -> Base64 Decode", fragment: "Beat_me_if_Possible!!!!" },
            { name: "Stacked Cipher", solution: "Base64 Decode -> Reverse String", fragment: "Veltech.Welcomes_You-All" }
        ],
        tools: ["CyberChef", "Vigenere Cipher Decoder", "Base64 Decoder"],
        hints: [
            "Layer 1: 'My mother used to make roti using base on a roti board' -> ROT13 + Base64.",
            "Layer 2: 'The base needs to be reversed' -> Base64 Decode then Reverse string.",
            "The final key is displayed after solving Layer 2."
        ]
    },
    {
        level: 4,
        title: "The Cursed Library",
        theme: "SQL Injection / Brute Force",
        key: "DICT_ATTACK_MASTER",
        tasks: [
            { name: "Command Injection", solution: "Type 'help' to see commands.", fragment: "DICT_" },
            { name: "Brute Force", solution: "Run: cewl/hydra sequence.", fragment: "ATTACK_MASTER" }
        ],
        tools: ["Terminal", "cewl", "hydra"],
        hints: [
            "Harvest words from the 'About Us' page using 'cewl'.",
            "The password policy requires the current year (2026) appended to words.",
            "Use 'sed' to modify your wordlist before running 'hydra'."
        ]
    },
    {
        level: 5,
        title: "The Shadow Heart",
        theme: "Network Forensics",
        key: "P64P_4N4L7S1S_SU55355FUL_4624A8B6",
        tasks: [
            { name: "Traffic Analysis", solution: "Download 'traffic_dump.pcap'.", fragment: "PCAP" },
            { name: "Hint Penalty", solution: "3 Minute Penalty for hint usage.", fragment: "FTP" },
            { name: "Flag Extraction", solution: "Filter FTP/TCP stream. Flag: 'P64P_4N4L7S1S_SU55355FUL_4624A8B6'", fragment: "Flag" }
        ],
        tools: ["Wireshark", "Network Miner", "Packet Analysis"],
        hints: [
            "The hint reveals: 'Today i am travelling from Chennai(20) to Delhi(21)...'",
            "Filter for HTTP or FTP traffic to find file transfers.",
            "Look for a file named 'flag.txt' or similar inside the packet capture."
        ]
    }
];

export const GameMasterGuide = () => {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-display text-primary">Game Master Guide (Spoilers)</h2>
            <div className="rounded-md border border-white/10 bg-black/40 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead className="text-primary font-bold">Level</TableHead>
                            <TableHead className="text-white">Theme</TableHead>
                            <TableHead className="text-white">Key (Solution)</TableHead>
                            <TableHead className="text-white">Tasks & Solutions</TableHead>
                            <TableHead className="text-white">Hints (Use Wisely)</TableHead>
                            <TableHead className="text-white">Required Tools/Resources</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {LEVEL_DATA.map((level) => (
                            <TableRow key={level.level} className="border-white/10 hover:bg-white/5">
                                <TableCell className="font-bold text-primary align-top">
                                    Level {level.level}
                                </TableCell>
                                <TableCell className="align-top">
                                    <div className="font-semibold text-white">{level.title}</div>
                                    <div className="text-xs text-slate-400">{level.theme}</div>
                                </TableCell>
                                <TableCell className="align-top">
                                    <div className="flex items-center gap-2">
                                        <code className="bg-slate-800 px-2 py-1 rounded text-green-400 font-mono text-xs break-all max-w-[200px] inline-block">
                                            {level.key}
                                        </code>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0"
                                            onClick={() => copyToClipboard(level.key)}
                                        >
                                            <Copy className="w-3 h-3 text-slate-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-2">
                                        {level.tasks.map((task, idx) => (
                                            <div key={idx} className="text-sm border-b border-white/5 pb-1 last:border-0">
                                                <span className="text-primary font-bold text-xs uppercase tracking-wider">{task.name}: </span>
                                                <span className="text-slate-300">{task.solution}</span>
                                                <span className="ml-2 text-[10px] text-slate-500 bg-black/50 px-1 rounded border border-slate-800">
                                                    Frag: "{task.fragment}"
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="align-top max-w-[250px]">
                                    <ul className="list-disc list-inside space-y-1">
                                        {level.hints.map((hint, idx) => (
                                            <li key={idx} className="text-xs text-yellow-500/80">
                                                {hint}
                                            </li>
                                        ))}
                                    </ul>
                                </TableCell>
                                <TableCell className="align-top">
                                    <div className="flex flex-col gap-1">
                                        {level.tools.map((tool, idx) => (
                                            <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
                                                <Hammer className="w-3 h-3 text-primary/70" />
                                                <span>{tool}</span>
                                            </div>
                                        ))}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="space-y-4 pt-8 border-t border-white/10">
                <h3 className="text-xl font-bold font-display text-primary">Admin Capabilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-black/40 border border-primary/20 rounded-lg p-4">
                        <div className="font-bold text-white mb-2">Team Management</div>
                        <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                            <li><span className="text-primary">Add Team:</span> Create new playing teams instantly.</li>
                            <li><span className="text-red-400">Delete Team:</span> Permanently remove team data.</li>
                        </ul>
                    </div>
                    <div className="bg-black/40 border border-primary/20 rounded-lg p-4">
                        <div className="font-bold text-white mb-2">Time Control</div>
                        <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                            <li><span className="text-yellow-400">Reset Timer:</span> Restart 50m countdown for a team.</li>
                            <li><span className="text-green-400">Add Time:</span> Grant +5 mins to struggling teams.</li>
                            <li><span className="text-red-400">Deduct Time:</span> Penalize -5 mins for rule violations.</li>
                        </ul>
                    </div>
                    <div className="bg-black/40 border border-primary/20 rounded-lg p-4">
                        <div className="font-bold text-white mb-2">Level Control</div>
                        <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                            <li><span className="text-primary">Reset Level:</span> Send team back to specific level start.</li>
                            <li><span className="text-blue-400">Unlock All:</span> (Dev Mode) Bypass progression checks.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
