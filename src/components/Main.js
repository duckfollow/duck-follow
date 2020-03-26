import React from 'react';
// import logo from './logo.svg';
import duck from '../assets/img/duck.svg';
import profile from '../assets/img/profile.jpg';
import facebook from '../assets/img/facebook.svg';
import instagram from '../assets/img/instagram.svg';
import twitter from '../assets/img/twitter.svg';
import github from '../assets/img/github.svg'
import '../App.css';
import './Main.css'
// import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import TodoApp from './TodoApp';
import logoboxshop from '../assets/img/theboxapp.png'
import { Link } from 'react-router-dom';
import Timeline from './Timeline'


export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = { value: 0, previous: 0 };
    this.handleScrollToElement = this.handleScrollToElement.bind(this);
  }

  handleScrollToElement(event) {
    if (true){
      window.scrollTo(0, this.myRef.current.offsetTop);
    }
  }
    render() {
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
                  onClick={this.handleScrollToElement}
                  rel="noopener noreferrer">
                  Learn React
                </a>
              </header>
            </section>
            <section ref={this.myRef}>
              <div className="App-content">
                <img src={profile} className="img-circle img-profile" alt="logo" />
                <p>
                  Prasit Suphancho
                </p>
                <div>
                <a href="https://github.com/DuckFollowTK">
                    <img src={github} className="social-width" alt="logo" />
                  </a>
                  <a href="https://www.facebook.com/p.supancho">
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
                <div>
                  {/* <a href="">
                    <img src={logoboxshop} className="app-icon" alt="logo" />
                  </a>
                  <a href="">
                    <img src={logoboxshop} className="app-icon" alt="logo" />
                  </a>
                  <a href="">
                    <img src={logoboxshop} className="app-icon" alt="logo" />
                  </a> */}
                </div>
              </div>
            </section>
            <section>
              <div className="App-content">
                <TodoApp/>
              </div>
            </section>
            <section>
              <div className="App-content">
               <Timeline/>
              </div>
            </section>
            <section>
              <div className="App-content">
                <Link to="/policy-privacy">policy-privacy</Link>
              </div>
            </section>
          </div>
        );
      }
}