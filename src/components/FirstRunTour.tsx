import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

interface FirstRunTourProps {
  open: boolean;
  onClose: () => void;
}

export function FirstRunTour({ open, onClose }: FirstRunTourProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Getting Started</DialogTitle>
        </DialogHeader>
        <ul className="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
          <li>Use the search box to quickly find items and traits.</li>
          <li>Click the trait checkboxes to mark research progress.</li>
          <li>Open the note icon to add notes and set research timers.</li>
        </ul>
        <DialogFooter>
          <Button onClick={onClose}>Got it!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
