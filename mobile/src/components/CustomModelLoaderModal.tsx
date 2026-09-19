import React, { useState, useEffect } from 'react';
import { sfx } from '../utils/sfx';
import { customModelEngine, CustomModelMetadata } from '../utils/customModelEngine';

interface CustomModelLoaderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomModelLoaderModal: React.FC<CustomModelLoaderModalProps> = ({ isOpen, onClose }) => {
  const [activeModel, setActiveModel] = useState<CustomModelMetadata | null>(customModelEngine.getActiveModel());
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveModel(customModelEngine.getActiveModel());
      const unsubscribe = customModelEngine.subscribe((meta) => {
        setActiveModel(meta);
      });
      return unsubscribe;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg('');
    sfx.playTap();

    try {
      const meta = await customModelEngine.loadModelFromFile(file);
      sfx.playSuccess();
      setActiveModel(meta);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse custom model');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTestInference = () => {
    if (!testInput.trim()) return;
    sfx.playTap();
    const result = customModelEngine.translate(testInput);
    setTestResult(result || 'No match found in custom model dictionary.');
  };

  const handleUnload = () => {
    sfx.playTap();
    customModelEngine.unloadCustomModel();
    setTestResult(null);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="fade-in"
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'var(--card-bg, #ffffff)',
          borderRadius: '24px',
          padding: '2rem',
          color: 'var(--text-main, #0f172a)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          border: '1px solid var(--border-subtle, #e2e8f0)',
          position: 'relative',
        }}
      >
        <button
          onClick={() => { sfx.playTap(); onClose(); }}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#64748b',
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 4px', color: '#0f172a' }}>
            🧠 Custom AI Model Engine
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            Load & execute custom GGUF, ONNX, or JSON vocabulary models from storage.
          </p>
        </div>

        {/* Active Model Card */}
        {activeModel ? (
          <div
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '2px solid #10b981',
              borderRadius: '16px',
              padding: '1.25rem',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#10b981', color: '#ffffff', padding: '2px 8px', borderRadius: '6px' }}>
                  ACTIVE MODEL ({activeModel.format})
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#065f46', margin: '6px 0 2px' }}>
                  {activeModel.name}
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#047857' }}>
                  Vocabulary Count: <strong>{activeModel.vocabularyCount} words</strong> • Loaded at {activeModel.loadedAt}
                </div>
              </div>
              <button
                onClick={handleUnload}
                style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Unload
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '2px dashed #cbd5e1',
              borderRadius: '16px',
              padding: '1.5rem',
              textAlign: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📂</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
              No Custom Model Loaded
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 1rem' }}>
              Upload `.json`, `.onnx`, `.gguf`, or `.bin` model files from device storage.
            </p>

            <label
              style={{
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'inline-block',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              }}
            >
              {isUploading ? 'Loading Engine...' : '📁 Select Model File'}
              <input
                type="file"
                accept=".json,.onnx,.gguf,.bin"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        )}

        {errorMsg && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Test Inference Console */}
        {activeModel && (
          <div
            style={{
              backgroundColor: '#f8fafc',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1px solid #e2e8f0',
            }}
          >
            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
              ⚡ Test Live Model Inference:
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Enter word to test e.g. custom_greeting"
                style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
              />
              <button
                onClick={handleTestInference}
                style={{
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Run
              </button>
            </div>

            {testResult && (
              <div style={{ backgroundColor: '#ffffff', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                Output: <span style={{ color: '#8b5cf6', fontFamily: 'var(--font-santali)' }}>{testResult}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomModelLoaderModal;
