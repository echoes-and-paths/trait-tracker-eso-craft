import React from 'react';
import { CraftingSection } from '../data/craftingData';
import { TraitProgress, ItemNote, ItemBankStatus, ResearchTimer } from '../types';
import { SubsectionTable } from './SubsectionTable';

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

  return (
    <div className="space-y-6">
      {section.subsections.map((subsection, index) => (
        <SubsectionTable
          key={`${sectionKey}-${index}`}
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
      ))}
    </div>
  );
}