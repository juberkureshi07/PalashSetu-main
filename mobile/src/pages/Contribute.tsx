import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sfx } from '../utils/sfx';
import { contributionService } from '../services/contributionService';

export const Contribute: React.FC = () => {
  const [contributionType, setContributionType] = useState<'new_phrase' | 'correction'>('new_phrase');
  const [sourceTextHi, setSourceTextHi] = useState('');
  const [targetTextSantali, setTargetTextSantali] = useState('');
  const [contributorRole, setContributorRole] = useState<'community' | 'teacher'>('community');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceTextHi.trim() || !targetTextSantali.trim()) return;

    sfx.playSuccess();
    contributionService.submitContribution({
      contributionType,
      sourceTextHi,
      targetTextSantali,
      contributorRole,
    });

    setSubmittedSuccess(true);
    setSourceTextHi('');
    setTargetTextSantali('');

    setTimeout(() => setSubmittedSuccess(false), 4000);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
          borderRadius: '20px',
          padding: '1.75rem',
          color: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(16,185,129,0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.8rem' }}>
            🤝
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
              Community Contribution (ᱜᱚᱲᱚ ᱥᱟᱠᱟᱢ)
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', opacity: 0.9 }}>
              Contribute new phrases or correct translations to enrich Santali education.
            </p>
          </div>
        </div>

        <Link
          to="/contribute/review"
          onClick={() => sfx.playTap()}
          style={{
            backgroundColor: '#ffffff',
            color: '#047857',
            padding: '8px 16px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.85rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>🛡️ Teacher Review Gate</span>
          <span style={{ backgroundColor: '#10b981', color: '#fff', padding: '2px 6px', borderRadius: '10px', fontSize: '0.7rem' }}>
            {contributionService.getPendingCount()}
          </span>
        </Link>
      </div>

      {/* Moderation Privacy Guarantee Box */}
      <div
        style={{
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '16px',
          padding: '1rem 1.25rem',
          fontSize: '0.85rem',
          color: 'var(--text-main)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>🔒</span>
        <div>
          <strong>Privacy & Moderation Gate Policy:</strong>
          <div style={{ color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.45 }}>
            Submissions are stored locally with <strong>pending</strong> status. They must be reviewed and approved by a teacher in the Teacher Review Gate before affecting live translation results. No personal names or identity tracking details are stored.
          </div>
        </div>
      </div>

      {/* Contribution Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: 'var(--card-bg)',
          borderRadius: '20px',
          padding: '2rem',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {/* Type Selector */}
        <div>
          <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
            1. Select Contribution Type:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              onClick={() => { sfx.playTap(); setContributionType('new_phrase'); }}
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: contributionType === 'new_phrase' ? '2px solid #10b981' : '1px solid var(--border-subtle)',
                backgroundColor: contributionType === 'new_phrase' ? 'rgba(16,185,129,0.12)' : 'var(--surface-bg)',
                color: contributionType === 'new_phrase' ? '#10b981' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              ➕ Add New Phrase
            </button>
            <button
              type="button"
              onClick={() => { sfx.playTap(); setContributionType('correction'); }}
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: contributionType === 'correction' ? '2px solid #10b981' : '1px solid var(--border-subtle)',
                backgroundColor: contributionType === 'correction' ? 'rgba(16,185,129,0.12)' : 'var(--surface-bg)',
                color: contributionType === 'correction' ? '#10b981' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              ✏️ Correct Existing Word
            </button>
          </div>
        </div>

        {/* Hindi Source Input */}
        <div>
          <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
            2. Hindi Phrase (हिंदी वाक्य / शब्द):
          </label>
          <input
            type="text"
            required
            value={sourceTextHi}
            onChange={(e) => setSourceTextHi(e.target.value)}
            placeholder="e.g. हमारा गाँव, पानी लाओ, अच्छा काम"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--surface-bg)',
              color: 'var(--text-main)',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Santali Target Input */}
        <div>
          <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
            3. Santali Ol Chiki / Spoken Translation (ᱥᱟᱱᱛᱟᱲᱤ ᱚᱞ ᱪᱤᱠᱤ):
          </label>
          <input
            type="text"
            required
            value={targetTextSantali}
            onChange={(e) => setTargetTextSantali(e.target.value)}
            placeholder="e.g. ᱟᱵᱚᱣᱟᱜ ᱟᱹᱛᱩ / आबोवाग आतु"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--surface-bg)',
              color: 'var(--text-main)',
              fontSize: '1.1rem',
              fontWeight: 700,
              outline: 'none',
            }}
          />
        </div>

        {/* Contributor Role Selector */}
        <div>
          <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
            4. My Role (Contributor Classification):
          </label>
          <select
            value={contributorRole}
            onChange={(e) => setContributorRole(e.target.value as any)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--surface-bg)',
              color: 'var(--text-main)',
              fontSize: '0.95rem',
              fontWeight: 600,
              outline: 'none',
            }}
          >
            <option value="community">🏘️ Community Speaker / Volunteer</option>
            <option value="teacher">👨‍🏫 Registered School Teacher</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            backgroundColor: '#10b981',
            color: '#ffffff',
            border: 'none',
            padding: '14px',
            borderRadius: '14px',
            fontSize: '1rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 6px 16px rgba(16,185,129,0.3)',
            marginTop: '0.5rem',
          }}
        >
          🚀 Submit for Teacher Moderation Gate
        </button>

        {submittedSuccess && (
          <div className="fade-in" style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '12px 16px', borderRadius: '12px', fontWeight: 700, textAlign: 'center' }}>
            ✅ Contribution submitted successfully! Marked as <strong>PENDING</strong> for Teacher Review.
          </div>
        )}
      </form>
    </div>
  );
};

export default Contribute;
