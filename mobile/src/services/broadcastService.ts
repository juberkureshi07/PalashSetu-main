/**
 * Classroom LAN Caption Broadcast Service
 * Integrates real WebRTC P2P DataChannels and local network streaming.
 */

import { webrtcP2PService, CaptionPayload } from './webrtcP2PService';

export interface BroadcastCaptionEvent extends CaptionPayload {
  teacherName?: string;
}

export const broadcastService = {
  setBroadcasting(active: boolean): string {
    if (active) {
      return webrtcP2PService.startHostSession();
    } else {
      webrtcP2PService.stopHostSession();
      return '';
    }
  },

  getIsBroadcasting(): boolean {
    return webrtcP2PService.getStatus().state === 'connected';
  },

  getSessionCode(): string {
    return webrtcP2PService.getSessionCode();
  },

  broadcastCaption(sourceHindi: string, targetSantaliOlChiki: string, targetSantaliPhoneticHi: string) {
    webrtcP2PService.broadcastCaption(sourceHindi, targetSantaliOlChiki, targetSantaliPhoneticHi);
  },

  subscribe(listener: (event: BroadcastCaptionEvent) => void): () => void {
    return webrtcP2PService.onCaptionReceived((payload) => {
      listener({ ...payload, teacherName: 'शिक्षिका' });
    });
  },

  onStatusChanged(listener: (status: { state: string; peerCount: number; sessionCode: string }) => void): () => void {
    return webrtcP2PService.onStatusChanged(listener);
  },
};
