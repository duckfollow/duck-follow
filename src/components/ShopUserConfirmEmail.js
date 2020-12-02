import React from "react";
import { Container, Row, Col, Button } from 'reactstrap';
import {
    Card, CardImg, CardText, CardBody, CardLink,
    CardTitle, CardSubtitle
  } from 'reactstrap';
  import Lottie from 'react-lottie';
  import animationData from '../assets/img/register-success.json'
  import img_fab from '../assets/img/fab-shop.svg'

import * as firebase from 'firebase';
import { QRCode } from 'react-qrcode-logo';
import './ShopUserRegisterSuccess.css';
// https://duckfollowtk.github.io/duck-follow/#/shop-regiter-success/-M9lbiIbt8wqU7hSx4GS

export default class ShopUserConfirmEmail extends React.Component {

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
      document.title = "duck shop - ร้านค้าออนไลน์"
      let favicon = document.getElementById("favicon");
      favicon.href = img_fab;

          const { id } = this.props.match.params
          console.log(id)
          const dataCart = firebase.database().ref('userweb/'+id);
          this.setState({url: "https://duckfollowtk.github.io/duck-follow/#/shop-regiter-success/"+id})
      
          dataCart.on('value', (snapshot) => {
            try {
              let DataUser = snapshot.val();
              localStorage.setItem('id', id);
              localStorage.setItem('firstname', DataUser.firstname);
              localStorage.setItem('lastname', DataUser.lastname);
              localStorage.setItem('phone', DataUser.phone);
              localStorage.setItem('email', DataUser.email);
              localStorage.setItem('address', DataUser.address);
              localStorage.setItem('province', DataUser.province);
              localStorage.setItem('amphoe', DataUser.amphoe);
              localStorage.setItem('district', DataUser.district);
              localStorage.setItem('zipcode', DataUser.zipcode);
              console.log(DataUser)
              this.setState({
                id: id,
                firstname: DataUser.firstname,
                lastname: DataUser.lastname,
                phone:DataUser.phone,
                email:DataUser.email,
                address: DataUser.address,
                province: DataUser.province,
                amphoe: DataUser.amphoe,
                district: DataUser.district,
                zipcode: DataUser.zipcode
              })
            } catch(err) {
              this.props.history.push('/shop')
            }
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
                    height={120}
                    width={120}
                    speed={this.state.speed}
                    isStopped={this.state.isStopped}
                    isPaused={this.state.isPaused}/>
                    <br/>
                    <Row>
                      <Col>
                        <h4>รหัสของคุณคือ {this.state.id}</h4>
                        <p className="text-show">
                          {this.state.firstname} {this.state.lastname}<br/>
                          {this.state.phone}<br/>
                          {this.state.email}<br/>
                          {this.state.address} {this.state.province} {this.state.amphoe} {this.state.district} {this.state.zipcode}<br/>
                        </p>
                        <hr/>
                       <center>
                          <QRCode value={this.state.url} />
                          <p className="item-detail">*คุณสามารถแสกน QR Code เพื่อเข้าสู่ระบบได้</p>
                       </center> 
                      </Col>
                    </Row>
                    <Button outline onClick={this.ok}>กลับไปหน้าซื้อสินค้า</Button>
            </Container>

        )
    }
}