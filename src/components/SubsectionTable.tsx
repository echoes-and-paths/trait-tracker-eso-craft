import React, { useState } from 'react';
import { CraftingSubsection } from '../data/craftingData';
import { TraitProgress, ItemNote, ProgressStats } from '../types';
import { Check, FileText } from 'lucide-react';
import { NotesModal } from './NotesModal';
import { ProgressBar } from './ProgressBar';

interface SubsectionTableProps {
  subsection: CraftingSubsection;
  sectionKey: string;
  subsectionName: string;
  progress: TraitProgress[];
  notes: ItemNote[];
  searchQuery: string;
  onProgressChange: (section: string, item: string, trait: string, completed: boolean) => void;
  onNoteChange: (section: string, item: string, note: string) => void;
}

export function SubsectionTable({
  subsection,
  sectionKey,
  subsectionName,
  progress,
  notes,
  searchQuery,
  onProgressChange,
  onNoteChange
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
          {completedTraits} / {totalTraits} traits researched
        </div>
      </div>
      <ProgressBar stats={progressStats} sectionName={subsection.name} />
      
      <div className="crafting-table">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-semibold">Item</th>
                <th className="w-12 p-4"></th>
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
                    <button
                      onClick={() => handleNotesClick(item.name)}
                      className={`notes-icon ${getItemNote(item.name) ? 'has-notes' : ''}`}
                      title="Add notes"
                    >
                      <FileText className="w-5 h-5" />
                    </button>
                  </td>
                  {filteredTraits.map(trait => (
                    <td key={trait} className="p-2 text-center">
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
                    </td>
                  ))}
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
    </div>
  );
}