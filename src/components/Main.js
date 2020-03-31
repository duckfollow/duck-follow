import React from 'react';
import { Button, UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
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
import duck_logo from '../assets/img/duck-blue-style.json';
import logo from '../logo2.svg';
import sport from '../assets/img/sport.svg';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = { value: 0, previous: 0 ,isStopped: false, isPaused: false,speed: 1};
    this.handleScrollToElement = this.handleScrollToElement.bind(this);
  }

  handleScrollToElement(event) {
    this.setState({speed: this.state.speed+0.5})
    console.log(this.state.speed)
    if (this.state.speed > 4){
      window.scrollTo(0, this.myRef.current.offsetTop);
      this.setState({speed: 1})
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

      const duckfollow = {
        loop: true,
        autoplay: true, 
        animationData: duck_logo,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    };
        return (
            <div className="App">
            <section>
              <header className="App-header">
                {/* <img src={duck} className="App-logo" alt="logo" /> */}
                <Lottie options={duckfollow}
                  height={300}
                  width={300}
                  speed={this.state.speed}
                  isStopped={this.state.isStopped}
                  isPaused={this.state.isPaused}/>
                <p>
                  Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                  className="button-speed noselect"
                  onClick={this.handleScrollToElement}
                  rel="noopener noreferrer">
                  <img className="icon-btn-speed" src={sport}/>Click to Learn React
                </a>
              </header>
            </section>
            <section ref={this.myRef}>
              <div className="App-content">
                <img src={profile} className="img-circle img-profile noselect" alt="logo" />
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
                  <a id="theboxshop" href="https://play.google.com/store/apps/details?id=com.prasit.theboxshop" target="_blank">
                    <img src="https://lh3.googleusercontent.com/WZeG1MyE8bpBt1cHMBAuoRUghGOWE23P7Ji28yMyUWF-90kTy6GPgDOm0rqvvgYOx-E=s180-rw"/>
                  </a>
                  <a id="shopmanager" href="https://play.google.com/store/apps/details?id=com.prasit.shopmanager" target="_blank">
                    <img src="https://lh3.googleusercontent.com/kuN3ko72k14yuetGz21EFJrekBQC5Gat_3WWVhFaWasm8aLHDh6KdYIUsji_9thZu2wb=s180-rw"/>
                  </a>
                  <a id="ozone" href="https://play.google.com/store/apps/details?id=me.duckfollow.ozone" target="_blank">
                    <img src="https://lh3.googleusercontent.com/4D1CU1oKP1RRC4NX45ZGbYGd9AuqpiYpTMDxuUi1iLwN8KG4PGEt3jjmJ8zyUWeLVLo=s180-rw"/>
                  </a>
                  <a id="qrcode" href="https://play.google.com/store/apps/details?id=me.duckfollow.qrcode" target="_blank">
                    <img src="https://lh3.googleusercontent.com/woEQJUcdb0M8O96zNuGnEhhn2uJBS4h1GkmTaJSxePzjFm6nhHeLToPuFF8_AU9sras=s180-rw"/>
                  </a>
                </div>
                <UncontrolledPopover trigger="hover" placement="bottom" target="theboxshop">
                  <PopoverHeader>The Box Shop เปิดร้านค้าออนไลน์</PopoverHeader>
                  <PopoverBody>เปิดร้านค้าออไลน์ได้ง่ายๆ มาพร้อมบริการจัดการหน้าร้าน</PopoverBody>
                </UncontrolledPopover>
                <UncontrolledPopover trigger="hover" placement="bottom" target="shopmanager">
                  <PopoverHeader>krap krap จัดการร้านค้า</PopoverHeader>
                  <PopoverBody>ระบบจัดการคิวร้านค้า พร้อม E-Slip</PopoverBody>
                </UncontrolledPopover>
                <UncontrolledPopover trigger="hover" placement="bottom" target="ozone">
                  <PopoverHeader>ozone not included ตรวจฝุ่น PM 2.5</PopoverHeader>
                  <PopoverBody>วัดระดับค่าฝุ่น PM 2.5</PopoverBody>
                </UncontrolledPopover>
                <UncontrolledPopover trigger="hover" placement="bottom" target="qrcode">
                  <PopoverHeader>สร้าง QR Code</PopoverHeader>
                  <PopoverBody>สร้างและแสกน QR Code</PopoverBody>
                </UncontrolledPopover>
              </div>
            </section>
            <section>
              <div className="App-content">
                  <img src={logo} width={200} height={200} id="PopoverLegacy"/>
                  <UncontrolledPopover trigger="hover" placement="top" target="PopoverLegacy">
                    {/* <PopoverHeader>Legacy Trigger</PopoverHeader> */}
                    <PopoverBody>
                      Thank You for dowload.</PopoverBody>
                  </UncontrolledPopover>
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