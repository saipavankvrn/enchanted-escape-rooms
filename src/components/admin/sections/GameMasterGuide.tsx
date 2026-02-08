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
            { name: "Threat Identification", solution: "Search 60 emails. Locate 'Vulnerability Assessment' / 'Pen-Test' email (Index ~38).", fragment: "Threat ID" },
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
            { name: "Scraping", solution: "Run: cewl https://omega-corp.internal -w wordlist.txt", fragment: "DICT_" },
            { name: "Brute Force", solution: "Run: hydra -l admin -P wordlist.txt 10.10.10.55", fragment: "ATTACK_MASTER" }
        ],
        tools: ["Terminal", "cewl", "hydra"]
    },
    {
        level: 4,
        title: "The Enigma Vault",
        theme: "Cryptography",
        key: "TH3_M4SK_0F_Z0RR0",
        tasks: [
            { name: "Artifact Analysis", solution: "'VRvgX000c2euTGZqLqBynyH=' is Base64 encoded, but deciphering it yields garbage.", fragment: "Artifact" },
            { name: "Clue Decoding", solution: "Sticky note 'ALPHA' suggests Vigenere Key. 'My mother use Vigenere while cooking!!!!' is the hint.", fragment: "Hint: Cooking" },
            { name: "Decryption", solution: "Decrypt (Vigenere) 'VRvgX000c2euTGZqLqBynyH=' with key 'ALPHA' -> 'VGgzX000c2tfMGZfWjBycjA='. Then Base64 Decode -> 'Th3_M4sk_0f_Z0rr0'", fragment: "Flag" }
        ],
        tools: ["CyberChef", "Vigenere Cipher Decoder", "Base64 Decoder"]
    },
    {
        level: 5,
        title: "The Needle in the Digital Haystack",
        theme: "Network Forensics",
        key: "P64P_4N4L7S1S_SU55355FUL_4624A8B6",
        tasks: [
            { name: "Traffic Analysis", solution: "Download 'traffic_dump.pcap'. Open in Wireshark.", fragment: "PCAP" },
            { name: "Protocol Filtering", solution: "Hint 'Chennai(20) to Delhi(21)' refers to FTP Ports 20/21. Filter for 'ftp' or 'tcp.port == 21'.", fragment: "FTP" },
            { name: "Flag Extraction", solution: "Follow TCP Stream on FTP packets. Flag is in the data stream: 'P64P_4N4L7S1S_SU55355FUL_4624A8B6'", fragment: "Flag" }
        ],
        tools: ["Wireshark", "Network Miner", "Packet Analysis"]
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
