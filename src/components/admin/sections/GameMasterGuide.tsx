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
        theme: "Phishing Intelligence",
        key: "LEVEL-1-COMPLETE",
        tasks: [
            { name: "Threat Triage", solution: "Sort 7 emails. Legit: HR Policy, Project Alpha, Payroll. Phishing: IT Support (micros0ft), CEO Fraud (gmail), Amazon (.exe), Admin (goggle).", fragment: "KEY" },
            { name: "Submission", solution: "All 7 must be perfect. System verifies against 'isMalware' flags and generates access key.", fragment: "LEVEL-1" }
        ],
        tools: ["Drag & Drop", "Email Headers", "Domain Verification"],
        hints: [
            "Penalty: 60s for global level hint.",
            "Look for 'micros0ft' or 'goggle' spelling errors in domains.",
            "Suspicious attachments like '.exe' are immediate red flags.",
            "CEO fraud uses urgency and external (gmail) addresses."
        ]
    },
    {
        level: 2,
        title: "The Hall of Mirrors",
        theme: "Logic & Forensic Deduction",
        key: "SPOOFED_2026",
        tasks: [
            { name: "Alibi", solution: "60 (Minutes overlap between 1-3 PM lab and 2 PM beach post).", fragment: "SPO" },
            { name: "Reflection", solution: "6 (Difference between 10 AM analog and 4 PM/16:00 digital).", fragment: "OF" },
            { name: "Network", solution: "windows (Login OS doesn't match Student's Macbook registry).", fragment: "ED_" },
            { name: "Trap", solution: "mirror b (Rejected correct uniform name, indicating phishing).", fragment: "20" },
            { name: "Geography", solution: "120 (10km in 5 min requires 120 km/h velocity).", fragment: "26" }
        ],
        tools: ["Sherlock Insight", "Logic Engine", "Calculator"],
        hints: [
            "Penalty: 20s per 'Sherlock's Insight' requested.",
            "Analog clocks (Mirror) don't show AM/PM—digital phones do.",
            "A phishing trap (Shadow Clone) rejects real truths.",
            "Velocity = Distance / (Minutes/60)."
        ]
    },
    {
        level: 3,
        title: "The Cold Kitchen (Vault)",
        theme: "Multi-Layered Cryptography",
        key: "TH3_M4SK_0F_Z0RR0",
        tasks: [
            { name: "Rogue Intern", solution: "ROT13(DzIu...) -> Base64 Decode -> 'Beat_me_if_Possible!!!!'", fragment: "TH3_M4SK" },
            { name: "Stacked Cipher", solution: "Base64(bGxBL...) -> Reverse -> 'Veltech.Welcomes_You-All'", fragment: "Z0RR0" }
        ],
        tools: ["CyberChef", "Base64 Logic", "ROT13 Substitution"],
        hints: [
            "Penalty: 120s (2m) per decryption layer hint.",
            "Layer 1: 'Base on a roti board' = Base64 + ROT13.",
            "Layer 2: 'Base needs to be reversed' = Base64 then reverse string.",
            "The final master key appears only after both layers are cracked."
        ]
    },
    {
        level: 4,
        title: "The Cursed Library",
        theme: "Automated OSINT & Brute Force",
        key: "DICT_ATTACK_MASTER",
        tasks: [
            { name: "Scraping", solution: "Run: 'cewl https://omega-corp.internal/about-us -w words.txt'", fragment: "DICT_" },
            { name: "Modification", solution: "Run: 'sed s/$/2026/ words.txt > final.txt' (Appends year).", fragment: "ATTACK" },
            { name: "Breach", solution: "Run: 'hydra -l admin -P final.txt 10.10.10.55' to find password.", fragment: "MASTER" }
        ],
        tools: ["Terminal (Kali)", "CeWL (Scraper)", "Hydra (Brute Force)"],
        hints: [
            "Penalty: 120s (2m) per terminal logic hint.",
            "The library contains the 'Seeds' (words) on the About Us page.",
            "Passwords for 2026 require the year appended to company keywords (e.g., Titan2026).",
            "Use 'cat' to verify your wordlists before launching the attack."
        ]
    },
    {
        level: 5,
        title: "The Shadow Heart",
        theme: "Advanced Network Forensics",
        key: "P64P_4N4L7S1S_SU55355FUL_4624A8B6",
        tasks: [
            { name: "Ingestion", solution: "Download 'traffic_dump.pcap' for local analysis.", fragment: "P64P" },
            { name: "Interception", solution: "Analyze TCP/HTTP streams for sensitive strings.", fragment: "AN4L7S1S" },
            { name: "Flag Recovery", solution: "The hidden flag is buried in traffic: 'P64P_4N4L7S1S_SU55355FUL_4624A8B6'", fragment: "MASTER" }
        ],
        tools: ["Wireshark", "TShark", "Follow TCP Stream"],
        hints: [
            "Penalty: 180s (3m) for High-Level Intelligence.",
            "Transmission: 'Today i am travelling from Chennai(20) to Delhi(21) for Cyber Catalyst 2026'",
            "Look for uncommon protocols or large data transfers in the dump.",
            "The flag structure matches: P64P_4N4L7S1S..."
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
