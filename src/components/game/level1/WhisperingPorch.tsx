import { useState } from 'react';
import { Mail, Shield, AlertTriangle, FileText, Globe, MousePointer2, Archive, Trash2, Reply, Search, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useGameState } from '@/hooks/useGameState';
import { getLevel1Emails, Email } from './Level1Data';

const WhisperingPorch = () => {
    const { gameState, completeSubTask } = useGameState();
    const [emails] = useState<Email[]>(getLevel1Emails());
    const [selectedEmailId, setSelectedEmailId] = useState<number | null>(null);
    const [analyzingIds, setAnalyzingIds] = useState<number[]>([]);

    // Single task completion check
    const collectedBytes = gameState.subTasksCompleted[1] || [];
    const hasKey = collectedBytes.includes('byte_1');

    const selectedEmail = emails.find(e => e.id === selectedEmailId);

    const handleFlagSender = (email: Email) => {
        if (email.isPhishing) {
            toast.success("Suspicious sender flagged.", { description: "Good eye, but is this the critical threat?" });
        } else {
            toast.info("Sender flagged for review.");
        }
    };

    const handleAnalyzeEmail = async (email: Email) => {
        if (analyzingIds.includes(email.id)) return;

        setAnalyzingIds(prev => [...prev, email.id]);
        toast.info("Initiating Deep Scan analysis...", { duration: 2000 });

        // Simulate analysis delay
        await new Promise(resolve => setTimeout(resolve, 3000));

        if (email.isMalware) {
            if (!hasKey) {
                toast.success("CRITICAL THREAT DETECTED: Ransomware Payload Identified!", {
                    description: "Threat neutralized. System Key Generated: 'LEVEL-1-COMPLETE'",
                    duration: 5000
                });
                completeSubTask(1, 'byte_1');
            } else {
                toast.info("Threat already neutralized.");
            }
        } else {
            toast.success("Analysis Complete: No active threats found.", { description: "This email appears safe." });
        }

        setAnalyzingIds(prev => prev.filter(id => id !== email.id));
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 flex flex-col gap-6 h-[85vh]">
            {/* Progress HUD */}
            <div className="flex justify-center gap-4 mb-2 shrink-0">
                <div className={`px-4 py-2 rounded border transition-colors ${hasKey ? 'bg-green-900/50 border-green-500 text-green-200' : 'bg-black/40 border-slate-700 text-slate-500'}`}>
                    <span className="text-xs uppercase font-bold block">Threat Status</span>
                    <div className="flex items-center gap-2">
                        {hasKey ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />}
                        <span>{hasKey ? "NEUTRALIZED" : "ACTIVE THREAT DETECTED"}</span>
                    </div>
                </div>

                {hasKey && (
                    <div className="px-4 py-2 rounded border bg-yellow-500/20 border-yellow-500 text-yellow-200 animate-pulse">
                        <span className="text-xs uppercase font-bold block">Mission Complete</span>
                        <span>KEY: LEVEL-1-COMPLETE</span>
                    </div>
                )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-1 shadow-2xl relative">
                {/* Sidebar */}
                <div className="w-20 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-6 gap-6 shrink-0 z-20">
                    <Button
                        variant="default"
                        size="icon"
                        title="Secure Inbox"
                        className="w-12 h-12 rounded-xl bg-primary"
                    >
                        <Mail className="w-6 h-6" />
                    </Button>

                    <div className="mt-auto flex flex-col gap-4">
                        <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl opacity-50 cursor-not-allowed">
                            <Archive className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl opacity-50 cursor-not-allowed">
                            <Trash2 className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex overflow-hidden relative z-10">
                    {/* Email List */}
                    <div className="w-[400px] border-r border-slate-800 bg-slate-900/50 flex flex-col">
                        <div className="p-4 border-b border-slate-800 bg-slate-900/80 sticky top-0 z-10 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-display font-bold text-white tracking-wider">INBOX ({emails.length})</h2>
                                <span className="text-xs text-slate-500 uppercase font-mono">Secure Connection</span>
                            </div>
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search emails..."
                                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-300 focus:outline-none focus:border-primary/50 transition-colors"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {emails.map(email => (
                                <div
                                    key={email.id}
                                    onClick={() => setSelectedEmailId(email.id)}
                                    className={`p-4 border-b border-slate-800/50 cursor-pointer hover:bg-slate-800/80 transition-all group ${selectedEmailId === email.id ? 'bg-slate-800 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <div className={`font-bold text-sm truncate pr-2 ${selectedEmailId === email.id ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                                            {email.sender.split('<')[0].replace(/"/g, '')}
                                        </div>
                                        {email.hasAttachment && <FileText className="w-3 h-3 text-slate-500 mt-1 shrink-0" />}
                                    </div>
                                    <div className={`text-xs mb-1 truncate font-medium ${!email.read ? 'text-white' : 'text-slate-400'}`}>{email.subject}</div>
                                    <div className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{email.content}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Email Viewer */}
                    <div className="flex-1 bg-slate-950/30 flex flex-col relative overflow-hidden">
                        {selectedEmail ? (
                            <div className="flex flex-col h-full animate-in fade-in duration-300">
                                {/* Viewer Header */}
                                <div className="border-b border-slate-800 p-6 glass-panel shrink-0 bg-slate-900/50">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex-1 mr-4 overflow-hidden">
                                            <h3 className="text-xl font-bold text-white mb-2 leading-snug">{selectedEmail.subject}</h3>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-900/30 border border-indigo-500/30 flex items-center justify-center text-lg font-bold shrink-0 text-indigo-400">
                                                    {selectedEmail.sender.charAt(0)}
                                                </div>
                                                <div className="overflow-hidden min-w-0">
                                                    <div className="text-sm font-bold text-slate-200 truncate">
                                                        {selectedEmail.sender.split('<')[0].replace(/"/g, '')}
                                                    </div>
                                                    <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                                                        <span className="truncate">{selectedEmail.sender.match(/<(.+)>/)?.[1] || selectedEmail.sender}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-9 px-4 uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-950 border border-red-900/30 hover:border-red-500/50 transition-all font-bold"
                                                onClick={() => handleFlagSender(selectedEmail)}
                                            >
                                                <AlertTriangle className="w-4 h-4 mr-2" />
                                                Report
                                            </Button>
                                            <Button
                                                variant={hasKey ? "outline" : "destructive"}
                                                size="sm"
                                                className={`gap-2 font-bold tracking-wide shadow-lg ${analyzingIds.includes(selectedEmail.id) ? 'opacity-80' : ''}`}
                                                onClick={() => handleAnalyzeEmail(selectedEmail)}
                                                disabled={analyzingIds.includes(selectedEmail.id)}
                                            >
                                                {analyzingIds.includes(selectedEmail.id) ? (
                                                    <>
                                                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                        ANALYZING...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Shield className="w-4 h-4" />
                                                        ANALYZE THREAT
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Quick Actions Bar */}
                                    <div className="flex items-center gap-4 pt-2 border-t border-slate-800/50">
                                        <div className="text-xs text-slate-500 font-mono">ID: {selectedEmail.sysId}</div>
                                        <div className="h-4 w-px bg-slate-800" />
                                        <div className="text-xs text-slate-500">{new Date(selectedEmail.timestamp).toLocaleString()}</div>
                                    </div>
                                </div>

                                {/* Viewer Body */}
                                <div className="flex-1 overflow-y-auto p-8 text-slate-300 text-sm whitespace-pre-wrap leading-relaxed max-w-4xl mx-auto w-full">
                                    {selectedEmail.content}

                                    {selectedEmail.hasLink && (
                                        <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-indigo-500/20 hover:border-indigo-500/50 transition-colors group">
                                            <div className="text-xs text-indigo-400 uppercase mb-2 flex items-center gap-2 font-bold tracking-wider">
                                                <Globe className="w-3 h-3" /> External Link
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-950/50 rounded text-indigo-300">
                                                    <Globe className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-mono text-blue-400 truncate">{selectedEmail.linkUrl}</div>
                                                    <div className="text-xs text-slate-500 mt-1">Status: Unverified Destination</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedEmail.hasAttachment && (
                                        <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-500/50 transition-colors">
                                            <div className="text-xs text-slate-500 uppercase mb-3 flex items-center gap-2 font-bold tracking-wider">
                                                <FileText className="w-3 h-3" /> Attachment
                                            </div>
                                            <div className="flex items-center justify-between bg-black/20 p-3 rounded border border-slate-800">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-red-900/20 text-red-500 flex items-center justify-center rounded uppercase text-xs font-bold px-1 border border-red-500/20">
                                                        {selectedEmail.attachmentName?.split('.').pop()?.substring(0, 3)}
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-mono text-slate-200 block">{selectedEmail.attachmentName}</span>
                                                        <span className="text-xs text-slate-500">{(Math.random() * 2 + 0.5).toFixed(1)} MB</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-500 bg-slate-950/20">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800">
                                        <Mail className="w-10 h-10 opacity-20" />
                                    </div>
                                    <h3 className="text-xl font-medium text-slate-400 mb-2">Select an email to inspect</h3>
                                    <p className="text-sm text-slate-600 max-w-xs mx-auto">
                                        Review communications carefully. Identify potential security threats to generate the system key.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhisperingPorch;
