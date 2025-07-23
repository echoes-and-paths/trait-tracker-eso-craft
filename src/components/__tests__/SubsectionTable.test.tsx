import { render, screen } from '@testing-library/react';
import { SubsectionTable } from '../SubsectionTable';
import { CraftingSubsection } from '../../data/craftingData';

describe('SubsectionTable', () => {
  const subsection: CraftingSubsection = {
    name: 'Weapons',
    traits: ['Sharpness'],
    items: [{ name: 'Sword', traits: [] }]
  };

  it('displays subsection name', () => {
    render(
      <SubsectionTable
        subsection={subsection}
        sectionKey="blacksmithing"
        subsectionName="Weapons"
        progress={[]}
        notes={[]}
        bankStatus={[]}
        timers={[]}
        searchQuery=""
        onProgressChange={jest.fn()}
        onNoteChange={jest.fn()}
        onBankStatusChange={jest.fn()}
        onTimerSet={jest.fn()}
        onTimerRemove={jest.fn()}
      />
    );

    expect(screen.getByText('Weapons')).toBeInTheDocument();
  });
});
