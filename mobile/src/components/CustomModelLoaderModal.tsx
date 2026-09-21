import React, { useState, useEffect } from 'react';
import { sfx } from '../utils/sfx';
import { customModelEngine, CustomModelMetadata, downloadInbuiltModelJson, downloadInbuiltModelOnnx } from '../utils/customModelEngine';

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
      setErrorMsg(err.message || 'Failed to parse custom model file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLoadSampleModel = async () => {
    setIsUploading(true);
    setErrorMsg('');
    sfx.playTap();

    try {
      const sampleDict = {
        "model_id": "indictrans2_sample_fln",
        "model_name": "Sample FLN Ol Chiki Neural Lexicon",
        "dictionary": {
          "नमस्ते": "ᱡᱚᱦᱟᱨ",
          "नमस्ते बच्चों!": "ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ!",
          "स्कूल": "ᱟᱥᱲᱟ",
          "किताब": "ᱯᱩᱛᱷᱤ",
          "कलम": "ᱠᱚᱞᱚᱢ",
          "पानी": "ᱫᱟᱜ",
          "शिक्षक": "ᱢᱟᱪᱮᱛ",
          "छात्र": "ᱪᱮᱛᱮᱫᱤᱭᱟᱹ",
          "अपनी किताब खोलो।": "ᱟᱢᱟᱜ ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ᱾",
          "आज हम एक से दस तक गिनती सीखेंगे।": "ᱛᱮᱦᱮᱧ ᱟᱵᱚ ᱢᱤᱫ ᱠᱷᱚᱱ ᱜᱮᱞ ᱦᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ ᱵᱚᱱ ᱪᱮᱫᱚᱜᱼᱟ᱾"
        }
      };
      const blob = new Blob([JSON.stringify(sampleDict, null, 2)], { type: 'application/json' });
      const sampleFile = new File([blob], 'bhashagyan_sample_lexicon.json', { type: 'application/json' });
      const meta = await customModelEngine.loadModelFromFile(sampleFile);
      sfx.playSuccess();
      setActiveModel(meta);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load sample model.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTestInference = () => {
    if (!testInput.trim()) return;
    sfx.playTap();
    const result = customModelEngine.translate(testInput);
    setTestResult(result || 'No match found in custom model vocabulary.');
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
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      {/* Android Material 3 Glassmorphic Card */}
      <div
        className="fade-in"
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          borderRadius: '28px',
          padding: '1.75rem',
          color: '#0f172a',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          border: '1px solid #e2e8f0',
          position: 'relative',
        }}
      >
        {/* Android Close Touch Target */}
        <button
          onClick={() => { sfx.playTap(); onClose(); }}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#f1f5f9',
            border: 'none',
            fontSize: '1.2rem',
            fontWeight: 800,
            cursor: 'pointer',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
          }}
        >
          ✕
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', paddingRight: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#e0e7ff', color: '#3730a3', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800, marginBottom: '6px' }}>
            <span>🤖 Android Material AI Engine</span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 900, margin: '4px 0', color: '#0f2744' }}>
            🧠 Local AI Neural Model Loader
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            Execute quantized ONNX, GGUF, JSON, or TXT vocabulary models 100% on-device.
          </p>
        </div>

        {/* Active Model Status Card */}
        {activeModel ? (
          <div
            style={{
              backgroundColor: '#ecfdf5',
              border: '2px solid #10b981',
              borderRadius: '20px',
              padding: '1.25rem',
              marginBottom: '1.25rem',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.12)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#10b981', color: '#ffffff', padding: '3px 9px', borderRadius: '8px' }}>
                    🟢 ACTIVE MODEL ({activeModel.format})
                  </span>
                  {activeModel.isInMemoryOnly && (
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f59e0b', color: '#ffffff', padding: '3px 8px', borderRadius: '8px' }}>
                      ⚡ RAM Memory
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#065f46', margin: '8px 0 4px' }}>
                  {activeModel.name}
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#047857' }}>
                  Vocabulary: <strong>{activeModel.vocabularyCount} entries</strong> • Loaded at {activeModel.loadedAt}
                </div>
              </div>
              <button
                onClick={handleUnload}
                style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
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
              borderRadius: '20px',
              padding: '1.25rem',
              textAlign: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ fontSize: '2.2rem', marginBottom: '4px' }}>⚙️</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
              Built-in Offline Model Engine Active
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 1rem' }}>
              Switch models below or download model assets for offline evaluation.
            </p>
          </div>
        )}

        {/* 1-Tap Model Engine Selector */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f2744', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>⚡ Select Pre-Installed Model:</span>
            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>100% Offline Ready</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
            {/* IndicTrans2 ONNX INT8 Card */}
            <div
              style={{
                backgroundColor: (activeModel as any)?.id === 'inbuilt_indictrans2_onnx' ? '#f0fdf4' : '#ffffff',
                border: (activeModel as any)?.id === 'inbuilt_indictrans2_onnx' ? '2px solid #10b981' : '1px solid #cbd5e1',
                borderRadius: '16px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, backgroundColor: '#0f2744', color: '#ffffff', padding: '2px 7px', borderRadius: '6px' }}>
                    ONNX INT8
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>38.4 MB Asset</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', marginBottom: '4px' }}>
                  🧠 IndicTrans2-Mobile ONNX
                </div>
                <div style={{ fontSize: '0.76rem', color: '#475569', marginBottom: '10px' }}>
                  Quantized neural network for high-accuracy translation.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => {
                    sfx.playTap();
                    const meta = customModelEngine.loadInbuiltIndicTrans2Onnx();
                    setActiveModel(meta);
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: (activeModel as any)?.id === 'inbuilt_indictrans2_onnx' ? '#10b981' : '#0f2744',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '8px',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  {(activeModel as any)?.id === 'inbuilt_indictrans2_onnx' ? '✓ Active' : '⚡ Activate'}
                </button>
                <button
                  onClick={() => { sfx.playTap(); downloadInbuiltModelOnnx(); }}
                  style={{
                    backgroundColor: '#e2e8f0',
                    color: '#334155',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '8px 10px',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                  title="Download .onnx binary model file"
                >
                  📥 Download
                </button>
              </div>
            </div>

            {/* FLN Lexicon Matrix Card */}
            <div
              style={{
                backgroundColor: (activeModel as any)?.id === 'inbuilt_fln_lexicon' || !activeModel ? '#f0fdf4' : '#ffffff',
                border: (activeModel as any)?.id === 'inbuilt_fln_lexicon' || !activeModel ? '2px solid #10b981' : '1px solid #cbd5e1',
                borderRadius: '16px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, backgroundColor: '#c05621', color: '#ffffff', padding: '2px 7px', borderRadius: '6px' }}>
                    JSON LEXICON
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>7,503 Words</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', marginBottom: '4px' }}>
                  ⚡ FLN Lexicon Matrix
                </div>
                <div style={{ fontSize: '0.76rem', color: '#475569', marginBottom: '10px' }}>
                  Ultra-fast sub-millisecond offline classroom dictionary.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => {
                    sfx.playTap();
                    const meta = customModelEngine.loadInbuiltFlnLexicon();
                    setActiveModel(meta);
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: (activeModel as any)?.id === 'inbuilt_fln_lexicon' || !activeModel ? '#10b981' : '#0f2744',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '8px',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  {(activeModel as any)?.id === 'inbuilt_fln_lexicon' || !activeModel ? '✓ Active' : '⚡ Activate'}
                </button>
                <button
                  onClick={() => { sfx.playTap(); downloadInbuiltModelJson(); }}
                  style={{
                    backgroundColor: '#e2e8f0',
                    color: '#334155',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '8px 10px',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                  title="Download .json model manifest file"
                >
                  📥 Download
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Custom Model Action Bar */}
        <div style={{ backgroundColor: '#f1f5f9', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.25rem', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
            📁 Load External Custom Model File:
          </div>
          <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 10px' }}>
            Supports `.json`, `.onnx`, `.gguf`, `.txt`, `.csv` model manifests up to 100MB.
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <label
              style={{
                flex: 1,
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                padding: '12px 18px',
                borderRadius: '14px',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>{isUploading ? '⏳ Reading Model File...' : '📁 Select Model File'}</span>
              <input
                type="file"
                accept=".json,.txt,.csv,.tsv,.onnx,.gguf,.bin"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>

            <button
              onClick={handleLoadSampleModel}
              disabled={isUploading}
              style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                padding: '12px 18px',
                borderRadius: '14px',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              }}
            >
              ✨ Load Demo Model
            </button>
          </div>
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Live Test Inference Console */}
        {activeModel && (
          <div
            style={{
              backgroundColor: '#0f172a',
              borderRadius: '18px',
              padding: '1.25rem',
              color: '#f8fafc',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8' }}>
                💻 Live Neural Engine Console Log Test
              </span>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Logs to Browser DevTools Console</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Enter word to test e.g. नमस्ते or अपनी किताब खोलो।"
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #334155',
                  backgroundColor: '#1e293b',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleTestInference}
                style={{
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Run Inference
              </button>
            </div>

            {testResult && (
              <div
                style={{
                  backgroundColor: '#1e293b',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #334155',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#e2e8f0',
                }}
              >
                Result: <span style={{ color: '#a78bfa', fontFamily: 'var(--font-santali)' }}>{testResult}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomModelLoaderModal;
