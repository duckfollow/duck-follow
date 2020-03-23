import React from 'react';
import logo from './logo.svg';
import duck from './assets/img/duck.svg'
import profile from './assets/img/profile.jpg'
import './App.css';
import { Button } from 'reactstrap';

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
      <div className="App-content">
        <img src={profile} className="img-circle img-profile" alt="logo" />
        <p>
          Prasit Suphancho
        </p>
      </div>
    </div>
  );
}

export default App;
