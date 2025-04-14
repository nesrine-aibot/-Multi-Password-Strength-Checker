import React from 'react';
import './App.css';
import PasswordEvaluator from './components/PasswordEvaluator';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Password Security Checker</h1>
      </header>
      <main>
        <PasswordEvaluator />
      </main>
    </div>
  );
}

export default App;
