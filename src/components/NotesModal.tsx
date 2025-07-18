import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ScrollText, Save, X } from 'lucide-react';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  sectionName: string;
  initialNote: string;
  onSave: (note: string) => void;
}

export function NotesModal({
  isOpen,
  onClose,
  itemName,
  sectionName,
  initialNote,
  onSave
}: NotesModalProps) {
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    setNote(initialNote);
  }, [initialNote, isOpen]);

  const handleSave = () => {
    onSave(note);
    onClose();
  };

  const handleCancel = () => {
    setNote(initialNote);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-primary" />
            Notes: {itemName}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {sectionName}
          </p>
        </DialogHeader>
        
        <div className="space-y-4">
          <Textarea
            placeholder="Add your research notes here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={6}
            className="resize-none"
          />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Notes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}