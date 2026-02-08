import { useState } from 'react';
import { Key, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SecretKeyInputProps {
  onSubmit: (key: string) => void;
  isLoading?: boolean;
}

const SecretKeyInput = ({ onSubmit, isLoading }: SecretKeyInputProps) => {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onSubmit(key.trim());
      setKey('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Enter the secret key..."
          value={key}
          onChange={(e) => setKey(e.target.value.toUpperCase())}
          className="pl-10 font-display tracking-wider uppercase"
          maxLength={100}
        />
      </div>
      <Button type="submit" variant="neon" disabled={!key.trim() || isLoading}>
        <Unlock className="w-4 h-4 mr-2" />
        Unlock
      </Button>
    </form>
  );
};

export default SecretKeyInput;
