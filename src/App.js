import React from 'react';
import logo from './logo.svg';
import duck from './assets/img/duck.svg'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={duck} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://duckfollowtk.github.io/duck-follow/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
