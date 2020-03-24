import React from 'react';
// import logo from './logo.svg';
import duck from './assets/img/duck.svg'
import profile from './assets/img/profile.jpg'
import facebook from './assets/img/facebook.svg'
import instagram from './assets/img/instagram.svg'
import twitter from './assets/img/twitter.svg'
import './App.css';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import TodoApp from './components/TodoApp'

function App() {
  return (
    <div className="App">
      <section>
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
      </section>
      <section>
        <div className="App-content">
          <img src={profile} className="img-circle img-profile" alt="logo" />
          <p>
            Prasit Suphancho
          </p>
          <div>
            <a href="https://www.facebook.com/prasit.suphancho">
              <img src={facebook} className="social-width" alt="logo" />
            </a>
            <a href="https://www.instagram.com/tankps/">
              <img src={instagram} className="social-width" alt="logo" />
            </a>
            <a href="https://twitter.com/slammonder">
              <img src={twitter} className="social-width" alt="logo" />
            </a>
          </div>
        </div>
      </section>
      <section>
        <div className="App-content">
          <h1>made application</h1>
        </div>
      </section>
      <section>
        <div className="App-content">
          <TodoApp/>
        </div>
      </section>
      <section>
        <div className="App-content">
        </div>
      </section>
    </div>
  );
}

export default App;
