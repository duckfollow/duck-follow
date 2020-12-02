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
import './Dashboard.css';
import img_cart from '../assets/img/basket.svg'
import img_arrow from '../assets/img/arrow.svg'
import {InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import {TabContent, TabPane} from 'reactstrap';
import classnames from 'classnames';
import { Modal, ModalBody, Form, FormGroup, Label } from 'reactstrap';

import * as firebase from 'firebase';
import img_fab from '../assets/img/fab-shop.svg'
import textData from '../api/TextData.json';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        var admin = localStorage.getItem('admin');
        console.log(admin)
        var ckLogin = true
        if (admin === 'admin') {
          var ckLogin = false
        }
        this.state = {
            activeTab: "1",
            dataOrder: [],
            dataProducts: [],
            dataUser: [],
            isShowPromotion: false,
            isPage:false,
            imgPromotion: '',
            isShowReceipt: false,
            urlImgReceipt: '',
            orderId: '',
            userId: '',
            delivery_code: '',
            isShowLogin: ckLogin,
            textlogin: ''
        };
    }

    componentDidMount(){
      document.title = "duck shop [dashboard] - ร้านค้าออนไลน์"
      let favicon = document.getElementById("favicon");
      favicon.href = img_fab;

    
        const dataOrder = firebase.database().ref('orderweb');
        dataOrder.on('value', (snapshot) => {
          let freBaseData = snapshot.val();
          let dataListOrder = [];    
          snapshot.forEach(dataOrder => {
            let data = dataOrder.val();
            dataOrder.forEach(s => {
              let order = s.val()
              console.log(s.val())
                // status 0=> create order 1=> upload receipt // 2 => success 3=> cancle
                let date_data = new Date(order.date_order)
                let date_order = date_data.toLocaleString('th-TH') +" น."
                if (order.status !== 2 /*&& order.status !== 3*/) {
                  dataListOrder.push({
                    key:dataOrder.key,
                    keyorder:s.key,
                    img: order.product[0].picture,
                    product: order.product,
                    date_order: date_order,
                    price:order.price,
                    img_receipt: order.img_receipt,
                    status:order.status,
                    status_receipt: order.status_receipt
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
            console.log(data);
            dataListProduct.push({
              keyid:dataProduct.key,
              name_product:data.name_product,
              details_product:data.details_product,
              price_product:data.price_product,
              picture:data.picture,
              amount_product: data.amount_product
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

        const dataSettingError = firebase.database().ref('web_setting/error/');
        dataSettingError.on('value', (snapshot) => {
            var dataSetting = snapshot.val()
            this.setState({
              isPage: dataSetting.page
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
          isShow: event.target.value
            }).then(function () {
                console.log("success")
                alert("success")
            }, function () {
            console.log('rejected promise')
        }).catch((e) => console.log(e))
      }

      onChangePage (event) {
        const dataRef = firebase.database()
        dataRef.ref("web_setting/error/").update({
          page: event.target.value
            }).then(function () {
                console.log("success")
                alert("success")
            }, function () {
            console.log('rejected promise')
        }).catch((e) => console.log(e))
      }

      viewDetailsOrder(id,key) {
        localStorage.setItem('id', id);
        this.props.history.push('/invoice/'+key)
      }

      onHide() {
        this.setState({isShowReceipt: false})
      }

      onClickReceipt(url,userId,orderId) {
        this.setState({
          isShowReceipt:true,
          urlImgReceipt:url,
          userId: userId,
          orderId:orderId
        })
      }

      confirmReceipt() {
        const dataRef = firebase.database()
        var today = (new Date()).toISOString()
        var context = this
        var data = {
          date: today,
          text: textData.confirm_receipt_success,
          detail: textData.confirm_receipt_success_detail
        }
        let id = this.state.userId
        let orderid = this.state.orderId
        dataRef.ref("orderweb/"+id+"/"+orderid+"/statusDetails").push(data).then(function () {
          context.setState({
              isShowReceipt: false
          })
          var data_sub_status = {
            status_receipt: 1
          }
          dataRef.ref("orderweb/"+id+"/"+orderid).update(data_sub_status)
      }, function () {
        console.log('rejected promise')
      }).catch((e) => console.log(e))
    }

    onSetDeliveryCode(event) {
      this.setState({
        delivery_code: event.target.value
      })
    }

    onSenderID(userId,orderId) {
      const dataRef = firebase.database()
      var data = {
        delivery_code: this.state.delivery_code
      }
      let id = userId
      let orderid = orderId
      dataRef.ref("orderweb/"+id+"/"+orderid).update(data).then(function () {
        
    }, function () {
      console.log('rejected promise')
    }).catch((e) => console.log(e))
    }

    onChangeLogin(event) {
      this.setState({textlogin:event.target.value})
    }

    onClickLogin () {
      if(this.state.textlogin === 'admin') {
        localStorage.setItem('admin', this.state.textlogin);
        this.setState({isShowLogin: false})
      } else {
        localStorage.setItem('admin', this.state.textlogin);
      }
    }

    render() {
        return (
            <div>
              <Container className={classnames({"blur-element":this.state.isShowLogin})} fluid={true}>
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
                            <svg width="25px" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="users" class="svg-inline--fa fa-users fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path></svg> {this.state.dataUser.length} User
                          </CardBody>
                        </Card>
                      </Col>
                      <Col xs={6} onClick={this.toggle.bind(this,"4")}>
                        <Card className="card-view-cart">
                          <CardBody>
                            <svg  width="25px" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="cog" class="svg-inline--fa fa-cog fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"></path></svg> Setting
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
                                      <Col xs={8}>
                                      {item.key} <b>status: {item.status}</b><br/>
                                      {item.keyorder}<br/>
                                      วันที่สั่งสินค้า {item.date_order}<br/>
                                      <Row>
                                        {
                                          item.product.map((p,i) =>(
                                          <Col xs={12} className="item-product">{(i+1)}. {p.name_product}</Col>
                                          ))
                                        }
                                      </Row>
                                      จำนวน {item.product.length} ชิ้น <br/>
                                      {/* <Input type="text" value={this.state.delivery_code} onChange={this.onSetDeliveryCode.bind(this)}/>  */}
                                      <TextField fullWidth multiline id="delivery_code" label="หมายเลขส่งสินค้า" variant="outlined" value={this.state.delivery_code} onChange={this.onSetDeliveryCode.bind(this)}/>
                                      <Button onClick={this.onSenderID.bind(this,item.key,item.keyorder)}>บันทึก</Button>
                                      </Col>
                                      <Col xs={2}>
                                        <img onClick={this.onClickReceipt.bind(this,item.img_receipt,item.key,item.keyorder)} width="100%" src={item.img_receipt} />
                                      </Col>
                                    </Row>
                                    <hr/>
                                    <p className="text-order-price">ราคา ฿{item.price}</p>
                                    <Button outline color="info" size="sm" value={item.key} onClick={this.viewDetailsOrder.bind(this,item.key,item.keyorder)}>รายละเอียด</Button> {' '}
                                    <Button outline color="danger" size="sm" value={item.key} onClick="">cancel</Button>
                                  </CardBody>
                              </Card>
                            ))}
                        </TabPane>
                        <TabPane tabId="2">
                          <h2>Products <Button outline onClick={this.addPeroduct.bind(this)}>เพิ่ม</Button></h2>
                          {this.state.dataProducts.map(item => (
                              <Card className="card-view-cart" key={item.keyid}>
                                  <CardBody>
                                    <Row>
                                      <Col xs={12} md={4}>
                                        <img src={item.picture} width="100%"/>
                                      </Col>
                                      <Col xs={12} md={8}>
                                        {item.keyid}<br/>
                                        {item.name_product}<br/>
                                        ราคา {item.price_product} .-<br/>
                                        จำนวน {item.amount_product} ชิ้น
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
                                {/* <Label for="exampleZip">promotion</Label>
                                <Input type="select" name="select" id="exampleSelect" onChange={this.onChangePromotion.bind(this)} value={this.state.isShowPromotion}>     
                                  <option value="true">เปิด</option>
                                  <option value="false">ปิด</option>
                                </Input> */}

                                <TextField
                                  id="filled-select-currency"
                                  select
                                  label="promotion"
                                  value={this.state.isShowPromotion}
                                  onChange={this.onChangePromotion.bind(this)}
                                  helperText=""
                                  variant="outlined"
                                  fullWidth
                                  >
                                    <MenuItem key={true} value={true}>
                                      เปิด
                                    </MenuItem>
                                    <MenuItem key={false} value={false}>
                                      ปิด
                                    </MenuItem>
                                </TextField>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                            <FormGroup>
                                {/* <Label for="exampleZip">ปรับปรุงเว็บไซต์</Label>
                                <Input type="select" name="select" id="exampleSelect" onChange={this.onChangePage.bind(this)} value={this.state.isPage}>     
                                  <option value="true">เปิด</option>
                                  <option value="false">ปิด</option>
                                </Input> */}
                                <TextField
                                  id="filled-select-currency"
                                  select
                                  label="ปรับปรุงเว็บไซต์"
                                  value={this.state.isPage}
                                  onChange={this.onChangePage.bind(this)}
                                  helperText=""
                                  variant="outlined"
                                  fullWidth
                                  >
                                    <MenuItem key={true} value={true}>
                                      เปิด
                                    </MenuItem>
                                    <MenuItem key={false} value={false}>
                                      ปิด
                                    </MenuItem>
                                </TextField>
                              </FormGroup>
                            </Col>
                          </Row>
                        </TabPane>
                    </TabContent>
                  </Col>
                </Row>
              </Container>
              <Modal id="user-alert" isOpen={this.state.isShowReceipt} toggle={this.onHide.bind(this)} fade={false} centered>
                        <ModalBody>
                          <img width="100%" src={this.state.urlImgReceipt} /><br/><br/>
                          <center>
                            <Button color="success" onClick={this.confirmReceipt.bind(this)}>ยืนยันใบเสร็จ</Button> <Button outline color="danger" onClick={this.onHide.bind(this)}>ปิด</Button>
                          </center>
                        </ModalBody>
              </Modal>

              <Modal id="user-alert-login" isOpen={this.state.isShowLogin} fade={false} centered>
                  <ModalBody>
                    {/* <h2>เข้าสู่ระบบ</h2> */}
                    <Row>
                      <Col xs={10}>
                        {/* <Input type="text" height="100%" value={this.state.textlogin} onChange={this.onChangeLogin.bind(this)}></Input> */}
                        <TextField fullWidth id="idUser" label="เข้าสู่ระบบ" variant="outlined" value={this.state.textlogin} onChange={this.onChangeLogin.bind(this)} />
                      </Col>
                      <Col xs={2}>
                        <Button onClick={this.onClickLogin.bind(this)} className="btn-ok-login">
                          <svg width="100%" height="100%" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-right" class="svg-inline--fa fa-arrow-right fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path></svg>
                        </Button>
                      </Col>
                    </Row>
                    
                          
                  </ModalBody>
              </Modal>
            </div>
        )
    }
}