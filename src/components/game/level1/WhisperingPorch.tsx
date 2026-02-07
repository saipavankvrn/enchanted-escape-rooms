import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, AlertTriangle, FileText, Globe, Search, ArrowRight, ShieldCheck, Bug, X, Eye } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { toast } from 'sonner';

interface Email {
    id: number;
    from: string;
    subject: string;
    body: string;
    time: string;
    isPhishing: boolean;
    read: boolean;
    attachment?: string;
    links?: { text: string; url: string; isMalicious: boolean }[];
}

const EMAILS: Email[] = [
    {
        id: 1,
        from: "support@amazon.com",
        subject: "Your order has shipped",
        body: "Hello, your package is on the way. Track it here.",
        time: "10:30 AM",
        isPhishing: false,
        read: false
    },
    {
        id: 2,
        from: "amazon@verify-acc.com", // Phishing
        subject: "Action Required: Verify Account",
        body: "We detected unusual activity. Please verify your account immediately.",
        time: "11:15 AM",
        isPhishing: true,
        read: false
    },
    {
        id: 3,
        from: "hr@company.com",
        subject: "Policy Update",
        body: "Please review the attached updated company policy.",
        time: "12:00 PM",
        isPhishing: false,
        read: false,
        links: [
            { text: "View Policy", url: "https://company.com/policy", isMalicious: false },
            { text: "Sign Acknowledgment", url: "http://company-hr-portal.net/login", isMalicious: true }, // Task 2 target
        ]
    },
    {
        id: 4,
        from: "newsletter@tech-weekly.com",
        subject: "This week in Tech",
        body: "Top stories: AI takes over...",
        time: "09:00 AM",
        isPhishing: false,
        read: false
    },
    {
        id: 5,
        from: "alerts@bank.com",
        subject: "Transaction Alert",
        body: "You spent $50.00 at Starbucks.",
        time: "08:45 AM",
        isPhishing: false,
        read: false
    }
];

