import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AddUserModalProps {
    onUserAdded: () => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ onUserAdded }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const API_URL = `http://${window.location.hostname}:5000/api/admin/players/create`;

            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(`User '${username}' created successfully!`);
                setIsOpen(false);
                setUsername('');
                setEmail('');
                setPassword('');
                onUserAdded();
            } else {
                toast.error(data.error || 'Failed to create user');
            }
        } catch (error) {
            console.error('Create user error:', error);
            toast.error('Network error. Check console.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/80">
                    <UserPlus className="w-4 h-4 mr-2" /> Add Team
                </Button>
            </DialogTrigger>
            <DialogContent className="glass-panel border-primary/20 bg-[#0A0A0F]/95 text-foreground">
                <DialogHeader>
                    <DialogTitle className="neon-text-purple text-xl">Register New Team</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Team Name</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors"
                            placeholder="Awesome Hackers"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors"
                            placeholder="team@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="neon"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Team'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
