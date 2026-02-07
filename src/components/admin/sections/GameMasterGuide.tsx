import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const LEVEL_DATA = [
    {
        level: 1,
        title: "The Whispering Porch",
        theme: "Phishing & Email Analysis",
        key: "LEVEL-1-COMPLETE",
        tools: "Simulated Email Client, Malware Scanner",
        tasks: [
            { name: "Sender ID", solution: "Flag 'amazon@verify-acc.com'", fragment: "LEVEL-" },
            { name: "Link Analysis", solution: "Click insecure HTTP link in HR Policy email", fragment: "1-COM" },
            { name: "Malware Scan", solution: "Hover 'report.pdf' attachment, find .exe", fragment: "PLETE" }
        ]
    },
    {
        level: 2,
        title: "The Hall of Mirrors",
        theme: "OSINT & Deepfakes",
        key: "SHADOW",
        tools: "Social Feed, EXIF Lens, Video Analyzer",
        tasks: [
            { name: "Timeline", solution: "Flag post mismatching Bio location (Berlin vs Paris)", fragment: "SH" },
            { name: "Metadata", solution: "Hover image to find GPS coordinates (NYC)", fragment: "AD" },
            { name: "Deepfake", solution: "Flag video with unsynced lips", fragment: "OW" }
        ]
    },
    {
        level: 3,
        title: "The Cursed Library",
        theme: "Passwords & Brute Force",
        key: "CIPHER",
        tools: "Password List, Voltage Meter",
        tasks: [
            { name: "Complexity", solution: "Select 3 strong passwords (Upper, Num, Sym)", fragment: "CIP" },
            { name: "Voltage", solution: "Order valid passwords by length (Ascending)", fragment: "HER" }
        ]
    },
    {
        level: 4,
        title: "The Enigma Vault",
        theme: "SQL Injection",
        key: "ENIGMA",
        tools: "Database Explorer, Admin Terminal",
        tasks: [
            { name: "Schema", solution: "Find 'is_admin' column in Users table", fragment: "ENIG" },
            { name: "Auth Bypass", solution: "Login with user: admin' --", fragment: "MA" }
        ]
    },
    {
        level: 5,
        title: "The Final Escape",
        theme: "Network & Crypto",
        key: "ESCAPE",
        tools: "Network Scanner, Decryption Module, Command Line",
        tasks: [
            { name: "Firewall", solution: "Exploit Port 80 (HTTP) node", fragment: "ES" },
            { name: "Decryption", solution: "Shift -3 (Caesar) -> Enter 'ESCAPE'", fragment: "CA" },
            { name: "Override", solution: "Terminal -> help -> sudo system_override", fragment: "PE" }
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
            <div className="rounded-md border border-white/10 bg-black/40">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead className="text-primary font-bold w-[100px]">Level</TableHead>
                            <TableHead className="text-white w-[200px]">Theme & Tools</TableHead>
                            <TableHead className="text-white w-[180px]">Key (Solution)</TableHead>
                            <TableHead className="text-white">Detailed Tasks & Solutions</TableHead>
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
                                    <div className="text-xs text-slate-400 mb-1">{level.theme}</div>
                                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono border-t border-white/5 pt-1 mt-1">
                                        Tools: {level.tools}
                                    </div>
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
