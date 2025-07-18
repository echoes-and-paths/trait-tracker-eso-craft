import React from 'react';
import { CraftingSection } from '../data/craftingData';
import { TraitProgress, ItemNote } from '../types';
import { SubsectionTable } from './SubsectionTable';

interface CraftingTableProps {
  section: CraftingSection;
  sectionKey: string;
  progress: TraitProgress[];
  notes: ItemNote[];
  searchQuery: string;
  onProgressChange: (section: string, item: string, trait: string, completed: boolean) => void;
  onNoteChange: (section: string, item: string, note: string) => void;
}

export function CraftingTable({
  section,
  sectionKey,
  progress,
  notes,
  searchQuery,
  onProgressChange,
  onNoteChange
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
          searchQuery={searchQuery}
          onProgressChange={onProgressChange}
          onNoteChange={onNoteChange}
        />
      ))}
    </div>
  );
}