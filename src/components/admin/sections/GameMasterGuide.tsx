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
            { name: "Threat Identification", solution: "Search 60 emails. Locate 'Vulnerability Assessment' / 'Pen-Test' email (Hidden in middle/bottom).", fragment: "Threat ID" },
            { name: "Payload Analysis", solution: "Find attachment with double extension (.pdf.exe). Click 'ANALYZE THREAT'.", fragment: "LEVEL-1-COMPLETE" }
        ],
        tools: ["Secure Inbox (60 Emails)", "Threat Analyzer Module"]
    },
    {
        level: 2,
        title: "The Hall of Mirrors",
        theme: "Video OSINT Analysis",
        key: "SHADOW",
        tasks: [
            { name: "Location", solution: "Analyze video. Identify 'Chandigarh International Airport' (IXC).", fragment: "SHA" },
            { name: "Timestamp", solution: "Find time '21:14' (9:14 PM) on screens/clocks.", fragment: "DOW" }
        ],
        tools: ["Video Player", "Flight Tracker/Map Knowledge"]
    },
    {
        level: 3,
        title: "Targeted Penetration",
        theme: "Dictionary Attack (Hydra)",
        key: "DICT_ATTACK_MASTER",
        tasks: [
            { name: "Scraping", solution: "cewl https://omega-corp.internal -w wordlist.txt", fragment: "DICT_" },
            { name: "Brute Force", solution: "hydra -l admin -P wordlist.txt 10.10.10.55", fragment: "ATTACK_MASTER" }
        ],
        tools: ["Terminal", "cewl", "hydra"]
    },
    {
        level: 4,
        title: "The Enigma Vault",
        theme: "SQL Injection",
        key: "ENIGMA",
        tasks: [
            { name: "Schema", solution: "Find 'is_admin' column in Users table", fragment: "ENIG" },
            { name: "Auth Bypass", solution: "Login with user: admin' --", fragment: "MA" }
        ],
        tools: ["Basic SQL Knowledge", "In-Game Database Explorer", "In-Game Login Terminal"]
    },
    {
        level: 5,
        title: "The Final Escape",
        theme: "Network & Crypto",
        key: "ESCAPE",
        tasks: [
            { name: "Firewall", solution: "Exploit Port 80 (HTTP) node", fragment: "ES" },
            { name: "Decryption", solution: "Shift -3 (Caesar) -> Enter 'ESCAPE'", fragment: "CA" },
            { name: "Override", solution: "Terminal -> help -> sudo system_override", fragment: "PE" }
        ],
        tools: ["Network Protocol Knowledge", "Cryptography Basics (Caesar Cipher)", "In-Game Master Terminal"]
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
            <div className="rounded-md border border-white/10 bg-black/40">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead className="text-primary font-bold">Level</TableHead>
                            <TableHead className="text-white">Theme</TableHead>
                            <TableHead className="text-white">Key (Solution)</TableHead>
                            <TableHead className="text-white">Tasks & Solutions</TableHead>
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
                                        <code className="bg-slate-800 px-2 py-1 rounded text-green-400 font-mono text-sm">
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
        </div>
    );
};
