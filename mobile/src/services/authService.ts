import { dbService } from './dbService';

export interface TeacherProfile {
  id: string;
  name: string;
  teacherId: string; // e-Vidyavahini ID
  district: string;
  block: string;
  assignedGrade: string; // "Balvatika" | "Class 1" | "Class 2" | "Class 3"
  pinHash: string;
  avatarColor: string;
  createdAt: string;
}

const STORAGE_KEY_PROFILES = 'bhashagyan_teacher_profiles';
const STORAGE_KEY_ACTIVE_SESSION = 'bhashagyan_active_teacher_id';

const AVATAR_COLORS = ['#1a365d', '#2b6cb0', '#2c7a7b', '#285e61', '#744210', '#6b46c1'];

// Simple SHA-256 hasher using Web Crypto API
export async function hashPin(pin: string): Promise<string> {
  if (window.crypto && window.crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(pin);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash)}`;
}

export const authService = {
  getProfiles(): TeacherProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PROFILES);
      if (!data) {
        return [];
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  async registerProfile(
    name: string,
    teacherId: string,
    district: string,
    block: string,
    assignedGrade: string,
    pin: string
  ): Promise<TeacherProfile> {
    const profiles = this.getProfiles();
    const pinHash = await hashPin(pin);
    const colorIndex = profiles.length % AVATAR_COLORS.length;

    const newProfile: TeacherProfile = {
      id: `teacher_${Date.now()}`,
      name: name.trim(),
      teacherId: teacherId.trim() || `EVV-JH-${Math.floor(100000 + Math.random() * 900000)}`,
      district: district || 'दुमका (Dumka)',
      block: block || 'सदर (Sadar)',
      assignedGrade: assignedGrade || 'कक्षा 1 (Class 1)',
      pinHash,
      avatarColor: AVATAR_COLORS[colorIndex],
      createdAt: new Date().toISOString(),
    };

    profiles.push(newProfile);
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
    this.setActiveSession(newProfile.id);

    // Sync to IndexedDB asynchronously
    try {
      await dbService.saveTeacherProfile(newProfile);
    } catch (e) {
      console.warn('Failed to sync profile to IndexedDB:', e);
    }

    return newProfile;
  },

  async verifyPin(teacherId: string, enteredPin: string): Promise<boolean> {
    const profiles = this.getProfiles();
    const profile = profiles.find((p) => p.id === teacherId);
    if (!profile) return false;

    const enteredHash = await hashPin(enteredPin);
    return enteredHash === profile.pinHash;
  },

  getActiveProfile(): TeacherProfile | null {
    const activeId = localStorage.getItem(STORAGE_KEY_ACTIVE_SESSION);
    const profiles = this.getProfiles();
    if (!activeId) {
      if (profiles.length > 0) {
        localStorage.setItem(STORAGE_KEY_ACTIVE_SESSION, profiles[0].id);
        return profiles[0];
      }
      return null;
    }
    return profiles.find((p) => p.id === activeId) || (profiles[0] ?? null);
  },

  setActiveSession(teacherId: string) {
    localStorage.setItem(STORAGE_KEY_ACTIVE_SESSION, teacherId);
  },

  updateProfile(id: string, updates: Partial<TeacherProfile>): TeacherProfile | null {
    const profiles = this.getProfiles();
    const index = profiles.findIndex((p) => p.id === id);
    if (index === -1) return null;
    profiles[index] = { ...profiles[index], ...updates };
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
    return profiles[index];
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY_ACTIVE_SESSION);
  },
};
