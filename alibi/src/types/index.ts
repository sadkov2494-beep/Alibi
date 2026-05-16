export type TransportType = 'walk' | 'car' | 'bus' | 'metro' | 'taxi';

export type ScreenName = 'home' | 'chapters' | 'caseIntro' | 'investigation' | 'settings' | 'shop';

export type HintLevel = 'light' | 'medium' | 'strong';

export interface Chapter {
  id: string;
  title: string;
  description: string;
  caseIds: string[];
}

export interface Suspect {
  id: string;
  name: string;
  role: string;
  motive: string;
  portrait: string;
  transport: TransportType[];
  notes: string[];
  alibi: string;
}

export interface Location {
  id: string;
  name: string;
  x: number;
  y: number;
  description: string;
}

export interface Route {
  from: string;
  to: string;
  walkMinutes?: number;
  carMinutes?: number;
  busMinutes?: number;
  metroMinutes?: number;
  taxiMinutes?: number;
  restriction?: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  suspectId?: string;
  locationId: string;
  text: string;
  type: 'crime' | 'witness' | 'camera' | 'transport' | 'call' | 'clue' | 'alibi' | 'receipt';
}

export interface Clue {
  id: string;
  title: string;
  text: string;
  category: 'camera' | 'witness' | 'receipt' | 'call' | 'message' | 'transport' | 'item' | 'falseLead';
  relatedSuspectIds?: string[];
}

export interface Weapon {
  id: string;
  name: string;
  description: string;
}

export interface Hint {
  id: string;
  level: HintLevel;
  text: string;
}

export interface Exclusion {
  suspectId: string;
  reason: string;
}

export interface CaseData {
  id: string;
  chapterId: string;
  title: string;
  description: string;
  crimeTime: string;
  crimeLocationId: string;
  suspects: Suspect[];
  locations: Location[];
  routes: Route[];
  timelineEvents: TimelineEvent[];
  clues: Clue[];
  weapons: Weapon[];
  correctSuspectId: string;
  correctWeaponId: string;
  explanation: string;
  exclusions: Exclusion[];
  hints: Hint[];
  tutorial?: string[];
}

export interface CaseProgress {
  stars: number;
  attempts: number;
  hintsUsed: number;
  solved: boolean;
}

export interface PlayerSettings {
  sound: boolean;
  music: boolean;
  language: 'ru' | 'en';
}

export interface PlayerProgress {
  unlockedChapterIds: string[];
  unlockedCaseIds: string[];
  completedCases: Record<string, CaseProgress>;
  hintsAvailable: number;
  settings: PlayerSettings;
  tutorialSeenCaseIds: string[];
  adsRemoved: boolean;
}
