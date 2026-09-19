import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught exception caught by Bhasha Gyan ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetState = () => {
    try {
      localStorage.removeItem('bhashagyan_custom_model_meta');
      localStorage.removeItem('bhashagyan_custom_model_dict');
    } catch {}
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '1.5rem',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          <div
            style={{
              maxWidth: '520px',
              width: '100%',
              backgroundColor: '#1e293b',
              borderRadius: '24px',
              padding: '2rem',
              border: '1px solid #334155',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#f87171' }}>
              Something went wrong
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
              Bhasha Gyan trapped an unexpected runtime exception cleanly without crashing your tablet device.
            </p>

            {this.state.error && (
              <div
                style={{
                  backgroundColor: '#0f172a',
                  color: '#fca5a5',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textAlign: 'left',
                  marginBottom: '1.5rem',
                  fontFamily: 'monospace',
                  wordBreak: 'break-word',
                  maxHeight: '150px',
                  overflowY: 'auto',
                }}
              >
                Error: {this.state.error.message || this.state.error.toString()}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReload}
                style={{
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                🔄 Reload Application
              </button>
              <button
                onClick={this.handleResetState}
                style={{
                  backgroundColor: '#475569',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                🏠 Reset &amp; Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
