import { render, screen } from '@testing-library/react';
import { ProfileManager } from '../ProfileManager';
import { Profile } from '../../types';

describe('ProfileManager', () => {
  const profiles: Profile[] = [
    { id: '1', name: 'Hero', theme: 'light', createdAt: new Date() }
  ];

  it('renders heading', () => {
    render(
      <ProfileManager
        profiles={profiles}
        currentProfileId="1"
        currentProfile={profiles[0]}
        onProfileSelect={jest.fn()}
        onProfileCreate={jest.fn()}
        onProfileRename={jest.fn()}
        onProfileDelete={jest.fn()}
        onThemeToggle={jest.fn()}
        onResetProgress={jest.fn()}
      />
    );

    expect(screen.getByText('Character Profiles')).toBeInTheDocument();
  });
});
