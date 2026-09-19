import React, { useState } from 'react';
import { sfx } from '../utils/sfx';
import { cloudSyncService } from '../services/cloudSyncService';

const DISTRICTS = [
  'All Districts', 'Ranchi', 'Dumka', 'East Singhbhum', 'West Singhbhum', 'Pakur',
  'Jamtara', 'Deoghar', 'Godda', 'Sahebganj', 'Hazaribagh', 'Dhanbad', 'Bokaro'
];

interface MockReport {
  id: string;
  district: string;
  schoolName: string;
  studentCount: number;
  avgScore: number;
  flnGrade: string;
  lastActive: string;
}

const MOCK_GOVT_REPORTS: MockReport[] = [
  { id: '1', district: 'Ranchi', schoolName: 'Govt Primary School Harmu', studentCount: 42, avgScore: 88, flnGrade: 'Grade 1-2', lastActive: '2 mins ago' },
  { id: '2', district: 'Dumka', schoolName: 'GPS Jamtara Road', studentCount: 35, avgScore: 92, flnGrade: 'Grade 2-3', lastActive: '15 mins ago' },
  { id: '3', district: 'East Singhbhum', schoolName: 'GPS Ghatshila', studentCount: 28, avgScore: 84, flnGrade: 'Grade 1', lastActive: '1 hour ago' },
  { id: '4', district: 'Pakur', schoolName: 'GPS Amrapara', studentCount: 50, avgScore: 79, flnGrade: 'Grade 1-3', lastActive: '3 hours ago' },
  { id: '5', district: 'Ranchi', schoolName: 'GPS Ratu', studentCount: 31, avgScore: 90, flnGrade: 'Grade 2', lastActive: 'Yesterday' },
];

export const GovtMonitoringDashboard: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [searchSchool, setSearchSchool] = useState('');

  const filteredReports = MOCK_GOVT_REPORTS.filter((rep) => {
    const matchDist = selectedDistrict === 'All Districts' || rep.district === selectedDistrict;
    const matchSchool = rep.schoolName.toLowerCase().includes(searchSchool.toLowerCase());
    return matchDist && matchSchool;
  });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%)',
          borderRadius: '20px',
          padding: '1.75rem',
          color: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(30,58,138,0.4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
            🏛️
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, margin: 0 }}>
              Govt. Monitoring Portal (झारखंड शिक्षा पोर्टल)
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', opacity: 0.9 }}>
              District & School level FLN student progress analytics synced via Supabase/Firebase REST.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px 14px', borderRadius: '12px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Network Status:</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, padding: '3px 8px', borderRadius: '8px', backgroundColor: cloudSyncService.getIsOnline() ? '#10b981' : '#f59e0b', color: '#ffffff' }}>
            {cloudSyncService.getIsOnline() ? '🟢 Online' : '🟠 Offline Queue (' + cloudSyncService.getPendingCount() + ')'}
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div
        style={{
          backgroundColor: 'var(--card-bg, #ffffff)',
          borderRadius: '16px',
          padding: '1.25rem',
          border: '1px solid var(--border-subtle, #e2e8f0)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
            📍 Select District:
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => { sfx.playTap(); setSelectedDistrict(e.target.value); }}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
            🏫 Search School Name:
          </label>
          <input
            type="text"
            value={searchSchool}
            onChange={(e) => setSearchSchool(e.target.value)}
            placeholder="Type school name e.g. GPS Harmu..."
            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
          />
        </div>
      </div>

      {/* Data Table */}
      <div
        style={{
          backgroundColor: 'var(--card-bg, #ffffff)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid var(--border-subtle, #e2e8f0)',
          boxShadow: 'var(--shadow-md)',
          overflowX: 'auto',
        }}
      >
        <h3 style={{ margin: '0 0 1rem', color: '#0f172a', fontSize: '1.1rem', fontWeight: 800 }}>
          📊 Active School Literacy & Participation Index ({filteredReports.length} Schools Found)
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '10px' }}>School Name</th>
              <th style={{ padding: '10px' }}>District</th>
              <th style={{ padding: '10px' }}>Grade Level</th>
              <th style={{ padding: '10px' }}>Students</th>
              <th style={{ padding: '10px' }}>FLN Accuracy</th>
              <th style={{ padding: '10px' }}>Last Sync</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((rep) => (
              <tr key={rep.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 10px', fontWeight: 700, color: '#0f172a' }}>{rep.schoolName}</td>
                <td style={{ padding: '12px 10px', color: '#475569' }}>📍 {rep.district}</td>
                <td style={{ padding: '12px 10px', color: '#6b21a8', fontWeight: 700 }}>{rep.flnGrade}</td>
                <td style={{ padding: '12px 10px', fontWeight: 700 }}>👧 {rep.studentCount}</td>
                <td style={{ padding: '12px 10px' }}>
                  <span style={{ backgroundColor: rep.avgScore >= 85 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: rep.avgScore >= 85 ? '#047857' : '#b45309', padding: '4px 10px', borderRadius: '8px', fontWeight: 800 }}>
                    {rep.avgScore}% Match
                  </span>
                </td>
                <td style={{ padding: '12px 10px', color: '#94a3b8', fontSize: '0.8rem' }}>{rep.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GovtMonitoringDashboard;
