import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileManager } from '../ProfileManager';
import { Profile } from '@/types';

describe('ProfileManager', () => {
  const profiles: Profile[] = [
    { id: '1', name: 'Alpha', theme: 'light' },
    { id: '2', name: 'Beta', theme: 'dark' },
  ];
  const handlers = {
    onProfileSelect: jest.fn(),
    onProfileCreate: jest.fn(),
    onProfileRename: jest.fn(),
    onProfileDelete: jest.fn(),
    onThemeToggle: jest.fn(),
    onResetProgress: jest.fn(),
  };

  beforeEach(() => {
    Object.values(handlers).forEach(fn => fn.mockClear());
  });

  it('renders current profile and toggles theme', async () => {
    render(
      <ProfileManager
        profiles={profiles}
        currentProfileId="1"
        currentProfile={profiles[0]}
        {...handlers}
      />
    );

    expect(screen.getByText('Character Profiles')).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();

    const btn = screen.getByTitle('Toggle theme');
    await userEvent.click(btn);
    expect(handlers.onThemeToggle).toHaveBeenCalled();
  });
});