const WhisperingPorch = () => {
    const { gameState, completeSubTask } = useGameState();
    const [view, setView] = useState<'inbox' | 'email'>('inbox');
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [scannerActive, setScannerActive] = useState(false);

    // Track byte collection
    const collectedBytes = gameState.subTasksCompleted[1] || [];
    const hasByte1 = collectedBytes.includes('byte_1'); // Sender
    const hasByte2 = collectedBytes.includes('byte_2'); // Link
    const hasByte3 = collectedBytes.includes('byte_3'); // Attachment

    // Task 1: Sender ID
    const handleFlagEmail = (email: Email) => {
        if (email.isPhishing) {
            if (!hasByte1) {
                toast.success("THREAT DETECTED: Malicious Sender Identified", {
                    description: "Byte 1/3 Recovered: 'LEVEL-'"
                });
                completeSubTask(1, 'byte_1');
            } else {
                toast.info("Already identified this threat.");
            }
        } else {
            toast.error("Incorrect. This sender seems legitimate.", {
                description: "Look for subtle domain misspellings or suspicious discrepancies."
            });
        }
    };

    // Task 2: Link ID
    const handleLinkClick = (isMalicious: boolean) => {
        if (isMalicious) {
            if (!hasByte2) {
                toast.success("THREAT DETECTED: Deceptive Link Found", {
                    description: "Byte 2/3 Recovered: '1-COM'"
                });
                completeSubTask(1, 'byte_2');
            }
        } else {
            toast.info("Link appears safe. Check the URL carefully.");
        }
    };

    // Task 3: Attachment Scanner
    const handleAttachmentScan = () => {
        if (!scannerActive) {
            setScannerActive(true);
            toast.info("Scanner Activated", { description: "Hover over attachments to reveal hidden extensions." });
        }
    };

    const handleMalwareClick = () => {
        if (scannerActive) {
            if (!hasByte3) {
                toast.success("THREAT DETECTED: Hidden Executable Found", {
                    description: "Byte 3/3 Recovered: 'PLETE'"
                });
                completeSubTask(1, 'byte_3');
            }
        } else {
            toast.warning("Cannot verify file type.", { description: "Use the scanner tool first." });
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-4 flex flex-col gap-6">

            {/* HUD / Receipt */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 border rounded-lg bg-black/40 flex items-center justify-between ${hasByte1 ? 'border-success text-success' : 'border-primary/30 text-muted-foreground'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${hasByte1 ? 'bg-success/20' : 'bg-muted/10'}`}>
                            {hasByte1 ? <ShieldCheck className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-mono uppercase tracking-widest">Byte 01</span>
                            <span className="font-bold">{hasByte1 ? "LEVEL-" : "???"}</span>
                        </div>
                    </div>
                </div>

                <div className={`p-4 border rounded-lg bg-black/40 flex items-center justify-between ${hasByte2 ? 'border-success text-success' : 'border-primary/30 text-muted-foreground'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${hasByte2 ? 'bg-success/20' : 'bg-muted/10'}`}>
                            {hasByte2 ? <Globe className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-mono uppercase tracking-widest">Byte 02</span>
                            <span className="font-bold">{hasByte2 ? "1-COM" : "???"}</span>
                        </div>
                    </div>
                </div>

                <div className={`p-4 border rounded-lg bg-black/40 flex items-center justify-between ${hasByte3 ? 'border-success text-success' : 'border-primary/30 text-muted-foreground'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${hasByte3 ? 'bg-success/20' : 'bg-muted/10'}`}>
                            {hasByte3 ? <Bug className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-mono uppercase tracking-widest">Byte 03</span>
                            <span className="font-bold">{hasByte3 ? "PLETE" : "???"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Interface: Fake Email Client */}
            <div className="border border-primary/30 rounded-xl overflow-hidden bg-slate-900 shadow-2xl min-h-[500px] flex flex-col">
                {/* Window Bar */}
                <div className="bg-slate-800 p-2 flex items-center gap-2 border-b border-white/5">
                    <div className="flex gap-1.5 ml-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    </div>
                    <div className="ml-4 text-xs text-slate-400 font-mono">SecureMail v4.2 // INBOX</div>
                </div>

                {view === 'inbox' ? (
                    <div className="flex-1 flex flex-col">
                        <div className="p-4 border-b border-white/5 bg-slate-800/50 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-primary">Inbox (5)</h3>
                            <Button variant="ghost" size="sm" className="text-xs" disabled>Syncing...</Button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {EMAILS.map((email) => (
                                <div
                                    key={email.id}
                                    className="group relative p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-4"
                                    onClick={() => {
                                        setSelectedEmail(email);
                                        setView('email');
                                    }}
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold shrink-0">
                                        {email.from.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-semibold text-slate-200 truncate pr-2 group-hover:text-primary transition-colors">
                                                {email.from}
                                            </span>
                                            <span className="text-xs text-slate-500 shrink-0">{email.time}</span>
                                        </div>
                                        <div className="text-sm font-medium text-slate-300 truncate">{email.subject}</div>
                                        <div className="text-xs text-slate-500 truncate">{email.body}</div>
                                    </div>

                                    {/* Task 1 Action: Flag (Only on Hover) */}
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-1/2 -translate-y-1/2 z-10"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleFlagEmail(email);
                                        }}
                                    >
                                        <AlertTriangle className="w-4 h-4 mr-1" />
                                        Report Phishing
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col bg-slate-900">
                        {/* Email Header */}
                        <div className="p-6 border-b border-white/5 bg-slate-800/30">
                            <Button variant="ghost" size="sm" className="mb-4 pl-0 hover:pl-2 transition-all" onClick={() => {
                                setView('inbox');
                                setScannerActive(false);
                            }}>
                                <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Back to Inbox
                            </Button>

                            <h2 className="text-2xl font-bold text-white mb-4">{selectedEmail?.subject}</h2>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-xl font-bold text-slate-300">
                                    {selectedEmail?.from.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-semibold text-primary text-lg">{selectedEmail?.from}</div>
                                    <div className="text-slate-400 text-sm">To: me@corp.net</div>
                                    <div className="text-slate-500 text-xs mt-1">{selectedEmail?.time}</div>
                                </div>
                            </div>
                        </div>

                        {/* Email Body */}
                        <div className="p-8 flex-1 overflow-y-auto">
                            <div className="prose prose-invert max-w-none text-slate-300">
                                <p className="mb-6">{selectedEmail?.body}</p>

                                {/* Task 2: Links */}
                                {selectedEmail?.links && (
                                    <div className="my-8 p-4 bg-slate-800/50 rounded border-l-4 border-primary">
                                        <h4 className="text-sm font-bold text-primary mb-2 uppercase tracking-wide">Action Items</h4>
                                        <ul className="space-y-3">
                                            {selectedEmail.links.map((link, idx) => (
                                                <li key={idx}>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs text-slate-500">Link {idx + 1}:</span>
                                                        <button
                                                            className="text-blue-400 hover:underline hover:text-blue-300 text-left font-medium w-fit"
                                                            title={link.url} // Browser tooltip
                                                            onClick={() => handleLinkClick(link.isMalicious)}
                                                        >
                                                            {link.text}
                                                        </button>
                                                        {/* Custom Tooltip Simulation for "Hover to inspect" */}
                                                        <div className="text-[10px] font-mono text-slate-600 bg-black/20 p-1 rounded w-fit mt-1 select-none">
                                                            Target: <span className="text-slate-500">{link.url}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <p className="mt-8 pt-8 border-t border-white/5 text-sm text-slate-500 italic">
                                    This email was scanned by Corporate Security. No threats detected.
                                </p>
                            </div>
                        </div>

                        {/* Attachments / Task 3 */}
                        {selectedEmail?.id === 3 && ( // Specific to the "Policy" email
                            <div className="p-4 bg-slate-800 border-t border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3 p-2 bg-slate-700/50 rounded border border-white/5 hover:bg-slate-700 transition cursor-help relative group"
                                        onMouseEnter={scannerActive ? undefined : undefined}
                                        onClick={() => scannerActive && handleMalwareClick()}
                                    >
                                        <FileText className="w-8 h-8 text-slate-400" />
                                        <div>
                                            {scannerActive ? (
                                                // Reveal extension if scanner active
                                                <div className="font-mono font-bold text-red-400 animate-pulse">report.pdf.exe</div>
                                            ) : (
                                                <div className="font-medium text-slate-200">report.pdf</div>
                                            )}
                                            <div className="text-xs text-slate-500">2.4 MB</div>
                                        </div>
                                        {/* Glitch overlay if malicious and scanner active */}
                                        {scannerActive && (
                                            <div className="absolute inset-0 bg-red-500/10 animate-pulse rounded pointer-events-none" />
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500 uppercase tracking-wider">Security Tools:</span>
                                    <Button
                                        variant={scannerActive ? "default" : "outline"}
                                        size="sm"
                                        onClick={handleAttachmentScan}
                                        className={scannerActive ? "bg-primary text-black hover:bg-primary/90" : "border-primary/50 text-primary hover:bg-primary/10"}
                                    >
                                        {scannerActive ? <Eye className="w-4 h-4 mr-2" /> : <Search className="w-4 h-4 mr-2" />}
                                        {scannerActive ? "Scanner Active" : "Activate Scanner"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
};

export default WhisperingPorch;
