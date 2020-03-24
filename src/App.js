import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom'
import Route from 'react-router-dom/Route'
// import logo from './logo.svg';
import duck from './assets/img/duck.svg'
import profile from './assets/img/profile.jpg'
import facebook from './assets/img/facebook.svg'
import instagram from './assets/img/instagram.svg'
import twitter from './assets/img/twitter.svg'
import './App.css';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import Main from './components/Main'
import Policy from './components/Policy'


function App() {
  return (
    <Router>
      <Route path="/" exact component={Main}/>
      <Route path="/duck-follow" exact component={Main}/>
      <Route path="/duck-follow/policy-privacy" exact component={Policy}/>
    </Router>
  );
}

export default App;
