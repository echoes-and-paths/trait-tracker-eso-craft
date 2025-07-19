import React, { useState, useEffect } from 'react';
import { ProfileManager } from './ProfileManager';
import { Controls } from './Controls';
import { CraftingTable } from './CraftingTable';
import { Profile, TraitProgress, ItemNote, ItemBankStatus, ResearchTimer, AppState } from '../types';
import { CRAFTING_DATA } from '../data/craftingData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { Hammer, Shirt, TreePine, Gem } from 'lucide-react';

const SECTION_ICONS = {
  blacksmithing: Hammer,
  clothing: Shirt,
  woodworking: TreePine,
  jewelry: Gem
};

const INITIAL_STATE: AppState = {
  profiles: [],
  currentProfileId: null,
  traitProgress: [],
  itemNotes: [],
  itemBankStatus: [],
  researchTimers: [],
  searchQuery: ''
};

export function ESOCraftingTracker() {
  const [appState, setAppState] = useLocalStorage<AppState>('eso-crafting-tracker', INITIAL_STATE);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const currentProfile = appState.profiles.find(p => p.id === appState.currentProfileId);

  // Apply theme to document
  useEffect(() => {
    const theme = currentProfile?.theme || 'dark';
    document.documentElement.className = theme;
  }, [currentProfile?.theme]);

  // Profile Management
  const handleProfileCreate = (name: string) => {
    const newProfile: Profile = {
      id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      theme: 'dark',
      createdAt: new Date()
    };

    setAppState(prev => ({
      ...prev,
      profiles: [...prev.profiles, newProfile],
      currentProfileId: newProfile.id
    }));
  };

  const handleProfileSelect = (profileId: string) => {
    setAppState(prev => ({
      ...prev,
      currentProfileId: profileId
    }));
  };

  const handleProfileRename = (profileId: string, newName: string) => {
    setAppState(prev => ({
      ...prev,
      profiles: prev.profiles.map(profile =>
        profile.id === profileId ? { ...profile, name: newName } : profile
      )
    }));
  };

  const handleProfileDelete = (profileId: string) => {
    setAppState(prev => ({
      ...prev,
      profiles: prev.profiles.filter(p => p.id !== profileId),
      currentProfileId: prev.profiles.length > 1 ? 
        prev.profiles.find(p => p.id !== profileId)?.id || null : null,
      traitProgress: prev.traitProgress.filter(tp => tp.profileId !== profileId),
      itemNotes: prev.itemNotes.filter(note => note.profileId !== profileId),
      itemBankStatus: prev.itemBankStatus.filter(status => status.profileId !== profileId),
      researchTimers: prev.researchTimers.filter(timer => timer.profileId !== profileId)
    }));
  };

  // Theme Management
  const handleThemeToggle = () => {
    if (!currentProfile) return;

    const newTheme = currentProfile.theme === 'dark' ? 'light' : 'dark';
    setAppState(prev => ({
      ...prev,
      profiles: prev.profiles.map(profile =>
        profile.id === currentProfile.id 
          ? { ...profile, theme: newTheme }
          : profile
      )
    }));
  };

  // Progress Management
  const handleProgressChange = (section: string, item: string, trait: string, completed: boolean) => {
    if (!currentProfile) return;

    setAppState(prev => {
      const existingProgressIndex = prev.traitProgress.findIndex(tp =>
        tp.profileId === currentProfile.id &&
        tp.section === section &&
        tp.item === item &&
        tp.trait === trait
      );

      let newProgress = [...prev.traitProgress];

      if (existingProgressIndex >= 0) {
        if (completed) {
          newProgress[existingProgressIndex] = { ...newProgress[existingProgressIndex], completed };
        } else {
          newProgress.splice(existingProgressIndex, 1);
        }
      } else if (completed) {
        newProgress.push({
          profileId: currentProfile.id,
          section,
          item,
          trait,
          completed
        });
      }

      return {
        ...prev,
        traitProgress: newProgress
      };
    });
  };

  // Notes Management
  const handleNoteChange = (section: string, item: string, note: string) => {
    if (!currentProfile) return;

    setAppState(prev => {
      const existingNoteIndex = prev.itemNotes.findIndex(n =>
        n.profileId === currentProfile.id &&
        n.section === section &&
        n.item === item
      );

      let newNotes = [...prev.itemNotes];

      if (existingNoteIndex >= 0) {
        if (note.trim()) {
          newNotes[existingNoteIndex] = { ...newNotes[existingNoteIndex], note };
        } else {
          newNotes.splice(existingNoteIndex, 1);
        }
      } else if (note.trim()) {
        newNotes.push({
          profileId: currentProfile.id,
          section,
          item,
          note
        });
      }

      return {
        ...prev,
        itemNotes: newNotes
      };
    });
  };

  // Reset Progress
  const handleResetProgress = () => {
    if (!currentProfile) return;

    setAppState(prev => ({
      ...prev,
      traitProgress: prev.traitProgress.filter(tp => tp.profileId !== currentProfile.id),
      itemNotes: prev.itemNotes.filter(note => note.profileId !== currentProfile.id),
      itemBankStatus: prev.itemBankStatus.filter(status => status.profileId !== currentProfile.id),
      researchTimers: prev.researchTimers.filter(timer => timer.profileId !== currentProfile.id)
    }));
  };

  // Bank Status Management
  const handleBankStatusChange = (section: string, item: string, inBank: boolean) => {
    if (!currentProfile) return;

    setAppState(prev => {
      const existingStatusIndex = prev.itemBankStatus.findIndex(status =>
        status.profileId === currentProfile.id &&
        status.section === section &&
        status.item === item
      );

      let newBankStatus = [...prev.itemBankStatus];

      if (existingStatusIndex >= 0) {
        if (inBank) {
          newBankStatus[existingStatusIndex] = { ...newBankStatus[existingStatusIndex], inBank };
        } else {
          newBankStatus.splice(existingStatusIndex, 1);
        }
      } else if (inBank) {
        newBankStatus.push({
          profileId: currentProfile.id,
          section,
          item,
          inBank
        });
      }

      return {
        ...prev,
        itemBankStatus: newBankStatus
      };
    });
  };

  // Timer Management
  const handleTimerSet = (section: string, item: string, trait: string, hours: number) => {
    if (!currentProfile) return;

    const endTime = new Date();
    endTime.setHours(endTime.getHours() + hours);

    setAppState(prev => {
      const existingTimerIndex = prev.researchTimers.findIndex(timer =>
        timer.profileId === currentProfile.id &&
        timer.section === section &&
        timer.item === item &&
        timer.trait === trait
      );

      let newTimers = [...prev.researchTimers];

      if (existingTimerIndex >= 0) {
        newTimers[existingTimerIndex] = { ...newTimers[existingTimerIndex], endTime };
      } else {
        newTimers.push({
          profileId: currentProfile.id,
          section,
          item,
          trait,
          endTime
        });
      }

      return {
        ...prev,
        researchTimers: newTimers
      };
    });

    toast({
      title: "Research Timer Set",
      description: `Timer set for ${item} - ${trait} (${hours}h)`,
    });
  };

  const handleTimerRemove = (section: string, item: string, trait: string) => {
    if (!currentProfile) return;

    setAppState(prev => ({
      ...prev,
      researchTimers: prev.researchTimers.filter(timer =>
        !(timer.profileId === currentProfile.id &&
          timer.section === section &&
          timer.item === item &&
          timer.trait === trait)
      )
    }));
  };

  // Filter data for current profile
  const currentProgress = (appState.traitProgress || []).filter(tp => tp.profileId === currentProfile?.id);
  const currentNotes = (appState.itemNotes || []).filter(note => note.profileId === currentProfile?.id);
  const currentBankStatus = (appState.itemBankStatus || []).filter(status => status.profileId === currentProfile?.id);
  const currentTimers = (appState.researchTimers || []).filter(timer => timer.profileId === currentProfile?.id);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ESO Crafting Research Tracker
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track your crafting research progress across all professions. 
            Manage multiple character profiles and never lose track of your trait research again.
          </p>
        </div>

        {/* Profile Management */}
        <ProfileManager
          profiles={appState.profiles}
          currentProfileId={appState.currentProfileId}
          onProfileSelect={handleProfileSelect}
          onProfileCreate={handleProfileCreate}
          onProfileRename={handleProfileRename}
          onProfileDelete={handleProfileDelete}
        />

        {currentProfile ? (
          <>
            {/* Controls */}
            <Controls
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              theme={currentProfile.theme}
              onThemeToggle={handleThemeToggle}
              onResetProgress={handleResetProgress}
            />

            {/* Crafting Tables */}
            <div className="space-y-8">
              {Object.entries(CRAFTING_DATA).map(([key, section]) => {
                const IconComponent = SECTION_ICONS[key as keyof typeof SECTION_ICONS];
                return (
                  <div key={key} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-6 h-6 text-primary" />
                      <h2 className="text-2xl font-bold">{section.name}</h2>
                    </div>
                    <CraftingTable
                      section={section}
                      sectionKey={key}
                      progress={currentProgress}
                      notes={currentNotes}
                      bankStatus={currentBankStatus}
                      timers={currentTimers}
                      searchQuery={searchQuery}
                      onProgressChange={handleProgressChange}
                      onNoteChange={handleNoteChange}
                      onBankStatusChange={handleBankStatusChange}
                      onTimerSet={handleTimerSet}
                      onTimerRemove={handleTimerRemove}
                    />
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="eso-card p-12 text-center space-y-4">
            <div className="text-6xl mb-4">⚔️</div>
            <h2 className="text-2xl font-bold">Welcome, Crafter!</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Create your first character profile to start tracking your crafting research progress.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}