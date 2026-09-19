import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sfx } from '../utils/sfx';
import { contributionService, ContributionItem } from '../services/contributionService';

export const ContributionReview: React.FC = () => {
  const [contributions, setContributions] = useState<ContributionItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

  const refreshList = () => {
    setContributions(contributionService.getContributions());
  };

  useEffect(() => {
    refreshList();
  }, []);

  const handleApprove = (id: string) => {
    sfx.playSuccess();
    contributionService.approveContribution(id);
    refreshList();
  };

  const handleReject = (id: string) => {
    sfx.playTap();
    contributionService.rejectContribution(id);
    refreshList();
  };

  const filteredItems = contributions.filter((item) => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f2744 0%, #1e3a5f 100%)',
          borderRadius: '20px',
          padding: '1.75rem',
          color: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(15,39,68,0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
            🛡️
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
              Teacher Moderation Gate (ᱥᱟᱯᱲᱟᱣ)
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', opacity: 0.9 }}>
              Review community-submitted translations before approving into live dictionary.
            </p>
          </div>
        </div>

        <Link
          to="/contribute"
          onClick={() => sfx.playTap()}
          style={{
            backgroundColor: '#10b981',
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.85rem',
            textDecoration: 'none',
          }}
        >
          ➕ Submit Contribution
        </Link>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {(['pending', 'approved', 'rejected', 'all'] as const).map((status) => (
          <button
            key={status}
            onClick={() => { sfx.playTap(); setFilterStatus(status); }}
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              border: filterStatus === status ? '2px solid #0f2744' : '1px solid var(--border-subtle)',
              backgroundColor: filterStatus === status ? '#0f2744' : 'var(--card-bg)',
              color: filterStatus === status ? '#ffffff' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {status} ({contributions.filter((c) => status === 'all' || c.status === status).length})
          </button>
        ))}
      </div>

      {/* Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredItems.length === 0 ? (
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              borderRadius: '16px',
              padding: '2.5rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📭</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>No {filterStatus} contributions found</div>
            <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
              Submissions from community volunteers will appear here for teacher moderation.
            </div>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--card-bg)',
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '8px',
                      backgroundColor: item.contributionType === 'new_phrase' ? '#e0e7ff' : '#fef3c7',
                      color: item.contributionType === 'new_phrase' ? '#3730a3' : '#92400e',
                    }}
                  >
                    {item.contributionType === 'new_phrase' ? 'NEW PHRASE' : 'CORRECTION'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Role: <strong>{item.contributorRole}</strong> • {new Date(item.ts).toLocaleDateString()}
                  </span>
                </div>

                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {item.sourceTextHi}
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                  {item.targetTextSantali}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {item.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(item.id)}
                      style={{
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '10px',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                      }}
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '10px',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                      }}
                    >
                      ❌ Reject
                    </button>
                  </>
                )}

                {item.status === 'approved' && (
                  <span style={{ color: '#10b981', fontWeight: 800, fontSize: '0.9rem' }}>
                    🟢 Approved & Injected to Live NLP
                  </span>
                )}

                {item.status === 'rejected' && (
                  <span style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.9rem' }}>
                    🔴 Rejected
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContributionReview;
