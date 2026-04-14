import React from 'react';

export default function KeikoBox({ message }) {
  if (!message) return null;
  return (
    <div className="keiko-box">
      <div className="keiko-avatar" aria-hidden>
        K
      </div>
      <div>
        <p className="keiko-name">Keiko</p>
        <p>{message}</p>
      </div>
    </div>
  );
}
