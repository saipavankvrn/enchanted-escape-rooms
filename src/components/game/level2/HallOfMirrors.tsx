import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User, MapPin, Camera, Video, AlertTriangle } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { toast } from 'sonner';

const HallOfMirrors = () => {
    const { gameState, completeSubTask } = useGameState();
    const [activeTab, setActiveTab] = useState<'timeline' | 'metadata' | 'deepfake'>('timeline');

    // Track gathered shards (bytes)
    const collectedBytes = gameState.subTasksCompleted[2] || [];
    const hasByte1 = collectedBytes.includes('byte_1'); // Timeline
    const hasByte2 = collectedBytes.includes('byte_2'); // Metadata
    const hasByte3 = collectedBytes.includes('byte_3'); // Deepfake

    // --- Task 1: Timeline Data ---
    const BIO = {
        name: "Sarah Jenkins",
        role: "Journalist",
        location: "Paris, France",
        date: "October 15, 2025"
    };

    const POSTS = [
        { id: 1, text: "Just arrived in Lyon! Beautiful city.", date: "Oct 12, 2025", location: "Lyon, France", correct: true },
        { id: 2, text: "Meeting my source at the Eiffel Tower.", date: "Oct 15, 2025", location: "Berlin, Germany", correct: false }, // Contradiction: Says Eiffel (Paris) but tagged Berlin
        { id: 3, text: "Heading home now.", date: "Oct 20, 2025", location: "Paris, France", correct: true }
    ];

    const handleTimelineCheck = (post: typeof POSTS[0]) => {
        if (!post.correct) {
            if (!hasByte1) {
                toast.success("INCONSISTENCY FOUND: Location Mismatch", { description: "Shard 1/3 Recovered: 'SH'" });
                completeSubTask(2, 'byte_1');
            } else {
                toast.info("You've already flagged this inconsistency.");
            }
        } else {
            toast.error("This post seems consistent with the timeline.");
        }
    };

    // --- Task 2: Metadata Data ---
    const [lensActive, setLensActive] = useState(false);
    // In a real app we'd use a real image. Here we use a colored div.

    const handleMetadataScan = () => {
        if (lensActive) {
            if (!hasByte2) {
                toast.success("METADATA EXTRACTED: Hidden Geotag Found", { description: "Shard 2/3 Recovered: 'AD'" });
                completeSubTask(2, 'byte_2');
            }
        }
    };

    // --- Task 3: Deepfake Data ---
    const VIDEOS = [
        { id: 1, name: "interview_clip_01.mp4", synced: true },
        { id: 2, name: "interview_clip_02.mp4", synced: true },
        { id: 3, name: "interview_clip_03.mp4", synced: false }, // The deepfake
    ];

    const handleDeepfakeIdent = (video: typeof VIDEOS[0]) => {
        if (!video.synced) {
            if (!hasByte3) {
                toast.success("DEEPFAKE DETECTED: Audio Sync Mismatch", { description: "Shard 3/3 Recovered: 'OW'" });
                completeSubTask(2, 'byte_3');
            }
        } else {
            toast.error("This clip appears authentic. Lips match audio.");
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-6">
            {/* Shard Tracker */}
            <div className="flex justify-center gap-4 mb-4">
                <div className={`px-4 py-2 rounded border ${hasByte1 ? 'bg-purple-900/50 border-purple-500 text-purple-200' : 'bg-black/40 border-slate-700 text-slate-500'}`}>
                    Shard 1: {hasByte1 ? "SH" : "???"}
                </div>
                <div className={`px-4 py-2 rounded border ${hasByte2 ? 'bg-purple-900/50 border-purple-500 text-purple-200' : 'bg-black/40 border-slate-700 text-slate-500'}`}>
                    Shard 2: {hasByte2 ? "AD" : "???"}
                </div>
                <div className={`px-4 py-2 rounded border ${hasByte3 ? 'bg-purple-900/50 border-purple-500 text-purple-200' : 'bg-black/40 border-slate-700 text-slate-500'}`}>
                    Shard 3: {hasByte3 ? "OW" : "???"}
                </div>
            </div>
            {/* Let's fix the UI Text for shards to match "SHADOW" */}


            {/* Tabs */}
            <div className="flex gap-2 border-b border-primary/20 bg-slate-900/50 p-1 rounded-t-lg">
                <Button
                    variant={activeTab === 'timeline' ? "neon" : "ghost"}
                    onClick={() => setActiveTab('timeline')}
                    className="flex-1"
                >
                    <User className="w-4 h-4 mr-2" /> Timeline Analysis
                </Button>
                <Button
                    variant={activeTab === 'metadata' ? "neon" : "ghost"}
                    onClick={() => setActiveTab('metadata')}
                    className="flex-1"
                >
                    <Camera className="w-4 h-4 mr-2" /> Metadata Lens
                </Button>
                <Button
                    variant={activeTab === 'deepfake' ? "neon" : "ghost"}
                    onClick={() => setActiveTab('deepfake')}
                    className="flex-1"
                >
                    <Video className="w-4 h-4 mr-2" /> Deepfake Detection
                </Button>
            </div>

            <div className="bg-slate-900 border border-primary/20 border-t-0 p-6 rounded-b-lg min-h-[400px]">

                {/* TASK 1: TIMELINE */}
                {activeTab === 'timeline' && (
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/3 bg-slate-800 p-4 rounded-lg h-fit">
                            <h3 className="text-primary font-bold mb-4 uppercase tracking-wider text-xs">Target Profile</h3>
                            <div className="flex flex-col gap-2 text-sm text-slate-300">
                                <p><span className="text-slate-500">Name:</span> {BIO.name}</p>
                                <p><span className="text-slate-500">Occupation:</span> {BIO.role}</p>
                                <p><span className="text-slate-500">Current Location:</span> {BIO.location}</p>
                                <p><span className="text-slate-500">Date:</span> {BIO.date}</p>
                            </div>
                        </div>
                        <div className="w-full md:w-2/3 space-y-4">
                            <h3 className="text-primary font-bold mb-2 uppercase tracking-wider text-xs">Social Grid</h3>
                            {POSTS.map(post => (
                                <div key={post.id} className="bg-slate-800 p-4 rounded-lg border border-white/5 flex justify-between items-start group hover:border-primary/50 transition-colors">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-white">@sarah_j</span>
                                            <span className="text-xs text-slate-500">{post.date}</span>
                                        </div>
                                        <p className="text-slate-300 text-sm mb-2">"{post.text}"</p>
                                        <div className="flex items-center gap-1 text-xs text-primary/70">
                                            <MapPin className="w-3 h-3" /> {post.location}
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleTimelineCheck(post)}
                                    >
                                        Flag Contradiction
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TASK 2: METADATA */}
                {activeTab === 'metadata' && (
                    <div className="flex flex-col items-center">
                        <div className="mb-4 text-center">
                            <h3 className="text-xl font-bold text-white mb-2">Evidence Image #8942</h3>
                            <p className="text-slate-400 text-sm">Target claims to be in a secure bunker. Metadata might reveal the truth.</p>
                        </div>

                        <div className="relative w-full max-w-lg aspect-video bg-slate-800 rounded-lg overflow-hidden border-2 border-slate-700 group cursor-crosshair"
                            onMouseEnter={() => setLensActive(true)}
                            onMouseLeave={() => setLensActive(false)}
                            onClick={handleMetadataScan}
                        >
                            {/* Fake Image Content (CSS Pattern) */}
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,#1e293b_25%,#0f172a_25%,#0f172a_50%,#1e293b_50%,#1e293b_75%,#0f172a_75%,#0f172a_100%)] bg-[size:20px_20px] opacity-20" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-6xl opacity-10 font-black">IMAGE</div>
                            </div>

                            {/* Lens Effect */}
                            {lensActive && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-24 bg-primary/10 backdrop-blur-sm border border-primary rounded-lg flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.3)] pointer-events-none">
                                    <div className="text-xs font-mono text-primary text-center">
                                        <p className="font-bold">EXIF DATA FOUND</p>
                                        <p>GPS: 40.7128° N, 74.0060° W</p>
                                        <p>DEVICE: iPhone 15 Pro</p>
                                    </div>
                                </div>
                            )}

                            <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1 rounded text-xs text-white">
                                Hover to Scan
                            </div>
                        </div>
                    </div>
                )}

                {/* TASK 3: DEEPFAKE */}
                {activeTab === 'deepfake' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {VIDEOS.map(video => (
                            <div key={video.id} className="flex flex-col gap-3">
                                <div className="aspect-square bg-slate-800 rounded-lg border border-white/5 relative overflow-hidden group">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {/* Simulated Face */}
                                        <div className="w-24 h-32 bg-slate-600 rounded-full relative">
                                            <div className="absolute top-10 left-6 w-3 h-3 bg-black/50 rounded-full" /> {/* Eye */}
                                            <div className="absolute top-10 right-6 w-3 h-3 bg-black/50 rounded-full" /> {/* Eye */}

                                            {/* Mouth Animation */}
                                            <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/70 rounded-full transition-all duration-100 ${video.synced ? 'animate-[pulse_0.2s_ease-in-out_infinite]' : 'animate-[pulse_1.5s_ease-in-out_infinite]'}`} />
                                        </div>
                                    </div>

                                    {/* Audio Wave Visualization (Simulated) */}
                                    <div className="absolute bottom-4 left-4 right-4 h-8 flex items-end justify-center gap-1 opacity-50">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="w-1 bg-primary animate-[bounce_0.5s_infinite]" style={{ animationDelay: `${i * 0.1}s` }} />
                                        ))}
                                    </div>

                                    <Button
                                        variant="destructive"
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleDeepfakeIdent(video)}
                                    >
                                        Report Fake
                                    </Button>
                                </div>
                                <div className="text-center">
                                    <h4 className="text-sm font-semibold text-white">{video.name}</h4>
                                    <p className="text-xs text-slate-500">{video.synced ? "Sync: 99.8%" : "Sync: 45.2%"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HallOfMirrors;
