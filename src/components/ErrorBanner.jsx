import React from 'react';

const ErrorBanner = ({ message, onClose, compact = false }) => {
    if (!message) return null;

    return (
        <div
            style={{
                marginBottom: compact ? '10px' : '16px',
                padding: compact ? '8px 10px' : '10px 12px',
                borderRadius: 8,
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                fontSize: compact ? '12px' : '13px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
            }}
        >
            <span style={{ marginTop: 1 }}>
                <i className="fas fa-exclamation-circle" />
            </span>
            <div style={{ flex: 1 }}>{message}</div>
            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: '#b91c1c',
                        padding: 0,
                        fontSize: '12px',
                    }}
                    aria-label="Dismiss error"
                >
                    <i className="fas fa-times" />
                </button>
            )}
        </div>
    );
};

export default ErrorBanner;

