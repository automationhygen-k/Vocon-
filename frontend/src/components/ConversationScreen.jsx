import React, { useState } from 'react';

export default function ConversationScreen({ task, tone, onToneChange, onSubmit, history, onFinish, targetLanguage }) {
  const [input, setInput] = useState('');

  const handleSend = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;
    await onSubmit(input.trim());
    setInput('');
  };

  return (
    <div className="card chat-card">
      <h2>{task.title}</h2>
      <p className="muted">{task.prompt}</p>
      <p className="muted">Reply in {targetLanguage}.</p>
      <label className="tone-label">
        Tone
        <select value={tone} onChange={(event) => onToneChange(event.target.value)}>
          <option value="friendly">Friendly</option>
          <option value="neutral">Neutral</option>
          <option value="confident">Confident</option>
        </select>
      </label>
      <div className="chat-window">
        {history.map((item, index) => (
          <div key={index} className={`chat-bubble ${item.role}`}>
            <p>{item.message}</p>
            {item.feedback && (
              <div className="feedback">
                <p><strong>Correction:</strong> {item.feedback.correction}</p>
                <p><strong>Better:</strong> {item.feedback.betterAlternative}</p>
                {item.feedback.toneVariation && <p><strong>Tone variant:</strong> {item.feedback.toneVariation}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
      <form className="composer" onSubmit={handleSend}>
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type your response in target language..." />
        <button type="submit">Send</button>
      </form>
      <button className="secondary" onClick={onFinish}>Finish Task</button>
    </div>
  );
}
