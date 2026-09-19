/**
 * Community Content Contribution & Offline Moderation Service
 * Manages submitted contributions, pending state, teacher approval gates,
 * and dynamic injection into active in-memory dictionary.
 */

import { COMPREHENSIVE_HINDI_TO_SANTALI } from '../data/santali_comprehensive_dictionary';

export interface ContributionItem {
  id: string;
  contributionType: 'new_phrase' | 'correction';
  sourceTextHi: string;
  targetTextSantali: string;
  audioPath?: string;
  lang: string;
  contributorRole: 'teacher' | 'community';
  status: 'pending' | 'approved' | 'rejected';
  ts: number;
  synced: number;
}

const STORAGE_KEY = 'bhashagyan_community_contributions';

export const contributionService = {
  // Get all contributions from localStorage
  getContributions(): ContributionItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  // Save contributions list to localStorage
  saveContributions(list: ContributionItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save contributions', e);
    }
  },

  // Submit a new contribution (Default status: 'pending')
  submitContribution(data: {
    contributionType: 'new_phrase' | 'correction';
    sourceTextHi: string;
    targetTextSantali: string;
    contributorRole: 'teacher' | 'community';
    audioPath?: string;
  }): ContributionItem {
    const list = this.getContributions();
    const newItem: ContributionItem = {
      id: 'contrib_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      contributionType: data.contributionType,
      sourceTextHi: data.sourceTextHi.trim(),
      targetTextSantali: data.targetTextSantali.trim(),
      audioPath: data.audioPath,
      lang: 'sat_Olck',
      contributorRole: data.contributorRole,
      status: 'pending', // Mandatory moderation gate
      ts: Date.now(),
      synced: 0,
    };

    list.unshift(newItem);
    this.saveContributions(list);
    return newItem;
  },

  // Teacher approves a contribution
  approveContribution(id: string): boolean {
    const list = this.getContributions();
    const item = list.find((c) => c.id === id);
    if (!item) return false;

    item.status = 'approved';
    this.saveContributions(list);

    // Dynamically inject approved contribution into active live dictionary lookup
    if (item.sourceTextHi && item.targetTextSantali) {
      COMPREHENSIVE_HINDI_TO_SANTALI[item.sourceTextHi.toLowerCase()] = item.targetTextSantali;
    }
    return true;
  },

  // Teacher rejects a contribution
  rejectContribution(id: string): boolean {
    const list = this.getContributions();
    const item = list.find((c) => c.id === id);
    if (!item) return false;

    item.status = 'rejected';
    this.saveContributions(list);
    return true;
  },

  // Get pending contributions count for teacher badge
  getPendingCount(): number {
    return this.getContributions().filter((c) => c.status === 'pending').length;
  },

  // Initialize and load already approved contributions into dictionary cache
  loadApprovedIntoCache(): void {
    const approved = this.getContributions().filter((c) => c.status === 'approved');
    approved.forEach((item) => {
      if (item.sourceTextHi && item.targetTextSantali) {
        COMPREHENSIVE_HINDI_TO_SANTALI[item.sourceTextHi.toLowerCase()] = item.targetTextSantali;
      }
    });
  },
};

// Auto-run cache injection on module import
contributionService.loadApprovedIntoCache();
