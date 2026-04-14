import React from 'react';

export default function SummaryScreen({ progress, onBackHome }) {
  return (
    <div className="card">
      <h2>Session Summary</h2>
      <p>Effort Streak: <strong>{progress.effortStreak}</strong></p>
      <p>Weak Area Attempts: <strong>{progress.weakAreaAttempts}</strong></p>
      <p>Skipped Tasks: <strong>{progress.skippedTasks}</strong></p>
      <p className="highlight">{progress.hiddenReveal}</p>
      <button onClick={onBackHome}>Back to Home</button>
    </div>
  );
}
