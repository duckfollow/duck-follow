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
import ProgressView from './ProgressView'
import Covid19 from './Covid19'
import { Container, Row, Col } from 'reactstrap';
import PlayerScore from './PlayerScore'
import Android_Studio from '../assets/img/Android_Studio.png'
import ListArticle from './ListArticle'
import img_cart from '../assets/img/basket.svg'
import { Badge } from 'reactstrap';
import * as firebase from 'firebase';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.handleScrollToElement = this.handleScrollToElement.bind(this);
    let d = new Date()
    this.state = {
      day: d.getDay(),
      month: d.getMonth() + 1 < 10 ? "0"+(d.getMonth()+1): d.getMonth()+1,
      date: d.getDate() < 10 ? "0"+d.getDate() : d.getDate(),
      year: d.getFullYear(),
      time: d.toLocaleTimeString(),
      value: 0, 
      previous: 0,
      isStopped: false, 
      isPaused: false,
      speed: 1,
      isClick: true,
      id:'',
      dataOrder: []
    }
    this.countingSecond = this.countingSecond.bind(this)
    this.generateUser = this.generateUser.bind(this)
  }

  countingSecond() {
    let d = new Date()
    this.setState({
      day: d.getDay(),
      month: d.getMonth() + 1 < 10 ? "0"+(d.getMonth()+1): d.getMonth()+1,
      date: d.getDate() < 10 ? "0"+d.getDate() : d.getDate(),
      year: d.getFullYear(),
      time: d.toLocaleTimeString()
    })
  }
  componentWillMount() {
    setInterval(this.countingSecond, 1000)
    const user = localStorage.getItem('user')
    if (user === null) {
      let id = this.generateUser()
      this.setState({
        id:id
      })
      localStorage.setItem('user', id);
    } else {
      this.setState({
        id:user
      })
    }
  }

  componentDidMount(){
    const dataOrder = firebase.database().ref('orderweb');
    dataOrder.on('value', (snapshot) => {
      let freBaseData = snapshot.val();
      let dataListOrder = [];    
      snapshot.forEach(dataOrder => {
        let data = dataOrder.val();
        dataOrder.forEach(s => {
          let order = s.val()
          console.log(s.val())
            if (order.status !== 2 && order.state !== 3) {
              dataListOrder.push({
                key:dataOrder.key,
                keyorder:s.key,
                img: order.product[0].picture,
                product: order.product,
                date_order: order.date_order,
                price:order.price,
                status:order.status
              });
            }
          })
    });

      this.setState({
        dataOrder: dataListOrder
      });
    });

  }

  handleScrollToElement(event) {
    if (this.state.isClick) {
      this.setState({isClick: false})
      let timerId = setInterval(()=>{
        let timer = this.state.speed + 1.5
        this.setState({speed: timer})
        if (timer > 4){
          window.scrollTo(0, this.myRef.current.offsetTop);
          this.setState({speed: 1,isClick: true})
          clearInterval(timerId)
        }
      }, 1000)
    }
  }

  generateUser () {
    var _sym = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    var str = '';

    for(var i = 0; i < 6; i++) {
        str += _sym[parseInt(Math.random() * (_sym.length))];
    }

    return 'GM-' + str;
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
              <ProgressView/>
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
            {/* <section>
              <div className="App-content">
                <Covid19/>
              </div>
            </section> */}
            <section ref={this.myRef}>
              <div className="App-content">
                <img src={profile} className="img-circle img-profile noselect" alt="logo" />
                <p className="noselect">
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
            {/* <section className="App-content">
              <ListArticle/>
            </section> */}
            <section>
              <div className="App-content">
                <h1 className="noselect">made application</h1>
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
                <h1 className="noselect">{this.state.date}:{this.state.month}:{this.state.year}:{this.state.time}</h1>
              </div>
            </section>
            <section>
              <div className="App-content">
               <Timeline/>
              </div>
            </section>
            <section>
              <div className="App-content">
                <h1 className="noselect">Products</h1>
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
            {/* <section>
              <div className="App-content">
                  <h1 className="ux-ui noselect">UX/UI</h1>
              </div>
            </section>
            <section>
              <div className="App-content">
                 
              </div>
            </section>
            <section>
              <div className="App-content">
                  <h1 className="event-text noselect">EVENTS</h1>
              </div>
            </section>
            <section>
              <div className="App-content">
                  <h1 className="noselect">Make Game tomorrow!</h1>
              </div>
            </section>
            <section>
              <div className="App-content">
                  <Container>
                    <Row>
                      <Col md="6">
                      <Link to={`/game/${this.state.id}`}>เริ่มเกม</Link>
                      </Col>
                      <Col md="6">
                        <PlayerScore/>
                      </Col>
                    </Row>
                  </Container>
              </div>
            </section> */}
            <section>
              <div className="App-content">
                <div>
                  <Badge color="danger">จำนวนออร์เดอร์ {this.state.dataOrder.length}</Badge>
                  <br/>
                  <Link to="/shop">
                    <img src={img_cart} width={100}/>
                  </Link>
                  
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