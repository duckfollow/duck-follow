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

import Lottie from 'react-lottie';
import animationData from '../assets/img/analytics.json'
import Board from './Board'

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = { value: 0, previous: 0 ,isStopped: false, isPaused: false};
    this.handleScrollToElement = this.handleScrollToElement.bind(this);
  }

  handleScrollToElement(event) {
    if (true){
      window.scrollTo(0, this.myRef.current.offsetTop);
    }
  }
    render() {
      const defaultOptions = {
          loop: true,
          autoplay: true, 
          animationData: animationData,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
          }
      };
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
              <Board/>
            </section>
            <section>
              <div className="App-content">
               <Timeline/>
              </div>
            </section>
            <section>
              <div className="App-content">
                <h1>Products</h1>
              </div>
            </section>
            <section>
              <div className="App-content">
                <div>
                  <a href="https://play.google.com/store/apps/details?id=com.prasit.theboxshop" target="_blank">
                    <img src="https://lh3.googleusercontent.com/WZeG1MyE8bpBt1cHMBAuoRUghGOWE23P7Ji28yMyUWF-90kTy6GPgDOm0rqvvgYOx-E=s180-rw"/>
                  </a>
                  <a href="https://play.google.com/store/apps/details?id=com.prasit.shopmanager" target="_blank">
                    <img src="https://lh3.googleusercontent.com/kuN3ko72k14yuetGz21EFJrekBQC5Gat_3WWVhFaWasm8aLHDh6KdYIUsji_9thZu2wb=s180-rw"/>
                  </a>
                  <a href="https://play.google.com/store/apps/details?id=me.duckfollow.ozone" target="_blank">
                    <img src="https://lh3.googleusercontent.com/4D1CU1oKP1RRC4NX45ZGbYGd9AuqpiYpTMDxuUi1iLwN8KG4PGEt3jjmJ8zyUWeLVLo=s180-rw"/>
                  </a>
                  <a href="https://play.google.com/store/apps/details?id=me.duckfollow.qrcode" target="_blank">
                    <img src="https://lh3.googleusercontent.com/woEQJUcdb0M8O96zNuGnEhhn2uJBS4h1GkmTaJSxePzjFm6nhHeLToPuFF8_AU9sras=s180-rw"/>
                  </a>
                </div>
              </div>
            </section>
            <section>
              <div className="App-content">
              <Lottie options={defaultOptions}
                height={300}
                width={300}
                isStopped={this.state.isStopped}
                isPaused={this.state.isPaused}/>
              <Link to="/policy-privacy">policy-privacy</Link>
              </div>
            </section>
          </div>
        );
      }
}