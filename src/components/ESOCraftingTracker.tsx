import React, { useState, useEffect } from 'react';
import { ProfileManager } from './ProfileManager';
import { Controls } from './Controls';
import { CraftingTable } from './CraftingTable';
import { FirstRunTour } from './FirstRunTour';
import { Profile, TraitProgress, ItemNote, ItemBankStatus, ResearchTimer, AppState } from '../types';
import { CRAFTING_DATA } from '../data/craftingData';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import {
  useTraitProgress,
  useSetTraitProgress,
  useRemoveTraitProgress,
} from '@/hooks/useTraitProgress';
import {
  useResearchTimers,
  useSetResearchTimer,
  useRemoveResearchTimer,
} from '@/hooks/useResearchTimers';
import { Hammer, Shirt, TreePine, Gem, Search, Sun, Moon, RotateCcw } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

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
  const [appState, setAppState] = useState<AppState>(INITIAL_STATE);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [showFirstRun, setShowFirstRun] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      let state: AppState = INITIAL_STATE;
      if (session) setUserId(session.user.id);

      const local = localStorage.getItem('eso-crafting-tracker');
      if (session && local) {
        const parsed: AppState = JSON.parse(local);
        await Promise.all([
          ...parsed.traitProgress.map(p =>
            setTraitProgress.mutateAsync({
              user_id: session.user.id,
              profile_id: p.profileId,
              section: p.section,
              item: p.item,
              trait: p.trait,
              completed: p.completed
            })
          ),
          parsed.itemNotes.length &&
            supabase.from('item_notes').upsert(
              parsed.itemNotes.map(n => ({ ...n, user_id: session.user.id }))
            ),
          parsed.itemBankStatus.length &&
            supabase.from('bank_status').upsert(
              parsed.itemBankStatus.map(b => ({ ...b, user_id: session.user.id }))
            ),
          ...parsed.researchTimers.map(t =>
            setResearchTimer.mutateAsync({
              user_id: session.user.id,
              profile_id: t.profileId,
              section: t.section,
              item: t.item,
              trait: t.trait,
              end_time: t.endTime.toISOString()
            })
          )
        ]);
        localStorage.removeItem('eso-crafting-tracker');
      }

      if (session) {
        const { data: profiles } = await supabase
          .from('characters')
          .select('id,name')
          .eq('user_id', session.user.id);
        const { data: notes } = await supabase
          .from('item_notes')
          .select('profile_id,section,item,note')
          .eq('user_id', session.user.id);
        const { data: bank } = await supabase
          .from('bank_status')
          .select('profile_id,section,item,in_bank')
          .eq('user_id', session.user.id);

        state = {
          profiles: profiles ?? [],
          currentProfileId: profiles?.[0]?.id || null,
          traitProgress: [],
          itemNotes: notes ?? [],
          itemBankStatus: bank ?? [],
          researchTimers: [],
          searchQuery: ''
        };
      } else if (local) {
        state = JSON.parse(local);
      }

      setAppState(state);
      setLoading(false);
    }

    load();
  }, []);

  const currentProfile = appState.profiles.find(p => p.id === appState.currentProfileId);

  const { data: progressData } = useTraitProgress(currentProfile?.id);
  const { data: timerData } = useResearchTimers(currentProfile?.id);
  const setTraitProgress = useSetTraitProgress();
  const removeTraitProgress = useRemoveTraitProgress();
  const setResearchTimer = useSetResearchTimer();
  const removeResearchTimer = useRemoveResearchTimer();

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

    const tutorialKey = `tutorial_${newProfile.id}`;
    if (!localStorage.getItem(tutorialKey)) {
      setShowFirstRun(true);
      localStorage.setItem(tutorialKey, 'shown');
    }
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
  const handleProgressChange = async (section: string, item: string, trait: string, completed: boolean) => {
    if (!currentProfile || !userId) return;

    setAppState(prev => {
      const existingProgressIndex = prev.traitProgress.findIndex(tp =>
        tp.profileId === currentProfile.id &&
        tp.section === section &&
        tp.item === item &&
        tp.trait === trait
      );

      const newProgress = [...prev.traitProgress];

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

    const payload = { user_id: userId, profile_id: currentProfile.id, section, item, trait, completed };
    if (completed) {
      await setTraitProgress.mutateAsync(payload);
    } else {
      await removeTraitProgress.mutateAsync(payload);
    }
  };

  // Notes Management
  const handleNoteChange = async (section: string, item: string, note: string) => {
    if (!currentProfile || !userId) return;

    setAppState(prev => {
      const existingNoteIndex = prev.itemNotes.findIndex(n =>
        n.profileId === currentProfile.id &&
        n.section === section &&
        n.item === item
      );

      const newNotes = [...prev.itemNotes];

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

    const payload = { user_id: userId, profile_id: currentProfile.id, section, item, note };
    if (note.trim()) {
      await supabase.from('item_notes').upsert(payload);
    } else {
      await supabase.from('item_notes').delete().match({ user_id: userId, profile_id: currentProfile.id, section, item });
    }
  };

  // Reset Progress
  const handleResetProgress = async () => {
    if (!currentProfile || !userId) return;

    setAppState(prev => ({
      ...prev,
      traitProgress: prev.traitProgress.filter(tp => tp.profileId !== currentProfile.id),
      itemNotes: prev.itemNotes.filter(note => note.profileId !== currentProfile.id),
      itemBankStatus: prev.itemBankStatus.filter(status => status.profileId !== currentProfile.id),
      researchTimers: prev.researchTimers.filter(timer => timer.profileId !== currentProfile.id)
    }));

    await Promise.all([
      ...(progressData ?? []).map(tp =>
        removeTraitProgress.mutateAsync({
          user_id: userId,
          profile_id: currentProfile.id,
          section: tp.section,
          item: tp.item,
          trait: tp.trait,
          completed: tp.completed,
        })
      ),
      supabase.from('item_notes').delete().match({ user_id: userId, profile_id: currentProfile.id }),
      supabase.from('bank_status').delete().match({ user_id: userId, profile_id: currentProfile.id }),
      ...(timerData ?? []).map(t =>
        removeResearchTimer.mutateAsync({
          user_id: userId,
          profile_id: currentProfile.id,
          section: t.section,
          item: t.item,
          trait: t.trait,
          end_time: null,
        })
      )
    ]);
  };

  // Bank Status Management
  const handleBankStatusChange = async (section: string, item: string, inBank: boolean) => {
    if (!currentProfile || !userId) return;

    setAppState(prev => {
      const existingStatusIndex = prev.itemBankStatus.findIndex(status =>
        status.profileId === currentProfile.id &&
        status.section === section &&
        status.item === item
      );

      const newBankStatus = [...prev.itemBankStatus];

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

    const payload = { user_id: userId, profile_id: currentProfile.id, section, item, in_bank: inBank };
    if (inBank) {
      await supabase.from('bank_status').upsert(payload);
    } else {
      await supabase.from('bank_status').delete().match({ user_id: userId, profile_id: currentProfile.id, section, item });
    }
  };

  // Timer Management
  const handleTimerSet = async (section: string, item: string, trait: string, hours: number) => {
    if (!currentProfile || !userId) return;

    const endTime = new Date();
    endTime.setHours(endTime.getHours() + hours);

    setAppState(prev => {
      const existingTimerIndex = prev.researchTimers.findIndex(timer =>
        timer.profileId === currentProfile.id &&
        timer.section === section &&
        timer.item === item &&
        timer.trait === trait
      );

      const newTimers = [...prev.researchTimers];

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

    await setResearchTimer.mutateAsync({
      user_id: userId,
      profile_id: currentProfile.id,
      section,
      item,
      trait,
      end_time: endTime.toISOString()
    });

    toast({
      title: "Research Timer Set",
      description: `Timer set for ${item} - ${trait} (${hours}h)`,
    });
  };

  const handleTimerRemove = async (section: string, item: string, trait: string) => {
    if (!currentProfile || !userId) return;

    setAppState(prev => ({
      ...prev,
      researchTimers: prev.researchTimers.filter(timer =>
        !(timer.profileId === currentProfile.id &&
          timer.section === section &&
          timer.item === item &&
          timer.trait === trait)
      )
    }));

    await removeResearchTimer.mutateAsync({
      user_id: userId,
      profile_id: currentProfile.id,
      section,
      item,
      trait,
      end_time: null,
    });
  };

  // Filter data for current profile
  const currentProgress = progressData ?? [];
  const currentNotes = (appState.itemNotes || []).filter(note => note.profileId === currentProfile?.id);
  const currentBankStatus = (appState.itemBankStatus || []).filter(status => status.profileId === currentProfile?.id);
  const currentTimers = timerData ?? [];

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
          currentProfile={currentProfile}
          onProfileSelect={handleProfileSelect}
          onProfileCreate={handleProfileCreate}
          onProfileRename={handleProfileRename}
          onProfileDelete={handleProfileDelete}
          onThemeToggle={handleThemeToggle}
          onResetProgress={handleResetProgress}
        />

        {currentProfile ? (
          <>
            {/* Search */}
            <div className="eso-card p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search items or traits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

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
      <FirstRunTour open={showFirstRun} onClose={() => setShowFirstRun(false)} />
    </div>
  );
}