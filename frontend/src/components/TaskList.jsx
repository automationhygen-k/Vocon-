import React from 'react';
import { scenarioDescriptions } from '../data';

export default function TaskList({ tasks, onStartTask }) {
  return (
    <div className="card">
      <h2>Daily To-Do</h2>
      <p className="muted">Complete mandatory tasks first, then optional tasks.</p>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={`task-item ${task.type}`}>
            <div>
              <p className="task-title">{task.title}</p>
              <p className="muted small">{scenarioDescriptions[task.scenario]}</p>
              <p className="pill">{task.type}</p>
            </div>
            <button onClick={() => onStartTask(task)}>Start</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
