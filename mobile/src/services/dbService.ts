/**
 * Bhasha Gyan On-Device Database & Persistence Service (dbService.ts)
 * 100% Offline IndexedDB / Local Database Engine
 * 
 * Manages:
 * 1. Teacher Profiles & Auth Security
 * 2. Student FLN Practice Progress & Competency Scores
 * 3. Community Content Contributions (Offline Moderation Queue)
 * 4. Dynamic Custom Vocabulary Injection
 */

export interface TeacherRecord {
  id: string;
  name: string;
  teacherId: string; // e-Vidyavahini ID
  district: string;
  block: string;
  assignedGrade: string;
  pinHash: string;
  avatarColor: string;
  createdAt: string;
}

export interface StudentProgressRecord {
  id: string;
  studentName: string;
  grade: string;
  category: 'sound_matching' | 'picture_word' | 'fln_counting';
  score: number;
  maxScore: number;
  timeSpentSeconds: number;
  completedAt: string;
}

export interface ContributionRecord {
  id: string;
  sourceHindi: string;
  targetSantaliOlChiki: string;
  targetSantaliPhoneticHi: string;
  category: string;
  submittedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
}

export interface CustomWordRecord {
  id: string;
  hindi: string;
  santaliOlChiki: string;
  santaliPhoneticHi: string;
  category: string;
  addedAt: string;
}

const DB_NAME = 'bhashagyan_offline_db';
const DB_VERSION = 1;

class DatabaseService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not supported in this environment'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 1. Teacher Profiles Store
        if (!db.objectStoreNames.contains('teacher_profiles')) {
          const teacherStore = db.createObjectStore('teacher_profiles', { keyPath: 'id' });
          teacherStore.createIndex('teacherId', 'teacherId', { unique: false });
        }

        // 2. Student Progress Store
        if (!db.objectStoreNames.contains('student_progress')) {
          const progressStore = db.createObjectStore('student_progress', { keyPath: 'id' });
          progressStore.createIndex('category', 'category', { unique: false });
          progressStore.createIndex('completedAt', 'completedAt', { unique: false });
        }

        // 3. Community Contributions Store
        if (!db.objectStoreNames.contains('contributions')) {
          const contribStore = db.createObjectStore('contributions', { keyPath: 'id' });
          contribStore.createIndex('status', 'status', { unique: false });
        }

        // 4. Custom Dictionary Words Store
        if (!db.objectStoreNames.contains('custom_words')) {
          const dictStore = db.createObjectStore('custom_words', { keyPath: 'id' });
          dictStore.createIndex('hindi', 'hindi', { unique: false });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('IndexedDB open error:', request.error);
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  // ----------------------------------------------------
  // 1. TEACHER PROFILES & AUTH
  // ----------------------------------------------------
  public async saveTeacherProfile(profile: TeacherRecord): Promise<TeacherRecord> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('teacher_profiles', 'readwrite');
      const store = tx.objectStore('teacher_profiles');
      const request = store.put(profile);

      request.onsuccess = () => resolve(profile);
      request.onerror = () => reject(request.error);
    });
  }

  public async getTeacherProfiles(): Promise<TeacherRecord[]> {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('teacher_profiles', 'readonly');
        const store = tx.objectStore('teacher_profiles');
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch {
      return [];
    }
  }

  // ----------------------------------------------------
  // 2. STUDENT FLN PROGRESS TRACKING
  // ----------------------------------------------------
  public async recordStudentProgress(record: Omit<StudentProgressRecord, 'id' | 'completedAt'>): Promise<StudentProgressRecord> {
    const fullRecord: StudentProgressRecord = {
      ...record,
      id: `prog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      completedAt: new Date().toISOString(),
    };

    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('student_progress', 'readwrite');
      const store = tx.objectStore('student_progress');
      const request = store.add(fullRecord);

      request.onsuccess = () => resolve(fullRecord);
      request.onerror = () => reject(request.error);
    });
  }

  public async getStudentProgressLogs(): Promise<StudentProgressRecord[]> {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('student_progress', 'readonly');
        const store = tx.objectStore('student_progress');
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch {
      return [];
    }
  }

  // ----------------------------------------------------
  // 3. COMMUNITY CONTENT CONTRIBUTIONS
  // ----------------------------------------------------
  public async addContribution(contribution: Omit<ContributionRecord, 'id' | 'status' | 'submittedAt'>): Promise<ContributionRecord> {
    const fullRecord: ContributionRecord = {
      ...contribution,
      id: `contrib_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('contributions', 'readwrite');
      const store = tx.objectStore('contributions');
      const request = store.add(fullRecord);

      request.onsuccess = () => resolve(fullRecord);
      request.onerror = () => reject(request.error);
    });
  }

  public async getContributions(): Promise<ContributionRecord[]> {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('contributions', 'readonly');
        const store = tx.objectStore('contributions');
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch {
      return [];
    }
  }

  public async updateContributionStatus(id: string, status: 'approved' | 'rejected'): Promise<boolean> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['contributions', 'custom_words'], 'readwrite');
      const store = tx.objectStore('contributions');
      const getReq = store.get(id);

      getReq.onsuccess = () => {
        const record: ContributionRecord = getReq.result;
        if (!record) {
          resolve(false);
          return;
        }

        record.status = status;
        record.reviewedAt = new Date().toISOString();
        store.put(record);

        // If approved, dynamically inject into custom words store
        if (status === 'approved') {
          const customStore = tx.objectStore('custom_words');
          const customWord: CustomWordRecord = {
            id: `word_${Date.now()}`,
            hindi: record.sourceHindi,
            santaliOlChiki: record.targetSantaliOlChiki,
            santaliPhoneticHi: record.targetSantaliPhoneticHi,
            category: record.category || 'Community Added',
            addedAt: new Date().toISOString(),
          };
          customStore.put(customWord);
        }

        resolve(true);
      };

      getReq.onerror = () => reject(getReq.error);
    });
  }

  // ----------------------------------------------------
  // 4. CUSTOM DICTIONARY WORDS
  // ----------------------------------------------------
  public async getCustomWords(): Promise<CustomWordRecord[]> {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('custom_words', 'readonly');
        const store = tx.objectStore('custom_words');
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch {
      return [];
    }
  }

  // ----------------------------------------------------
  // 5. DATABASE EXPORT & IMPORT (FOR SHARED TABLETS)
  // ----------------------------------------------------
  public async exportDatabaseJSON(): Promise<string> {
    const profiles = await this.getTeacherProfiles();
    const progress = await this.getStudentProgressLogs();
    const contributions = await this.getContributions();
    const customWords = await this.getCustomWords();

    const dump = {
      exportedAt: new Date().toISOString(),
      appVersion: '2.0.0',
      profiles,
      progress,
      contributions,
      customWords,
    };

    return JSON.stringify(dump, null, 2);
  }
}

export const dbService = new DatabaseService();
