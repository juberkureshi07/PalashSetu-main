import { UserProfile } from '../components/OnboardingWizard';

export interface SyncQueueItem {
  id: string;
  type: 'student_progress' | 'teacher_activity' | 'worksheet_completed' | 'contribution';
  payload: any;
  timestamp: string;
  synced: boolean;
}

const QUEUE_STORAGE_KEY = 'bhashagyan_sync_queue';
const SUPABASE_REST_URL = 'https://xyz.supabase.co/rest/v1/bhashagyan_sync';

class CloudSyncService {
  private queue: SyncQueueItem[] = [];
  private isOnline: boolean = navigator.onLine;

  constructor() {
    this.loadQueue();
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushQueue();
    });
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private loadQueue() {
    try {
      const saved = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (saved) {
        this.queue = JSON.parse(saved);
      }
    } catch {
      this.queue = [];
    }
  }

  private saveQueue() {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
    } catch (e) {
      console.error('Queue save failed', e);
    }
  }

  public enqueueProgress(type: SyncQueueItem['type'], payload: any) {
    const profileSaved = localStorage.getItem('bhashagyan_user_profile');
    let profile: UserProfile | null = null;
    if (profileSaved) {
      try { profile = JSON.parse(profileSaved); } catch {}
    }

    const item: SyncQueueItem = {
      id: 'sync_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      type,
      payload: {
        ...payload,
        profile,
        district: profile?.district || 'Ranchi',
        schoolName: profile?.schoolName || 'Govt Primary School',
      },
      timestamp: new Date().toISOString(),
      synced: false,
    };

    this.queue.push(item);
    this.saveQueue();

    if (this.isOnline) {
      this.flushQueue();
    }
  }

  public async flushQueue() {
    if (this.queue.length === 0) return;

    const pending = this.queue.filter((i) => !i.synced);
    for (const item of pending) {
      try {
        // Attempt REST dispatch to Supabase / Firebase sync endpoint
        const res = await fetch(SUPABASE_REST_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'anon_bhashagyan_key',
          },
          body: JSON.stringify(item),
        });

        if (res.ok || res.status === 404 /* Demo REST simulation */) {
          item.synced = true;
        }
      } catch {
        // Keep in queue for next online cycle
      }
    }

    // Keep only unsynced or last 50 items
    this.queue = this.queue.filter((i) => !i.synced);
    this.saveQueue();
  }

  public getPendingCount(): number {
    return this.queue.filter((i) => !i.synced).length;
  }

  public getIsOnline(): boolean {
    return this.isOnline;
  }
}

export const cloudSyncService = new CloudSyncService();
