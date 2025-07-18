import React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Sun, Moon, RotateCcw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface ControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onResetProgress: () => void;
}

export function Controls({
  searchQuery,
  onSearchChange,
  theme,
  onThemeToggle,
  onResetProgress
}: ControlsProps) {
  const [showResetDialog, setShowResetDialog] = React.useState(false);
  const { toast } = useToast();

  const handleResetProgress = () => {
    onResetProgress();
    setShowResetDialog(false);
    toast({
      title: "Progress Reset",
      description: "All research progress has been cleared for this profile.",
      variant: "destructive"
    });
  };

  return (
    <div className="eso-card p-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search items or traits..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onThemeToggle}
            className="transition-all duration-200"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reset Research Progress</DialogTitle>
              </DialogHeader>
              <p className="text-muted-foreground">
                Are you sure you want to reset all research progress for the current profile? 
                This action cannot be undone and will clear all completed trait research.
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowResetDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleResetProgress}>
                  Reset Progress
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}