import React from 'react';

const text = 'Website designed & created by Great Escape Web & Business Services LLC';
// Repeat enough times to fill any screen width
const items = Array(12).fill(text);

export default function Ticker() {
  return (
    <div style={{
      background: '#111',
      borderTop: '1px solid #222',
      overflow: 'hidden',
      height: 36,
      display: 'flex',
      alignItems: 'center',
    }}>
      <div style={{
        display: 'flex',
        whiteSpace: 'nowrap',
        animation: 'ticker 60s linear infinite',
      }}>
        {items.map((t, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
            <a
              href="https://greatescapewebservices.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 11,
                color: '#555',
                textDecoration: 'none',
                letterSpacing: '0.08em',
                transition: 'color 0.15s',
                paddingRight: 0,
              }}
              onMouseEnter={e => e.target.style.color = '#C17F24'}
              onMouseLeave={e => e.target.style.color = '#555'}
            >
              {t}
            </a>
            <span style={{ color: '#333', margin: '0 24px', fontSize: 10 }}>✦</span>
          </span>
        ))}
      </div>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
