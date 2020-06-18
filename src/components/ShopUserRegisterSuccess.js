import React from "react";
import { Container, Row, Col, Button } from 'reactstrap';
import {
    Card, CardImg, CardText, CardBody, CardLink,
    CardTitle, CardSubtitle
  } from 'reactstrap';
  import Lottie from 'react-lottie';
  import animationData from '../assets/img/register-success.json'

import * as firebase from 'firebase';
import { QRCode } from 'react-qrcode-logo';
// https://duckfollowtk.github.io/duck-follow/#/shop-regiter-success/-M9lbiIbt8wqU7hSx4GS

export default class ShopUserRegisterSuccess extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataCart:[],
            isStopped: false, 
            isPaused: false,
            speed: 1.5,
            id: '',
            firstname: '',
            lastname: '',
            address: '',
            url:''
        };

        this.ok = this.ok.bind(this);
        
    }

    componentDidMount(){
        const { id } = this.props.match.params
        console.log(id)
        const dataCart = firebase.database().ref('userweb/'+id);
        this.setState({url: "https://duckfollowtk.github.io/duck-follow/#/shop-regiter-success/"+id})
    
        dataCart.on('value', (snapshot) => {
          let freBaseData = snapshot.val();
          localStorage.setItem('id', id);
          localStorage.setItem('firstname', freBaseData.firstname);
          localStorage.setItem('lastname', freBaseData.lastname);
          localStorage.setItem('address', freBaseData.address);
          console.log(freBaseData)
          this.setState({
            id: id,
            firstname: freBaseData.firstname,
            lastname: freBaseData.lastname,
            address: freBaseData.address
          })
        });
      }

      ok() {
          this.props.history.push('/shop')
      }

    render() {
        const defaultOptions = {
            loop: false,
            autoplay: true, 
            animationData: animationData,
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice'
            }
        };
        return (
            <Container className="App-content">
                 <Lottie options={defaultOptions}
                    height={150}
                    width={150}
                    speed={this.state.speed}
                    isStopped={this.state.isStopped}
                    isPaused={this.state.isPaused}/>
                    <br/>
                    <Row>
                      <Col>
                        <h4>รหัสของคุณคือ {this.state.id}</h4>
                        {this.state.firstname}<br/>
                        {this.state.lastname}<br/>
                        {this.state.address}<br/>
                        <QRCode value={this.state.url} />
                      </Col>
                    </Row>
                    <Button onClick={this.ok}>ตกลง</Button>
            </Container>

        )
    }
}