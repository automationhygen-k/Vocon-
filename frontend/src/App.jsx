import React, { useEffect, useMemo, useState } from 'react';
import TaskList from './components/TaskList';
import ConversationScreen from './components/ConversationScreen';
import SummaryScreen from './components/SummaryScreen';
import KeikoBox from './components/KeikoBox';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const localKeiko = {
  end: [
    'That was better than when you started. Don’t ignore that.',
    'You’re improving. Slowly… but it’s real.'
  ]
};

const targetLanguageOptions = [
  { code: 'ja', label: 'Japanese (日本語)' },
  { code: 'es', label: 'Spanish (Español)' },
  { code: 'ru', label: 'Russian (Русский)' }
];

export default function App() {
  const [screen, setScreen] = useState('duration');
  const [duration, setDuration] = useState(15);
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [tone, setTone] = useState('friendly');
  const [history, setHistory] = useState([]);
  const [keikoMessage, setKeikoMessage] = useState('');
  const [progress, setProgress] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [targetLanguage, setTargetLanguage] = useState('ja');
  const [languageLabel, setLanguageLabel] = useState('Japanese');

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  const mandatoryCount = useMemo(() => tasks.filter((task) => task.type === 'mandatory').length, [tasks]);

  const startSession = async (selectedDuration) => {
    setDuration(selectedDuration);
    const response = await fetch(`${API_BASE}/tasks?duration=${selectedDuration}&language=${targetLanguage}`);
    const data = await response.json();
    setTasks(data.tasks);
    setLanguageLabel(data.language?.name || 'Japanese');
    setKeikoMessage(data.keiko.start);
    setScreen('home');
  };

  const startTask = (task) => {
    setActiveTask(task);
    setHistory([{ role: 'npc', message: task.npcIntro }]);
    setScreen('conversation');
  };

  const submitResponse = async (text) => {
    const startedAt = Date.now();
    setHistory((prev) => [...prev, { role: 'user', message: text }]);
    const response = await fetch(`${API_BASE}/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId: activeTask.id,
        userText: text,
        tone,
        language: targetLanguage,
        responseTimeMs: 1000 + (Date.now() - startedAt)
      })
    });
    const data = await response.json();
    setHistory((prev) => [...prev, { role: 'npc', message: data.npcReply, feedback: data.feedback }]);
    if (data.keikoMoment) setKeikoMessage(data.keikoMoment);
  };

  const finishTask = async () => {
    const response = await fetch(`${API_BASE}/progress?language=${targetLanguage}`);
    const data = await response.json();
    setProgress(data);
    setKeikoMessage(data.keikoEnd || localKeiko.end[Math.floor(Math.random() * 2)]);
    setScreen('summary');
  };

  if (showIntro) {
    return (
      <div className="intro-scene">
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="earth" />
        <div className="flash" />
        <h1>vocon</h1>
      </div>
    );
  }

  return (
    <main className="app-shell">
      <header>
        <h1>vocon</h1>
        <p className="muted">Target language: {languageLabel}</p>
        <p className="muted">Mandatory tasks: {mandatoryCount}</p>
      </header>

      <KeikoBox message={keikoMessage} />

      {screen === 'duration' && (
        <div className="card">
          <h2>English Speaker Mode</h2>
          <p className="muted">Pick one language to learn in this session.</p>
          <label className="tone-label">
            Target language
            <select value={targetLanguage} onChange={(event) => setTargetLanguage(event.target.value)}>
              {targetLanguageOptions.map((language) => (
                <option key={language.code} value={language.code}>{language.label}</option>
              ))}
            </select>
          </label>
          <h2>Pick today’s session length</h2>
          <div className="duration-actions">
            {[15, 30].map((minutes) => (
              <button key={minutes} onClick={() => startSession(minutes)}>{minutes} min</button>
            ))}
          </div>
        </div>
      )}

      {screen === 'home' && <TaskList tasks={tasks} onStartTask={startTask} />}

      {screen === 'conversation' && (
        <ConversationScreen
          task={activeTask}
          tone={tone}
          onToneChange={setTone}
          onSubmit={submitResponse}
          history={history}
          onFinish={finishTask}
          targetLanguage={languageLabel}
        />
      )}

      {screen === 'summary' && progress && (
        <SummaryScreen progress={progress} onBackHome={() => setScreen('home')} />
      )}
    </main>
  );
}
