import React, { useState, useEffect } from 'react';
import { CraftingSubsection } from '../data/craftingData';
import { TraitProgress, ItemNote, ItemBankStatus, ResearchTimer, ProgressStats } from '../types';
import { Check, FileText, Vault, Timer, X, Package } from 'lucide-react';
import { NotesModal } from './NotesModal';
import { ProgressBar } from './ProgressBar';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface SubsectionTableProps {
  subsection: CraftingSubsection;
  sectionKey: string;
  subsectionName: string;
  progress: TraitProgress[];
  notes: ItemNote[];
  bankStatus: ItemBankStatus[];
  timers: ResearchTimer[];
  searchQuery: string;
  onProgressChange: (section: string, item: string, trait: string, completed: boolean) => void;
  onNoteChange: (section: string, item: string, note: string) => void;
  onBankStatusChange: (section: string, item: string, inBank: boolean) => void;
  onTimerSet: (section: string, item: string, trait: string, hours: number) => void;
  onTimerRemove: (section: string, item: string, trait: string) => void;
}

export function SubsectionTable({
  subsection,
  sectionKey,
  subsectionName,
  progress,
  notes,
  bankStatus,
  timers,
  searchQuery,
  onProgressChange,
  onNoteChange,
  onBankStatusChange,
  onTimerSet,
  onTimerRemove
}: SubsectionTableProps) {
  const [notesModal, setNotesModal] = useState<{
    isOpen: boolean;
    item: string;
    currentNote: string;
  }>({
    isOpen: false,
    item: '',
    currentNote: ''
  });

  const [timerModal, setTimerModal] = useState<{
    isOpen: boolean;
    item: string;
    trait: string;
    hours: number;
  }>({
    isOpen: false,
    item: '',
    trait: '',
    hours: 6
  });

  const [timeLeft, setTimeLeft] = useState<{[key: string]: string}>({});

  // Update countdown timers
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newTimeLeft: {[key: string]: string} = {};
      
      timers.forEach(timer => {
        const key = `${timer.item}-${timer.trait}`;
        const remaining = timer.endTime.getTime() - now.getTime();
        
        if (remaining > 0) {
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
          newTimeLeft[key] = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          newTimeLeft[key] = 'Complete!';
        }
      });
      
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [timers]);

  // Filter traits and items based on search query
  const filteredTraits = subsection.traits.filter(trait =>
    trait.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredItems = subsection.items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subsection.traits.some(trait =>
      trait.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const isTraitCompleted = (itemName: string, trait: string): boolean => {
    return progress.some(p => 
      p.section === `${sectionKey}-${subsectionName}` && 
      p.item === itemName && 
      p.trait === trait && 
      p.completed
    );
  };

  const getItemNote = (itemName: string): string => {
    const note = notes.find(n => 
      n.section === `${sectionKey}-${subsectionName}` && 
      n.item === itemName
    );
    return note?.note || '';
  };

  const isItemInBank = (itemName: string): boolean => {
    return bankStatus.some(status =>
      status.section === `${sectionKey}-${subsectionName}` &&
      status.item === itemName &&
      status.inBank
    );
  };

  const getTimerForTrait = (itemName: string, trait: string): ResearchTimer | undefined => {
    return timers.find(timer =>
      timer.section === `${sectionKey}-${subsectionName}` &&
      timer.item === itemName &&
      timer.trait === trait
    );
  };

  const handleTraitToggle = (itemName: string, trait: string) => {
    const currentlyCompleted = isTraitCompleted(itemName, trait);
    onProgressChange(`${sectionKey}-${subsectionName}`, itemName, trait, !currentlyCompleted);
  };

  const handleNotesClick = (itemName: string) => {
    setNotesModal({
      isOpen: true,
      item: itemName,
      currentNote: getItemNote(itemName)
    });
  };

  const handleNotesSave = (note: string) => {
    onNoteChange(`${sectionKey}-${subsectionName}`, notesModal.item, note);
  };

  const handleBankToggle = (itemName: string) => {
    const currentlyInBank = isItemInBank(itemName);
    onBankStatusChange(`${sectionKey}-${subsectionName}`, itemName, !currentlyInBank);
  };

  const handleTimerSet = (itemName: string, trait: string, hours: number) => {
    onTimerSet(`${sectionKey}-${subsectionName}`, itemName, trait, hours);
    setTimerModal({ isOpen: false, item: '', trait: '', hours: 6 });
  };

  const handleTimerClick = (itemName: string, trait: string) => {
    const existingTimer = getTimerForTrait(itemName, trait);
    if (existingTimer) {
      onTimerRemove(`${sectionKey}-${subsectionName}`, itemName, trait);
    } else {
      setTimerModal({
        isOpen: true,
        item: itemName,
        trait,
        hours: 6
      });
    }
  };

  // Calculate progress stats
  const totalTraits = filteredItems.length * filteredTraits.length;
  const completedTraits = filteredItems.reduce((total, item) => {
    return total + filteredTraits.filter(trait => 
      isTraitCompleted(item.name, trait)
    ).length;
  }, 0);

  const progressStats: ProgressStats = {
    completed: completedTraits,
    total: totalTraits,
    percentage: totalTraits > 0 ? (completedTraits / totalTraits) * 100 : 0
  };

  if (filteredItems.length === 0 || filteredTraits.length === 0) {
    return (
      <div className="eso-card p-6">
        <h3 className="text-lg font-semibold mb-4 text-primary">{subsection.name}</h3>
        <ProgressBar stats={progressStats} sectionName={subsection.name} />
        <div className="mt-6 text-center py-8 text-muted-foreground">
          No items or traits match your search criteria.
        </div>
      </div>
    );
  }

  return (
    <div className="eso-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary">{subsection.name}</h3>
        <div className="text-sm text-muted-foreground">
          {completedTraits} / {totalTraits} ({Math.round(progressStats.percentage)}%) traits researched
        </div>
      </div>
      
      <div className="crafting-table">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-semibold">Item</th>
                <th className="w-12 p-4" title="Bank Status">
                  <Package className="w-4 h-4 mx-auto" />
                </th>
                <th className="w-12 p-4" title="Notes">
                  <FileText className="w-4 h-4 mx-auto" />
                </th>
                {filteredTraits.map(trait => (
                  <th key={trait} className="w-16 p-2 text-center">
                    <div className="trait-header text-xs">
                      {trait}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.name} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">
                    {item.name}
                  </td>
                  <td className="p-4 text-center">
                    <Checkbox
                      checked={isItemInBank(item.name)}
                      onCheckedChange={() => handleBankToggle(item.name)}
                      title="In Bank"
                    />
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleNotesClick(item.name)}
                      className={`notes-icon ${getItemNote(item.name) ? 'has-notes' : ''}`}
                      title="Add notes"
                    >
                      <FileText className="w-5 h-5" />
                    </button>
                  </td>
                  {filteredTraits.map(trait => {
                    const timer = getTimerForTrait(item.name, trait);
                    const timerKey = `${item.name}-${trait}`;
                    return (
                      <td key={trait} className="p-2 text-center relative">
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => handleTraitToggle(item.name, trait)}
                            className={`trait-checkbox ${
                              isTraitCompleted(item.name, trait) ? 'checked' : 'unchecked'
                            }`}
                            title={`${trait} - ${isTraitCompleted(item.name, trait) ? 'Completed' : 'Not researched'}`}
                          >
                            {isTraitCompleted(item.name, trait) && (
                              <Check className="w-4 h-4 text-green-700" />
                            )}
                          </button>
                          {!isTraitCompleted(item.name, trait) && (
                            <button
                              onClick={() => handleTimerClick(item.name, trait)}
                              className={`timer-button ${timer ? 'active' : ''}`}
                              title={timer ? 'Remove timer' : 'Set research timer'}
                            >
                              <Timer className="w-3 h-3" />
                            </button>
                          )}
                          {timer && timeLeft[timerKey] && (
                            <Badge 
                              variant={timeLeft[timerKey] === 'Complete!' ? 'default' : 'secondary'}
                              className="text-xs px-1 py-0"
                            >
                              {timeLeft[timerKey]}
                            </Badge>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NotesModal
        isOpen={notesModal.isOpen}
        onClose={() => setNotesModal({ ...notesModal, isOpen: false })}
        itemName={notesModal.item}
        sectionName={`${subsection.name} - ${notesModal.item}`}
        initialNote={notesModal.currentNote}
        onSave={handleNotesSave}
      />

      <Dialog 
        open={timerModal.isOpen} 
        onOpenChange={(open) => setTimerModal({ ...timerModal, isOpen: open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Research Timer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Setting timer for <strong>{timerModal.item} - {timerModal.trait}</strong>
            </p>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Hours:</label>
              <Input
                type="number"
                min="1"
                max="168"
                value={timerModal.hours}
                onChange={(e) => setTimerModal({ ...timerModal, hours: parseInt(e.target.value) || 6 })}
                className="w-20"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setTimerModal({ ...timerModal, isOpen: false })}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleTimerSet(timerModal.item, timerModal.trait, timerModal.hours)}
              >
                Set Timer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}