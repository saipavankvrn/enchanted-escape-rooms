import { useState, useEffect } from 'react';
import { Mail, CheckCircle2, AlertTriangle, FileText, Globe, Move, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useGameState } from '@/hooks/useGameState';
import { useAuth } from '@/hooks/useAuth';
import { getLevel1Emails, Email } from './Level1Data';

const WhisperingPorch = () => {
    const { user } = useAuth();
    const { completeSubTask, gameState } = useGameState();
    const [initialEmails] = useState<Email[]>(getLevel1Emails());

    // State for the three buckets
    const [inbox, setInbox] = useState<Email[]>(initialEmails);
    const [safeBox, setSafeBox] = useState<Email[]>([]);
    const [phishingBox, setPhishingBox] = useState<Email[]>([]);

    useEffect(() => {
        if (user) {
            const sInbox = localStorage.getItem(`user_${user.id}_level1_inbox`);
            const sSafe = localStorage.getItem(`user_${user.id}_level1_safebox`);
            const sPhish = localStorage.getItem(`user_${user.id}_level1_phishingbox`);

            if (sInbox) setInbox(JSON.parse(sInbox));
            if (sSafe) setSafeBox(JSON.parse(sSafe));
            if (sPhish) setPhishingBox(JSON.parse(sPhish));
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            localStorage.setItem(`user_${user.id}_level1_inbox`, JSON.stringify(inbox));
            localStorage.setItem(`user_${user.id}_level1_safebox`, JSON.stringify(safeBox));
            localStorage.setItem(`user_${user.id}_level1_phishingbox`, JSON.stringify(phishingBox));
        }
    }, [inbox, safeBox, phishingBox, user]);

    const [draggedEmail, setDraggedEmail] = useState<Email | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    const collectedBytes = gameState.subTasksCompleted[1] || [];
    const hasKey = collectedBytes.includes('byte_1');

    const handleDragStart = (e: React.DragEvent, email: Email) => {
        setDraggedEmail(email);
        e.dataTransfer.setData('text/plain', email.id.toString());
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const moveToBox = (targetBox: 'inbox' | 'safe' | 'phishing', email: Email) => {
        // Remove from all boxes first
        setInbox(prev => prev.filter(e => e.id !== email.id));
        setSafeBox(prev => prev.filter(e => e.id !== email.id));
        setPhishingBox(prev => prev.filter(e => e.id !== email.id));

        // Add to target
        if (targetBox === 'inbox') setInbox(prev => [...prev, email]);
        if (targetBox === 'safe') setSafeBox(prev => [...prev, email]);
        if (targetBox === 'phishing') setPhishingBox(prev => [...prev, email]);
    };

    const handleDrop = (e: React.DragEvent, targetBox: 'inbox' | 'safe' | 'phishing') => {
        e.preventDefault();
        if (draggedEmail) {
            moveToBox(targetBox, draggedEmail);
            setDraggedEmail(null);
        }
    };

    const handleCheck = async () => {
        if (inbox.length > 0) {
            toast.error("Incomplete Task", { description: "Please classify all emails before checking." });
            return;
        }

        setIsChecking(true);

        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        let mistakes = 0;

        // Check Safe Box (Should NOT have malware)
        safeBox.forEach(e => {
            if (e.isMalware) mistakes++;
        });

        // Check Phishing Box (Should HAVE malware)
        phishingBox.forEach(e => {
            if (!e.isMalware) mistakes++;
        });

        if (mistakes === 0) {
            if (!hasKey) {
                toast.success("THREAT ANALYSIS SUCCESSFUL", {
                    description: "All emails correctly classified. System Key Generated.",
                    duration: 5000
                });
                completeSubTask(1, 'byte_1');
            } else {
                toast.success("Analysis Verified: Perfect Classification.");
            }
        } else {
            toast.error("Classification Failed", {
                description: `${mistakes} email(s) are incorrectly placed. Review your choices.`
            });
        }
        setIsChecking(false);
    };

    const handleReset = () => {
        setInbox(initialEmails);
        setSafeBox([]);
        setPhishingBox([]);
        toast.info("Inbox Reset");
    };

    // Render an Email Card
    const EmailCard = ({ email }: { email: Email }) => (
        <div
            draggable
            onDragStart={(e) => handleDragStart(e, email)}
            className="bg-slate-800 p-3 rounded-lg border border-slate-700 cursor-grab active:cursor-grabbing hover:border-primary/50 hover:bg-slate-750 transition-all shadow-sm group relative"
        >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Move className="w-4 h-4 text-slate-500" />
            </div>
            <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${email.isMalware ? 'bg-red-900/20 text-red-400' : 'bg-blue-900/20 text-blue-400'}`}>
                    {email.sender[0]}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-200 truncate">{email.sender.split('<')[0]}</div>
                    <div className="text-[10px] text-slate-500 truncate">{email.sender.match(/<(.+)>/)?.[1]}</div>
                </div>
            </div>
            <div className="text-sm font-medium text-slate-100 mb-1 truncate">{email.subject}</div>
            <p className="text-xs text-slate-400 line-clamp-2 mb-2">{email.content}</p>

            <div className="flex gap-2">
                {email.hasAttachment && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-700 rounded text-slate-300 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> {email.attachmentName?.split('.').pop()}
                    </span>
                )}
                {email.hasLink && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-indigo-900/30 text-indigo-300 rounded flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Link
                    </span>
                )}
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col gap-4 max-w-6xl mx-auto p-2">

            {/* Header / HUD */}
            <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800 backdrop-blur">
                <div>
                    <h2 className="text-xl font-display font-bold text-white">Threat Triage Protocol</h2>
                    <p className="text-sm text-slate-400">Classify all emails. Drag to the correct folder.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${hasKey ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                        {hasKey ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                        <span className="font-mono font-bold">{hasKey ? "KEY: LEVEL-1-COMPLETE" : "CLASSIFICATION PENDING"}</span>
                    </div>
                </div>
            </div>

            {/* Inbox Area (Source) */}
            <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'inbox')}
                className="bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-xl p-4 min-h-[160px] flex flex-col transition-colors hover:bg-slate-900/80 hover:border-slate-600"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Incoming Stream ({inbox.length})
                    </h3>
                    {inbox.length === 0 && <span className="text-xs text-green-500 font-mono">ALL ITEMS PROCESSED</span>}
                    <Button variant="ghost" size="sm" onClick={handleReset} className="h-6 text-xs text-slate-500 hover:text-white">
                        <RefreshCw className="w-3 h-3 mr-1" /> Reset
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {inbox.map(email => <EmailCard key={email.id} email={email} />)}
                </div>
                {inbox.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-slate-600 text-sm italic">
                        No pending emails.
                    </div>
                )}
            </div>

            {/* Drop Zones Container */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">

                {/* Legitimate Zone */}
                <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'safe')}
                    className={`rounded-xl border-2 p-4 flex flex-col transition-all ${isChecking ? 'opacity-50' : ''} bg-emerald-950/10 border-emerald-900/30 hover:bg-emerald-950/20 hover:border-emerald-500/50`}
                >
                    <h3 className="text-emerald-400 font-bold uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-emerald-900/30 pb-2">
                        <CheckCircle2 className="w-5 h-5" /> Legitimate / Safe ({safeBox.length})
                    </h3>
                    <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px] custom-scrollbar p-1">
                        {safeBox.map(email => <EmailCard key={email.id} email={email} />)}
                        {safeBox.length === 0 && (
                            <div className="h-32 flex items-center justify-center text-emerald-900/40 text-sm font-bold border-2 border-dashed border-emerald-900/20 rounded-lg">
                                DROP SAFE EMAILS HERE
                            </div>
                        )}
                    </div>
                </div>

                {/* Phishing Zone */}
                <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'phishing')}
                    className={`rounded-xl border-2 p-4 flex flex-col transition-all ${isChecking ? 'opacity-50' : ''} bg-red-950/10 border-red-900/30 hover:bg-red-950/20 hover:border-red-500/50`}
                >
                    <h3 className="text-red-400 font-bold uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-red-900/30 pb-2">
                        <AlertTriangle className="w-5 h-5" /> Phishing / Malicious ({phishingBox.length})
                    </h3>
                    <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px] custom-scrollbar p-1">
                        {phishingBox.map(email => <EmailCard key={email.id} email={email} />)}
                        {phishingBox.length === 0 && (
                            <div className="h-32 flex items-center justify-center text-red-900/40 text-sm font-bold border-2 border-dashed border-red-900/20 rounded-lg">
                                DROP THREATS HERE
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Footer Action */}
            <div className="flex justify-center p-4">
                <Button
                    size="lg"
                    className={`w-full max-w-md font-bold text-lg tracking-widest shadow-2xl ${hasKey ? 'bg-green-600 hover:bg-green-700' : ''}`}
                    onClick={handleCheck}
                    disabled={isChecking || hasKey}
                >
                    {isChecking ? "ANALYZING CLASSIFICATION..." : hasKey ? "ACCESS GRANTED" : "SUBMIT CLASSIFICATION"}
                </Button>
            </div>

        </div>
    );
};

export default WhisperingPorch;
