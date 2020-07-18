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
import {InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import {TabContent, TabPane} from 'reactstrap';
import classnames from 'classnames';
import { Form, FormGroup, Label } from 'reactstrap';

import * as firebase from 'firebase';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "1",
            dataOrder: [],
            dataProducts: [],
            dataUser: [],
            isShowPromotion: false,
            imgPromotion: ''
        };
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

        const Products = firebase.database().ref('productsweb');
        Products.on('value', (snapshot) => {
          let freBaseData = snapshot.val();
          let dataListProduct = [];
          
          snapshot.forEach(dataProduct => {
            let data = dataProduct.val();
            console.log('data: ', dataProduct.key);
            console.log(data.name_product, data.name_product);
            dataListProduct.push({
              keyid:dataProduct.key,
              name_product:data.name_product,
              details_product:data.details_product,
              price_product:data.price_product,
              picture:data.picture,
            });
          })

          this.setState({
            dataProducts: dataListProduct
          });
        });

        const dataUser = firebase.database().ref('userweb');
        dataUser.on('value', (snapshot) => {
          let freBaseData = snapshot.val();
          let dataListUser = [];  
          
          snapshot.forEach(user => {
            let data = user.val()
            try {
              var img = data.profile_picture
            }catch(err) {
              var img = ''
            }
            dataListUser.push({
              key: user.key,
              firstname: data.firstname,
              lastname: data.lastname,
              picture: img,
              phone: data.phone,
              email: data.email,
              address: data.address,
              province: data.province,
              amphoe: data.amphoe,
              district: data.district,
              zipcode: data.zipcode
            })
          })

          this.setState({
            dataUser: dataListUser
          });
        });

        const dataSetting = firebase.database().ref('web_setting/promotion/');
        dataSetting.on('value', (snapshot) => {
            var dataSetting = snapshot.val()
            this.setState({
              imgPromotion: dataSetting.img,
              isShowPromotion : dataSetting.isShow
            })
            console.log(dataSetting)
        });

      }

      toggle(i) {
        this.setState({activeTab:i})
      }

      addPeroduct() {
        this.props.history.push('/product-add')
      }

      handleViewProduct(key) {
        this.props.history.push('/product-view/'+key)
      }

      onChangePromotion (event) {
        const dataRef = firebase.database()
        dataRef.ref("web_setting/promotion/").update({
          isShow: event.target.value.toLowerCase() == 'true' ? true : false,
            }).then(function () {
                console.log("success")
                alert("success")
            }, function () {
            console.log('rejected promise')
        }).catch((e) => console.log(e))
      }

    render() {
        return (
            <div>
              <Container>
                <h1>Dashboard</h1>
                <Row>
                  <Col xs={12} md={4}>
                    <Row>
                      <Col xs={6} onClick={this.toggle.bind(this,"1")}>
                        <Card className="card-view-cart">
                          <CardBody>
                            Order {this.state.dataOrder.length >0? <Badge color="danger">{this.state.dataOrder.length}</Badge> :null}
                          </CardBody>
                        </Card>
                      </Col>
                      <Col xs={6} onClick={this.toggle.bind(this,"2")}>
                        <Card className="card-view-cart">
                          <CardBody>
                            {this.state.dataProducts.length} Products
                          </CardBody>
                        </Card>
                      </Col>
                      <Col xs={6} onClick={this.toggle.bind(this,"3")}>
                        <Card className="card-view-cart">
                          <CardBody>
                            {this.state.dataUser.length} User
                          </CardBody>
                        </Card>
                      </Col>
                      <Col xs={6} onClick={this.toggle.bind(this,"4")}>
                        <Card className="card-view-cart">
                          <CardBody>
                            Setting
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12} md={8}>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                          <h2>Order</h2>
                          {this.state.dataOrder.map(item => (
                              <Card className="card-view-cart" key={item.keyorder}>
                                  <CardBody>
                                    <Row>
                                      <Col xs={2}><img src={item.img} className="img-order"/></Col>
                                      <Col xs={10}>
                                      {item.key}<br/>
                                      {item.date_order}<br/>
                                      <Row>
                                        {
                                          item.product.map(p =>(
                                          <Col xs={12}>{p.name_product}</Col>
                                          ))
                                        }
                                      </Row>
                                      จำนวน {item.product.length} ชิ้น
                                      </Col>
                                    </Row>
                                    <hr/>
                                    <p className="text-order-price">ราคา ฿{item.price}</p>
                                    <Button outline color="info" size="lg" value={item.key} onClick="">รายละเอียด</Button> {' '}
                                    <Button outline color="danger" size="lg" value={item.key} onClick="">cancel</Button>
                                  </CardBody>
                              </Card>
                            ))}
                        </TabPane>
                        <TabPane tabId="2">
                          <h2>Products <Button onClick={this.addPeroduct.bind(this)}>เพิ่ม</Button></h2>
                          {this.state.dataProducts.map(item => (
                              <Card className="card-view-cart" key={item.keyid}>
                                  <CardBody>
                                    <Row>
                                      <Col xs={12} md={6}>
                                        <img src={item.picture} width="100%"/>
                                      </Col>
                                      <Col xs={12} md={6}>
                                        {item.keyid}<br/>
                                        {item.name_product}<br/>
                                        ราคา {item.price_product}
                                        <Button outline color="info" size="sm" value={item.keyid} onClick={this.handleViewProduct.bind(this,item.keyid)}>view</Button>
                                        {/* <Button outline color="danger" size="sm" value={item.key} onClick={this.handleCancelOrder.bind(this,item.key)}>cancel</Button> */}
                                      </Col>
                                    </Row>
                                  </CardBody>
                              </Card>
                            ))}
                        </TabPane>
                        <TabPane tabId="3">
                          <h2>User</h2>
                          {this.state.dataUser.map(item => (
                              <Card className="card-view-cart" key={item.key}>
                                  <CardBody>
                                    <Row>
                                      <Col xs={3}>
                                        <img src={item.picture} width="100%"/>
                                      </Col>
                                      <Col>
                                      {item.key}<br/>
                                      {item.firstname} {item.lastname} <br/>
                                      {item.phone} {item.email} <br/>
                                      ที่อยู่ <br/>
                                      {item.address} {item.province} {item.amphoe} {item.district} {item.zipcode}
                                      </Col>
                                    </Row>
                                    
                                  </CardBody>
                              </Card>
                            ))}
                        </TabPane>
                        <TabPane tabId="4">
                          <h2>Setting</h2>
                          <Row>
                            <Col xs={12} md={6}>
                              <img width="100%" src={this.state.imgPromotion}/>
                            </Col>
                            <Col xs={12} md={6}>
                              <FormGroup>
                                <Label for="exampleZip">promotion</Label>
                                <Input type="select" name="select" id="exampleSelect" onChange={this.onChangePromotion.bind(this)} value={this.state.isShowPromotion}>     
                                  <option value="true">เปิด</option>
                                  <option value="false">ปิด</option>
                                </Input>
                              </FormGroup>
                            </Col>
                          </Row>
                        </TabPane>
                    </TabContent>
                   
                  </Col>
                </Row>
              </Container>
            </div>
        )
    }
}