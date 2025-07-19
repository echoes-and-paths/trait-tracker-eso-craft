import React, { useState } from 'react';
import { Profile } from '../types';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Trash2, Edit3, Plus, User, Sun, Moon, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileManagerProps {
  profiles: Profile[];
  currentProfileId: string | null;
  currentProfile: Profile | undefined;
  onProfileSelect: (profileId: string) => void;
  onProfileCreate: (name: string) => void;
  onProfileRename: (profileId: string, newName: string) => void;
  onProfileDelete: (profileId: string) => void;
  onThemeToggle: () => void;
  onResetProgress: () => void;
}

export function ProfileManager({
  profiles,
  currentProfileId,
  currentProfile,
  onProfileSelect,
  onProfileCreate,
  onProfileRename,
  onProfileDelete,
  onThemeToggle,
  onResetProgress
}: ProfileManagerProps) {
  const [newProfileName, setNewProfileName] = useState('');
  const [renameProfileId, setRenameProfileId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCreateProfile = () => {
    if (newProfileName.trim()) {
      onProfileCreate(newProfileName.trim());
      setNewProfileName('');
      setShowCreateDialog(false);
      toast({
        title: "Profile Created",
        description: `Profile "${newProfileName}" has been created successfully.`,
      });
    }
  };

  const handleRenameProfile = () => {
    if (renameProfileId && renameValue.trim()) {
      onProfileRename(renameProfileId, renameValue.trim());
      setRenameProfileId(null);
      setRenameValue('');
      toast({
        title: "Profile Renamed",
        description: "Profile has been renamed successfully.",
      });
    }
  };

  const handleDeleteProfile = (profileId: string) => {
    onProfileDelete(profileId);
    setShowDeleteDialog(null);
    toast({
      title: "Profile Deleted",
      description: "Profile has been deleted permanently.",
      variant: "destructive"
    });
  };

  return (
    <div className="eso-card p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold">Character Profiles</h2>
        </div>
        {currentProfile && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onThemeToggle}
              className="transition-all duration-200"
              title="Toggle theme"
            >
              {currentProfile.theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={currentProfileId || ''} onValueChange={onProfileSelect}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select a character profile">
              {currentProfile ? (
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {currentProfile.name}
                </span>
              ) : "Select a character profile"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {profiles.map(profile => (
              <SelectItem key={profile.id} value={profile.id}>
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {profile.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Character name"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateProfile()}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProfile} disabled={!newProfileName.trim()}>
                  Create Profile
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {currentProfileId && (
            <>
              <Dialog open={renameProfileId === currentProfileId} onOpenChange={(open) => {
                if (open) {
                  setRenameProfileId(currentProfileId);
                  setRenameValue(currentProfile?.name || '');
                } else {
                  setRenameProfileId(null);
                  setRenameValue('');
                }
              }}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="New profile name"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRenameProfile()}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setRenameProfileId(null)}>
                      Cancel
                    </Button>
                    <Button onClick={handleRenameProfile} disabled={!renameValue.trim()}>
                      Rename Profile
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    title="Reset all progress"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset Research Progress</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to reset all research progress for the current profile? 
                      This action cannot be undone and will clear all completed trait research.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        onResetProgress();
                        toast({
                          title: "Progress Reset",
                          description: "All research progress has been cleared for this profile.",
                          variant: "destructive"
                        });
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Reset Progress
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Dialog open={showDeleteDialog === currentProfileId} onOpenChange={(open) => {
                setShowDeleteDialog(open ? currentProfileId : null);
              }}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Profile</DialogTitle>
                  </DialogHeader>
                  <p className="text-muted-foreground">
                    Are you sure you want to delete the profile "{currentProfile?.name}"? 
                    This action cannot be undone and will permanently delete all research progress and notes.
                  </p>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowDeleteDialog(null)}>
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDeleteProfile(currentProfileId)}
                    >
                      Delete Profile
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
    </div>
  );
}