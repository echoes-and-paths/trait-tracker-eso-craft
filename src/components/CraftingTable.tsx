
import React, { useState } from 'react';
import { CraftingSection } from '../data/craftingData';
import { TraitProgress, ItemNote, ItemBankStatus, ResearchTimer } from '../types';
import { SubsectionTable } from './SubsectionTable';
import { BulkActions } from './BulkActions';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { Button } from './ui/button';
import { Keyboard } from 'lucide-react';

interface CraftingTableProps {
  section: CraftingSection;
  sectionKey: string;
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

export function CraftingTable({
  section,
  sectionKey,
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
}: CraftingTableProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  // Safety check for subsections
  if (!section || !section.subsections || !Array.isArray(section.subsections)) {
    return (
      <div className="eso-card p-6">
        <div className="text-center py-8 text-muted-foreground">
          No crafting data available for this section.
        </div>
      </div>
    );
  }

  // Get all available traits from the first subsection (assuming they're consistent)
  const availableTraits = section.subsections[0]?.traits || [];

  // Bulk action handlers
  const handleSelectAll = () => {
    const allItems = section.subsections.flatMap(sub => sub.items.map(item => item.name));
    setSelectedItems(allItems);
  };

  const handleSelectNone = () => {
    setSelectedItems([]);
  };

  const handleBulkComplete = (items: string[], trait: string) => {
    items.forEach(item => {
      section.subsections.forEach((subsection, index) => {
        const sectionName = `${sectionKey}-${subsection.name.toLowerCase().replace(/\s+/g, '-')}`;
        if (subsection.items.some(i => i.name === item)) {
          onProgressChange(sectionName, item, trait, true);
        }
      });
    });
    setSelectedItems([]);
  };

  const handleBulkBank = (items: string[], inBank: boolean) => {
    items.forEach(item => {
      section.subsections.forEach((subsection, index) => {
        const sectionName = `${sectionKey}-${subsection.name.toLowerCase().replace(/\s+/g, '-')}`;
        if (subsection.items.some(i => i.name === item)) {
          onBankStatusChange(sectionName, item, inBank);
        }
      });
    });
    setSelectedItems([]);
  };

  const handleBulkTimer = (items: string[], trait: string, hours: number) => {
    items.forEach(item => {
      section.subsections.forEach((subsection, index) => {
        const sectionName = `${sectionKey}-${subsection.name.toLowerCase().replace(/\s+/g, '-')}`;
        if (subsection.items.some(i => i.name === item)) {
          onTimerSet(sectionName, item, trait, hours);
        }
      });
    });
    setSelectedItems([]);
  };

  return (
    <div className="space-y-6">
      {/* Keyboard Shortcuts Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowKeyboardShortcuts(true)}
          className="gap-2"
        >
          <Keyboard className="w-4 h-4" />
          Shortcuts (?)
        </Button>
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedItems={selectedItems}
        onSelectAll={handleSelectAll}
        onSelectNone={handleSelectNone}
        onBulkComplete={handleBulkComplete}
        onBulkBank={handleBulkBank}
        onBulkTimer={handleBulkTimer}
        availableTraits={availableTraits}
      />

      {/* Subsection Tables */}
      {section.subsections.map((subsection, index) => (
        <div key={`${sectionKey}-${index}`} className="animate-fade-in">
          <SubsectionTable
            subsection={subsection}
            sectionKey={sectionKey}
            subsectionName={subsection.name.toLowerCase().replace(/\s+/g, '-')}
            progress={progress}
            notes={notes}
            bankStatus={bankStatus}
            timers={timers}
            searchQuery={searchQuery}
            onProgressChange={onProgressChange}
            onNoteChange={onNoteChange}
            onBankStatusChange={onBankStatusChange}
            onTimerSet={onTimerSet}
            onTimerRemove={onTimerRemove}
          />
        </div>
      ))}

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcuts
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />
    </div>
  );
}
