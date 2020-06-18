import React from "react";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText
  } from 'reactstrap';
import { Badge } from 'reactstrap';
import { Jumbotron, Button } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import {UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
import {
    Card, CardImg, CardText, CardBody, CardLink,
    CardTitle, CardSubtitle
  } from 'reactstrap';
import { Masonry } from './Masonry';
import { Link } from "react-router-dom";
import './Shop.css';
import img_cart from '../assets/img/basket.svg'
import img_arrow from '../assets/img/arrow.svg'
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import Lottie from 'react-lottie';
import animationData from '../assets/img/freelancers-life.json'
import { Form, FormGroup, Label } from 'reactstrap';

import * as firebase from 'firebase';

export default class ShopUserLogin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataCart:[],
            isStopped: false, 
            isPaused: false,
            idUser:''
        };

        this.goBack = this.goBack.bind(this);
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        var id = localStorage.getItem('id');
        console.log(id)
        if (id !== null) {
          this.props.history.push('/profile');
        }
        this.onChangeFirstName = this.onChangeFirstName.bind(this);
        this.onChangeLastName = this.onChangeLastName.bind(this);
        this.onChangeAddress = this.onChangeAddress.bind(this);
        this.onChangeIdUser = this.onChangeIdUser.bind(this);
    }

    goBack(){
      this.props.history.goBack();
    }

    componentDidMount(){
        const dataCart = firebase.database().ref('cartweb/id');
    
        dataCart.on('value', (snapshot) => {
          let freBaseData = snapshot.val();
          let dataStorageCart = [];    
          snapshot.forEach(productSnapshot => {
            let data = productSnapshot.val();
            dataStorageCart.push({
              keyid:productSnapshot.key,
              name_product:data.name_product,
              details_product:data.details_product,
              price_product:data.price_product,
              profile_picture:data.profile_picture,
              });
        });

          this.setState({
            dataCart: dataStorageCart
          });
        });

        
      }

      login () {
        const dataUser = firebase.database().ref('userweb/'+this.state.idUser);
        dataUser.on('value', (snapshot) => {
          let freBaseData = snapshot.val();
          localStorage.setItem('id', this.state.idUser);
          localStorage.setItem('firstname', freBaseData.firstname);
          localStorage.setItem('lastname', freBaseData.lastname);
          localStorage.setItem('address', freBaseData.address);
          this.props.history.push('/profile')
        });
      }

      register() {
        const dataRef = firebase.database()
        const context = this
        var data = {
          firstname: this.state.firstname,
          lastname: this.state.lastname,
          address: this.state.address
        }
        var newUser = dataRef.ref("userweb").push(data).then(function (snapshot) {
            console.log("success")
            console.log(snapshot.key)
            context.props.history.push('/shop-regiter-success/'+snapshot.key)
            }, function () {
            console.log('rejected promise')
        }).catch((e) => console.log(e))
      }

      onChangeFirstName(event) {
        this.setState({firstname: event.target.value});
      }

      onChangeLastName(event) {
        this.setState({lastname: event.target.value});
      }

      onChangeAddress(event) {
        this.setState({address: event.target.value});
      }

      onChangeIdUser(event) {
        this.setState({idUser: event.target.value});
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
            <div>
                <Container className="fixed-top">
                    <Navbar color="light" light expand="md" className="nav-bar-border">
                    <NavbarBrand><Button onClick={this.goBack} className="button-cart"> <img width={25} height={25} src={img_arrow}/></Button></NavbarBrand>
                            {/* <NavbarToggler onClick="" /> */}
                            {/* <Collapse isOpen="" navbar> */}
                            <Nav className="mr-auto" navbar>
                            
                            </Nav>
                            <NavbarText> 
                            <Link to={`/shop-cart`} className="button-cart"> <img width={25} height={25} src={img_cart}/> <Badge color="danger">{this.state.dataCart.length}</Badge></Link>
                            </NavbarText>
                            {/* </Collapse> */}
                    </Navbar>               
                </Container>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                <Container>
                    <Row>
                        <Col>
                          <Lottie options={defaultOptions}
                              height={300}
                              width={300}
                              isStopped={this.state.isStopped}
                              isPaused={this.state.isPaused}/>
                          <Label for="examplePassword" className="mr-sm-2">ใส่รหัสของคุณ</Label>
                          <Form inline>
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                              <Input type="text" placeholder="" onChange={this.onChangeIdUser} />
                              <Button onClick={this.login.bind(this)} className="btn-width">ตกลง</Button>
                            </FormGroup>
                          </Form>
                          <p>ลืมรหัส</p>
                        </Col>
                        <Col>
                        <h1>ลงทะเบียน</h1>
                          <Form>
                            <Row form>
                              <Col md={6}>
                                <FormGroup>
                                  <Label for="exampleEmail">ชื่อ</Label>
                                  <Input type="text" id="firstname"  placeholder="" value={this.state.firstname} onChange={this.onChangeFirstName} />
                                </FormGroup>
                              </Col>
                              <Col md={6}>
                                <FormGroup>
                                  <Label for="examplePassword">นามสกุล</Label>
                                  <Input type="text" id="lastname" placeholder="" value={this.state.lastname} onChange={this.onChangeLastName}/>
                                </FormGroup>
                              </Col>
                            </Row>
                            <FormGroup>
                              <Label for="exampleAddress">Address</Label>
                              <Input type="text" id="exampleAddress" placeholder="1234 Main St" value={this.state.address} onChange={this.onChangeAddress}/>
                            </FormGroup>
                            <FormGroup>
                              <Label for="exampleAddress2">Address 2</Label>
                              <Input type="text" id="exampleAddress2" placeholder="Apartment, studio, or floor"/>
                            </FormGroup>
                            <Row form>
                              <Col md={6}>
                                <FormGroup>
                                  <Label for="exampleCity">City</Label>
                                  <Input type="text" id="exampleCity"/>
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup>
                                  <Label for="exampleState">State</Label>
                                  <Input type="text" id="exampleState"/>
                                </FormGroup>
                              </Col>
                              <Col md={2}>
                                <FormGroup>
                                  <Label for="exampleZip">Zip</Label>
                                  <Input type="text" id="exampleZip"/>
                                </FormGroup>  
                              </Col>
                            </Row>
                            <Button onClick={this.register}>ลงทะเบียน</Button>
                          </Form>
                        </Col>
                    </Row>
                </Container>

            </div>

        )
    }
}