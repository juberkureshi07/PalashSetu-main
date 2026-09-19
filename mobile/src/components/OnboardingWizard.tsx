import React, { useState } from 'react';
import { sfx } from '../utils/sfx';

export interface UserProfile {
  role: 'student' | 'teacher';
  name: string;
  schoolName: string;
  district: string;
  // Student fields
  grade?: string;
  rollNo?: string;
  // Teacher fields
  teacherId?: string;
  block?: string;
  onboardedAt: string;
}

interface OnboardingWizardProps {
  onComplete: (profile: UserProfile) => void;
}

const DISTRICTS = [
  'Ranchi', 'Dumka', 'East Singhbhum', 'West Singhbhum', 'Pakur',
  'Jamtara', 'Deoghar', 'Godda', 'Sahebganj', 'Hazaribagh',
  'Giridih', 'Dhanbad', 'Bokaro', 'Palamu', 'Garhwa', 'Chatra',
  'Latehar', 'Ramgarh', 'Koderma', 'Khunti', 'Simdega', 'Gumla', 'Lohardaga', 'Seraikela Kharsawan'
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // App Info Carousel Slide
  const [infoSlide, setInfoSlide] = useState(0);
  const infoSlides = [
    {
      icon: '📚',
      title: 'Mother Tongue Education (MTB-MLE)',
      desc: 'Bhasha Gyan bridges Hindi textbooks and Santali Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ) mother tongue for rural primary students.'
    },
    {
      icon: '📡',
      title: '100% Offline & Hotspot Sync',
      desc: 'No internet required! Connect classroom tablets using simple 6-digit PIN or QR code scanning.'
    },
    {
      icon: '🎙️',
      title: 'Voice Pronunciation Coach',
      desc: 'Instant soundwave comparison (Dynamic Time Warping) gives teachers real-time rhythm feedback in under 5ms.'
    }
  ];

  // Step 2: Terms & Privacy
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Step 3: Role Selection
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');

  // Step 4: Profile Details
  const [name, setName] = useState('');
  const [schoolName, setSchoolName] = useState('Govt. Primary School');
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [grade, setGrade] = useState('Grade 1');
  const [rollNo, setRollNo] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [block, setBlock] = useState('Central');

  const handleNextInfo = () => {
    sfx.playTap();
    if (infoSlide < infoSlides.length - 1) {
      setInfoSlide(infoSlide + 1);
    } else {
      setStep(2);
    }
  };

  const handleAgreeTerms = () => {
    if (!agreedTerms) return;
    sfx.playTap();
    setStep(3);
  };

  const handleSelectRole = (role: 'student' | 'teacher') => {
    sfx.playTap();
    setSelectedRole(role);
    setStep(4);
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    sfx.playSuccess();
    const profile: UserProfile = {
      role: selectedRole,
      name,
      schoolName,
      district,
      grade: selectedRole === 'student' ? grade : undefined,
      rollNo: selectedRole === 'student' ? rollNo : undefined,
      teacherId: selectedRole === 'teacher' ? teacherId : undefined,
      block: selectedRole === 'teacher' ? block : undefined,
      onboardedAt: new Date().toISOString()
    };

    localStorage.setItem('bhashagyan_user_profile', JSON.stringify(profile));
    onComplete(profile);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9998,
        backgroundColor: 'var(--bg-gradient-start, #0f172a)',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        color: '#ffffff',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '2rem',
          color: '#0f172a',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        {/* Step Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Setup Wizard • Step {step} of 4
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: '24px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: step >= i ? '#3b82f6' : '#cbd5e1',
                  transition: 'backgroundColor 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: App Info Showcase Carousel */}
        {step === 1 && (
          <div className="fade-in" style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '24px',
                backgroundColor: 'rgba(59, 130, 246, 0.12)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                marginBottom: '1rem',
              }}
            >
              {infoSlides[infoSlide].icon}
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
              {infoSlides[infoSlide].title}
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, margin: '0 0 2rem' }}>
              {infoSlides[infoSlide].desc}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {infoSlides.map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: infoSlide === idx ? '#3b82f6' : '#cbd5e1',
                    }}
                  />
                ))}
              </div>

              <button
                onClick={handleNextInfo}
                style={{
                  padding: '12px 24px',
                  borderRadius: '14px',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                }}
              >
                {infoSlide < infoSlides.length - 1 ? 'Next ➔' : 'Continue ➔'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Terms & Conditions & Privacy Policy */}
        {step === 2 && (
          <div className="fade-in">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
              📜 Terms & Data Privacy Policy
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1rem' }}>
              Please review and accept our privacy policy to proceed to classroom setup.
            </p>

            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1rem',
                fontSize: '0.82rem',
                color: '#334155',
                maxHeight: '180px',
                overflowY: 'auto',
                lineHeight: 1.5,
                marginBottom: '1.25rem',
              }}
            >
              <strong>1. Offline Data Privacy:</strong> Bhasha Gyan stores your profile and progress locally on your device. Zero personal data is sold or shared with third parties.<br /><br />
              <strong>2. Government Portal Sync:</strong> When your device connects to the internet, anonymous progress analytics (school name, district, literacy scores) queue into the Government Monitoring Portal.<br /><br />
              <strong>3. Classroom P2P Sync:</strong> Teacher & student devices communicate over local Wi-Fi or mobile hotspot using short 6-digit session codes.
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', cursor: 'pointer', marginBottom: '1.5rem' }}>
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }}
              />
              I agree to the Terms of Service & Privacy Policy
            </label>

            <button
              onClick={handleAgreeTerms}
              disabled={!agreedTerms}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                backgroundColor: agreedTerms ? '#3b82f6' : '#94a3b8',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: agreedTerms ? 'pointer' : 'not-allowed',
                boxShadow: agreedTerms ? '0 4px 14px rgba(59, 130, 246, 0.3)' : 'none',
              }}
            >
              Accept & Select Role ➔
            </button>
          </div>
        )}

        {/* STEP 3: Role Selection */}
        {step === 3 && (
          <div className="fade-in">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px', textAlign: 'center' }}>
              👤 Select Your Role
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1.5rem', textAlign: 'center' }}>
              Choose your profile type to customize your classroom experience.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => handleSelectRole('student')}
                style={{
                  padding: '1.5rem 1rem',
                  borderRadius: '16px',
                  border: '2px solid #3b82f6',
                  backgroundColor: 'rgba(59, 130, 246, 0.06)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '8px' }}>👧</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e40af' }}>Student</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                  Play games, practice Ol Chiki & join class
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole('teacher')}
                style={{
                  padding: '1.5rem 1rem',
                  borderRadius: '16px',
                  border: '2px solid #8b5cf6',
                  backgroundColor: 'rgba(139, 92, 246, 0.06)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '8px' }}>👨‍🏫</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#6b21a8' }}>Teacher</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                  Broadcast lessons & monitor connected class
                </div>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Profile Creation Form */}
        {step === 4 && (
          <form onSubmit={handleSubmitProfile} className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>
              {selectedRole === 'student' ? '👧 Create Student Profile' : '👨‍🏫 Create Teacher Profile'}
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
              Stored locally on device and synced to Govt Portal when online.
            </p>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Full Name (नाम):
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={selectedRole === 'student' ? 'e.g. Priyanshu Kumar' : 'e.g. Ramesh Chandra'}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  District (जिला):
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  School Name (स्कूल):
                </label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="e.g. GPS Harmu"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
            </div>

            {selectedRole === 'student' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Grade / Class:
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  >
                    <option value="Grade 1">Grade 1 (कक्षा 1)</option>
                    <option value="Grade 2">Grade 2 (कक्षा 2)</option>
                    <option value="Grade 3">Grade 3 (कक्षा 3)</option>
                    <option value="Grade 4">Grade 4 (कक्षा 4)</option>
                    <option value="Grade 5">Grade 5 (कक्षा 5)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Roll Number:
                  </label>
                  <input
                    type="text"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="e.g. 12"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Teacher Govt ID / Emp No.:
                  </label>
                  <input
                    type="text"
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    placeholder="e.g. TCH-8821"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Block:
                  </label>
                  <input
                    type="text"
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    placeholder="e.g. Ratu Block"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              style={{
                marginTop: '0.5rem',
                padding: '14px',
                borderRadius: '14px',
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
              }}
            >
              🚀 Finish Setup & Launch App
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default OnboardingWizard;
