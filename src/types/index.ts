export interface Profile {
  id: string;
  name: string;
  theme: 'light' | 'dark';
  createdAt: Date;
}

export interface TraitProgress {
  profileId: string;
  section: string;
  item: string;
  trait: string;
  completed: boolean;
}

export interface ItemNote {
  profileId: string;
  section: string;
  item: string;
  note: string;
}

export interface ItemBankStatus {
  profileId: string;
  section: string;
  item: string;
  inBank: boolean;
}

export interface ResearchTimer {
  profileId: string;
  section: string;
  item: string;
  trait: string;
  endTime: Date;
}

export interface AppState {
  profiles: Profile[];
  currentProfileId: string | null;
  traitProgress: TraitProgress[];
  itemNotes: ItemNote[];
  itemBankStatus: ItemBankStatus[];
  researchTimers: ResearchTimer[];
  searchQuery: string;
}

export interface ProgressStats {
  completed: number;
  total: number;
  percentage: number;
}