/**
 * Classroom LAN Caption Broadcast Service
 * Broadcasts live translation events from the teacher tablet to student devices on the local network.
 */

export interface BroadcastCaptionEvent {
  id: string;
  sourceHindi: string;
  targetSantaliOlChiki: string;
  targetSantaliPhoneticHi: string;
  timestamp: number;
  teacherName: string;
}

type CaptionListener = (event: BroadcastCaptionEvent) => void;

class BroadcastServiceManager {
  private channel: BroadcastChannel | null = null;
  private listeners: CaptionListener[] = [];
  private isBroadcasting: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel('setuvani_classroom_broadcast');
      this.channel.onmessage = (msgEvent) => {
        if (msgEvent.data && msgEvent.data.type === 'CAPTION_BROADCAST') {
          this.notifyListeners(msgEvent.data.payload);
        }
      };
    }

    // Storage fallback for cross-tab local network sync
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'setuvani_live_caption_broadcast' && e.newValue) {
          try {
            const payload = JSON.parse(e.newValue);
            this.notifyListeners(payload);
          } catch (err) {
            console.error('Failed to parse broadcast payload', err);
          }
        }
      });
    }
  }

  // Teacher toggles broadcast session
  setBroadcasting(active: boolean) {
    this.isBroadcasting = active;
  }

  getIsBroadcasting(): boolean {
    return this.isBroadcasting;
  }

  // Teacher emits live translation caption to connected students
  broadcastCaption(sourceHindi: string, targetSantaliOlChiki: string, targetSantaliPhoneticHi: string, teacherName: string = 'Sunita Kumari') {
    const payload: BroadcastCaptionEvent = {
      id: 'cap_' + Date.now(),
      sourceHindi,
      targetSantaliOlChiki,
      targetSantaliPhoneticHi,
      timestamp: Date.now(),
      teacherName,
    };

    if (this.channel) {
      this.channel.postMessage({ type: 'CAPTION_BROADCAST', payload });
    }

    // Storage fallback trigger
    try {
      localStorage.setItem('setuvani_live_caption_broadcast', JSON.stringify(payload));
    } catch (e) {
      console.error('Failed broadcast storage write', e);
    }

    this.notifyListeners(payload);
  }

  // Student device subscribes to incoming captions
  subscribe(listener: CaptionListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(payload: BroadcastCaptionEvent) {
    this.listeners.forEach((l) => l(payload));
  }
}

export const broadcastService = new BroadcastServiceManager();
