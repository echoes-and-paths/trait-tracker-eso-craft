
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Keyboard } from 'lucide-react';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isOpen, onClose]);

  const shortcuts = [
    { key: 'Ctrl + K', description: 'Focus search bar' },
    { key: 'Ctrl + A', description: 'Select all visible items' },
    { key: 'Ctrl + D', description: 'Deselect all items' },
    { key: 'Ctrl + S', description: 'Save/Export data' },
    { key: 'Ctrl + R', description: 'Reset current section' },
    { key: 'Space', description: 'Toggle selected item trait' },
    { key: 'N', description: 'Add note to selected item' },
    { key: 'B', description: 'Toggle bank status' },
    { key: 'T', description: 'Set research timer' },
    { key: '?', description: 'Show keyboard shortcuts' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{shortcut.description}</span>
              <Badge variant="outline" className="font-mono text-xs">
                {shortcut.key}
              </Badge>
            </div>
          ))}
        </div>
        <div className="text-xs text-muted-foreground mt-4 pt-4 border-t">
          Press <Badge variant="outline" className="font-mono">Escape</Badge> to close this dialog
        </div>
      </DialogContent>
    </Dialog>
  );
}
