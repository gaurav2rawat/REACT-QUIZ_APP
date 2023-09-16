import React from 'react';
import './App.css';
import Quiz from './quiz';

function App() {
  return (
    <div className="App">
      <header className="bg-red-950 text-white p-4">
        <h1 className="text-3xl font-bold font-serif">NEW-GUIDANCE (TEST)</h1>
      </header>
      <main className="container mx-auto p-4">
        <Quiz />
      </main>
    </div>
  );
}

export default App;

