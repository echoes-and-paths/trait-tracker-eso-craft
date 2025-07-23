import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('@/hooks/useCharacterItems', () => ({
  useCharacterItems: jest.fn(),
}));
jest.mock('@/hooks/useCharacterItemMutation', () => ({
  useCharacterItemMutation: jest.fn(),
}));

import { useCharacterItems } from '@/hooks/useCharacterItems';
import { useCharacterItemMutation } from '@/hooks/useCharacterItemMutation';
import TraitGridGrouped from '../TraitGridGrouped';

describe('TraitGridGrouped', () => {
  const mutate = jest.fn();
  const rows = [
    { id: '1', item_type: 'Sword', trait: 'Powered', group: 'Blacksmithing', character_items: { completed: false, in_bank: false, research_ends_at: null } },
    { id: '2', item_type: 'Axe', trait: 'Charged', group: 'Blacksmithing', character_items: null },
  ];

  beforeEach(() => {
    (useCharacterItems as jest.Mock).mockReturnValue({ data: rows, isLoading: false, error: null });
    (useCharacterItemMutation as jest.Mock).mockReturnValue({ mutate });
    mutate.mockClear();
  });

  it('renders groups and handles checkbox update', async () => {
    render(<TraitGridGrouped characterId="char1" />);

    expect(screen.getByText('Blacksmithing — 0/2 (0%)')).toBeInTheDocument();
    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[0]);
    expect(mutate).toHaveBeenCalledWith({ character_id: 'char1', item_id: '1', completed: true });
  });
});
