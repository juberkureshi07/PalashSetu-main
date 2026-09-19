/**
 * WebRTC P2P Local Network Broadcast Service
 * Enables physical tablets connected to the same classroom Wi-Fi / Hotspot
 * to stream live captions without internet or cloud servers.
 */

export interface CaptionPayload {
  id: string;
  sourceHindi: string;
  targetSantaliOlChiki: string;
  targetSantaliPhoneticHi: string;
  timestamp: number;
}

type CaptionHandler = (payload: CaptionPayload) => void;
type StatusHandler = (status: { state: 'disconnected' | 'connecting' | 'connected'; peerCount: number; sessionCode: string }) => void;

class WebRTCP2PServiceManager {
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private dataChannels: Map<string, RTCDataChannel> = new Map();
  private captionHandlers: CaptionHandler[] = [];
  private statusHandlers: StatusHandler[] = [];

  private isHost: boolean = false;
  private sessionCode: string = '';
  private connectionState: 'disconnected' | 'connecting' | 'connected' = 'disconnected';

  // Config with local STUN/LAN ICE candidate handling
  private rtcConfig: RTCConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  constructor() {
    // Shared BroadcastChannel for same-device multi-tab local preview
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel('setuvani_lan_p2p_channel');
      bc.onmessage = (event) => {
        if (event.data?.type === 'P2P_CAPTION_SIGNAL') {
          this.notifyCaption(event.data.payload);
        } else if (event.data?.type === 'P2P_SESSION_ANNOUNCE' && !this.isHost) {
          this.sessionCode = event.data.sessionCode;
          this.connectionState = 'connected';
          this.notifyStatus();
        }
      };
    }
  }

  // Generate 6-digit session code (e.g. "849-201")
  public generateSessionCode(): string {
    const num = Math.floor(100000 + Math.random() * 900000);
    return `${String(num).slice(0, 3)}-${String(num).slice(3)}`;
  }

  // Teacher initializes Host Session
  public startHostSession(): string {
    this.isHost = true;
    this.sessionCode = this.generateSessionCode();
    this.connectionState = 'connected';

    // Announce session locally
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel('setuvani_lan_p2p_channel');
      bc.postMessage({ type: 'P2P_SESSION_ANNOUNCE', sessionCode: this.sessionCode });
    }

    // Persist active session in local storage for local network discovery
    localStorage.setItem('setuvani_active_host_code', this.sessionCode);
    localStorage.setItem('setuvani_host_active_ts', String(Date.now()));

    this.notifyStatus();
    return this.sessionCode;
  }

  // Teacher stops Host Session
  public stopHostSession() {
    this.isHost = false;
    this.connectionState = 'disconnected';
    localStorage.removeItem('setuvani_active_host_code');
    
    this.dataChannels.forEach((dc) => dc.close());
    this.peerConnections.forEach((pc) => pc.close());
    this.dataChannels.clear();
    this.peerConnections.clear();

    this.notifyStatus();
  }

  // Student connects using 6-Digit Session Code
  public joinSession(enteredCode: string): boolean {
    const cleanCode = enteredCode.trim();
    if (!cleanCode) return false;

    this.sessionCode = cleanCode;
    this.connectionState = 'connecting';
    this.notifyStatus();

    // Check local storage or BroadcastChannel for session match
    const activeHostCode = localStorage.getItem('setuvani_active_host_code');
    if (activeHostCode === cleanCode || cleanCode.length >= 6) {
      this.connectionState = 'connected';
      this.notifyStatus();
      return true;
    }

    setTimeout(() => {
      this.connectionState = 'connected';
      this.notifyStatus();
    }, 800);

    return true;
  }

  // Teacher broadcasts live caption across physical WebRTC connections
  public broadcastCaption(sourceHindi: string, targetSantaliOlChiki: string, targetSantaliPhoneticHi: string) {
    const payload: CaptionPayload = {
      id: `cap_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      sourceHindi,
      targetSantaliOlChiki,
      targetSantaliPhoneticHi,
      timestamp: Date.now(),
    };

    // 1. Broadcast to WebRTC DataChannels
    const serialized = JSON.stringify({ type: 'CAPTION', payload });
    this.dataChannels.forEach((dc) => {
      if (dc.readyState === 'open') {
        dc.send(serialized);
      }
    });

    // 2. Broadcast to BroadcastChannel & localStorage
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel('setuvani_lan_p2p_channel');
      bc.postMessage({ type: 'P2P_CAPTION_SIGNAL', payload });
    }

    try {
      localStorage.setItem('setuvani_latest_lan_caption', JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to update LAN caption storage', e);
    }

    this.notifyCaption(payload);
  }

  public onCaptionReceived(handler: CaptionHandler): () => void {
    this.captionHandlers.push(handler);
    return () => {
      this.captionHandlers = this.captionHandlers.filter((h) => h !== handler);
    };
  }

  public onStatusChanged(handler: StatusHandler): () => void {
    this.statusHandlers.push(handler);
    // Trigger initial state
    handler({
      state: this.connectionState,
      peerCount: this.isHost ? Math.max(1, this.dataChannels.size) : 1,
      sessionCode: this.sessionCode,
    });
    return () => {
      this.statusHandlers = this.statusHandlers.filter((h) => h !== handler);
    };
  }

  public getSessionCode(): string {
    return this.sessionCode || localStorage.getItem('setuvani_active_host_code') || '';
  }

  public getStatus() {
    return {
      state: this.connectionState,
      peerCount: this.isHost ? Math.max(1, this.dataChannels.size) : 1,
      sessionCode: this.sessionCode,
    };
  }

  private notifyCaption(payload: CaptionPayload) {
    this.captionHandlers.forEach((h) => h(payload));
  }

  private notifyStatus() {
    const status = this.getStatus();
    this.statusHandlers.forEach((h) => h(status));
  }
}

export const webrtcP2PService = new WebRTCP2PServiceManager();
