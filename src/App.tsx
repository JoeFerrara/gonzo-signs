import React, { useState } from 'react';
import { SIGNS, type Sign } from './data/signs';
import { SignGraphic } from './components/SignGraphic';
import { CanvasSimulator } from './simulator/CanvasSimulator';
import './App.css';

function App() {
  const [selectedSign, setSelectedSign] = useState<Sign>(SIGNS[0]);
  const [isCorrectBehavior, setIsCorrectBehavior] = useState(true);
  const [simKey, setSimKey] = useState(0);

  const runSimulation = (correct: boolean) => {
    setIsCorrectBehavior(correct);
    setSimKey(prev => prev + 1);
  };

  React.useEffect(() => {
    const handleReset = () => setSimKey(0);
    window.addEventListener('reset-sim', handleReset);
    return () => window.removeEventListener('reset-sim', handleReset);
  }, []);

  return (
    <>
      <aside className="sidebar">
        <header className="sidebar-header">
          <h1>US Traffic Signs</h1>
        </header>
        <div className="sign-list">
          {SIGNS.map(sign => (
            <div 
              key={sign.id} 
              className={`sign-item ${selectedSign.id === sign.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedSign(sign);
                setSimKey(0); // Reset simulation view
              }}
            >
              <div className="sign-thumbnail">
                <SignGraphic sign={sign} />
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{sign.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sign.id}</div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className="main-content">
        <div className="content-inner">
          <section className="card">
            <div className="sign-detail-header">
              <div className="large-sign">
                <SignGraphic sign={selectedSign} />
              </div>
              <div style={{ flex: 1 }}>
                <span className={`badge badge-${selectedSign.category.toLowerCase()}`}>
                  {selectedSign.category}
                </span>
                <h2 style={{ margin: '0.5rem 0', fontSize: '2rem' }}>{selectedSign.name}</h2>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>{selectedSign.description}</p>
              </div>
            </div>
            
            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', borderLeft: '4px solid var(--primary)' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary)' }}>Expected Behavior</h4>
              <p style={{ margin: 0 }}>{selectedSign.expectation}</p>
            </div>
          </section>

          <section>
            <h3 style={{ marginBottom: '1rem' }}>Photorealistic Simulator</h3>
            <CanvasSimulator 
              sign={selectedSign} 
              isCorrectBehavior={isCorrectBehavior} 
              triggerKey={simKey} 
            />
            <div className="controls">
              <button 
                className="primary" 
                onClick={() => runSimulation(true)}
              >
                Simulate Correct Behavior
              </button>
              <button 
                className="danger" 
                onClick={() => runSimulation(false)}
              >
                Simulate Rule Violation
              </button>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Tip: The simulator uses photorealistic sprites to demonstrate the outcomes. Watch out for pedestrians, cross traffic, and police officers.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}

export default App;
