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
import { Form, FormGroup, Label } from 'reactstrap';
import { Router, RouterContext, browserHistory } from 'react-router';

import * as firebase from 'firebase';

export default class ShopCart extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
            dataCart:[],
            sumPrice: 0,
            firstname: "",
            lastname: "",
            address: "",
            price_delivery:"ฟรี",
            id: 'id'
        };
        this.goBack = this.goBack.bind(this);
    }

    componentDidMount(){
        var id = localStorage.getItem('id');
        if (id === null) {
          var id = 'id'
        }
        var firstname = localStorage.getItem('firstname')
        var lastname = localStorage.getItem('lastname')
        var address = localStorage.getItem('address')
        const dataCart = firebase.database().ref('cartweb/'+id);
        dataCart.on('value', (snapshot) => {
          let freBaseData = snapshot.val();
          let dataStorageCart = [];
          let price = 0;   
          snapshot.forEach(productSnapshot => {
            let data = productSnapshot.val();
            dataStorageCart.push({
              keyid:productSnapshot.key,
              name_product:data.name_product,
              details_product:data.details_product,
              price_product:data.price_product,
              profile_picture:data.profile_picture,
              });
              price =  price + Number(data.price_product)
        });

        if (dataStorageCart.length !== 0) {
          if (price >= 100) {
            this.setState({
              price_delivery:"ฟรี"
            }) 
          } else {
            this.setState({
              price_delivery:" 50 บาท"
            })
            price = price + 50
          }
        }

          this.setState({
            dataCart: dataStorageCart,
            sumPrice: price
          });
        });

        console.log(id)
        if (id !== null) {
            this.setState({
                id: id,
                firstname: firstname,
                lastname:lastname,
                address:address
            })
        }
        
      }

      handleRemoveCart(event) {
        console.log(event.target.value)
        var id = localStorage.getItem('id');
        const dataRef = firebase.database()
        const key_value = event.target.value
        dataRef.ref("cartweb/"+id).child(key_value).remove();
      }

      clickInvoice() {
        var id = localStorage.getItem('id');
        const dataRef = firebase.database()
        const context = this
        var today = (new Date()).toISOString()
        console.log(today)
        var data = {
          product:this.state.dataCart,
          price: this.state.sumPrice,
          address:{
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            address: this.state.address
          },
          img_receipt:'',
          delivery_price: this.state.price_delivery,
          delivery_code:'',
          description_status:'',
          status:0,
          date_order:today
        }
        var newUser = dataRef.ref("orderweb/"+id).push(data).then(function (snapshot) {
            console.log("success")
            console.log(snapshot.key)

            context.props.history.push('/invoice/'+snapshot.key)
            }, function () {
            console.log('rejected promise')
        }).catch((e) => console.log(e))
      }
      goBack(){
        this.props.history.goBack();
      }
    render() {
        
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
                <div className={this.state.dataCart.length > 0 ? 'show' : 'hidden'}>
                <Container className="view-cart">
                  <Row>
                    <Col md="6">
                    <h2>ตะกร้าสินค้า</h2>
                      {this.state.dataCart.map(item => (
                          <Card className="card-view-cart" key={item.keyid}>
                              <CardBody>
                                  <img width={40} height={40} src={item.profile_picture} alt="Card image cap" />
                                  {item.keyid}
                                  <Button outline color="danger" size="sm" value={item.keyid} onClick={this.handleRemoveCart}>ลบ</Button>
                              </CardBody>
                          </Card>
                      ))}
                          
                    </Col>
                    <Col md="6">
                        <h2>ที่อยู่จัดส่ง</h2>
                        <Card>
                            <CardBody>
                                <Form>
                                  <Row form>
                                    <Col md={6}>
                                      <FormGroup>
                                        <Label for="exampleEmail">ชื่อ</Label>
                                        <Input type="text" name="firstname" id="firstname" placeholder="" value={this.state.firstname} />
                                      </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                      <FormGroup>
                                        <Label for="examplePassword">นามสกุล</Label>
                                        <Input type="text" name="lastname" id="lastname" placeholder="" value={this.state.lastname}/>
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                  <FormGroup>
                                    <Label for="exampleAddress">Address</Label>
                                    <Input type="text" name="address" id="exampleAddress" placeholder="1234 Main St" value={this.state.address}/>
                                  </FormGroup>
                                  <FormGroup>
                                    <Label for="exampleAddress2">Address 2</Label>
                                    <Input type="text" name="address2" id="exampleAddress2" placeholder="Apartment, studio, or floor"/>
                                  </FormGroup>
                                  <Row form>
                                    <Col md={6}>
                                      <FormGroup>
                                        <Label for="exampleCity">City</Label>
                                        <Input type="text" name="city" id="exampleCity"/>
                                      </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                      <FormGroup>
                                        <Label for="exampleState">State</Label>
                                        <Input type="text" name="state" id="exampleState"/>
                                      </FormGroup>
                                    </Col>
                                    <Col md={2}>
                                      <FormGroup>
                                        <Label for="exampleZip">Zip</Label>
                                        <Input type="text" name="zip" id="exampleZip"/>
                                      </FormGroup>  
                                    </Col>
                                  </Row>
                                  <Button>แก้ไข</Button> <Button>ตกลง</Button>
                                </Form>    
                            </CardBody>
                        </Card>
                    </Col>
                  </Row>
                </Container>
            </div>

            <div className={this.state.dataCart.length > 0 ? 'hidden' : 'show'}>
               <center><h1>ยังไม่มีสินค้า</h1></center>
            </div>

            <Container className="fixed-bottom">
                <h4>จำนวนทั้งหมด {this.state.dataCart.length} ชิ้น ราคา {this.state.sumPrice} บาท</h4>
                      <h6>ค่าจัดส่ง {this.state.price_delivery}</h6>
                  <Row>
                    <Col><Button onClick={this.clickInvoice.bind(this)}>ชำระเงิน</Button></Col>
                  </Row>
            </Container>
            </div>
        )
    }
}