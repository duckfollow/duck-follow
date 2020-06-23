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
import { Jumbotron, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
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
import profile from '../assets/img/user.png';
import img_camera from '../assets/img/ar-camera.svg';
import img_logout from '../assets/img/logout.svg'
import img_qr_code from '../assets/img/qr-code.svg'
import {Dropdown} from 'reactstrap';
import { TabContent, TabPane} from 'reactstrap';
import classnames from 'classnames';
import {Form} from 'reactstrap';

import in_love from '../assets/img/in-love.svg'
import smiling from '../assets/img/smiling.svg'
import confused from '../assets/img/confused.svg'
import sad from '../assets/img/sad.svg'
import unhappy from '../assets/img/unhappy.svg'

import * as firebase from 'firebase';

export default class ShopUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataOrder: [],
            dataDelivery: [],
            dataCancel: [],
            dataCart:[],
            dataSuccess: [],
            activeTab: '1',
            file: [],
            firstname: '',
            lastname: '',
            address:'',
            profile_picture: profile,
            isUpload:false,
            isReview: false,
            idOrder: ""
        };
        this.goBack = this.goBack.bind(this);
        this.logout = this.logout.bind(this);
    }

    goBack(){
        this.props.history.push('/shop')
    }

    logout() {
        localStorage.clear();
        this.goBack()
    }

    componentDidMount(){
      var id = localStorage.getItem('id');
      if (id === null) {
        var id = 'id'
      }
      const dataUser = firebase.database().ref('userweb/'+id);
      dataUser.on('value', (snapshot) => {
        let freBaseData = snapshot.val();
        localStorage.setItem('id', id);
        localStorage.setItem('firstname', freBaseData.firstname);
        localStorage.setItem('lastname', freBaseData.lastname);
        localStorage.setItem('address', freBaseData.address);
        this.setState({
          firstname: freBaseData.firstname,
          lastname: freBaseData.lastname,
          address: freBaseData.address,
          profile_picture:freBaseData.profile_picture
        })
      });

      const dataCart = firebase.database().ref('cartweb/'+id);
    
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

      const dataOrder = firebase.database().ref('orderweb/'+id);
      // lrHUnb9xep9Pz88jHl36q7p8i07nsK5qKHDNS1kD729
      dataOrder.on('value', (snapshot) => {
        var dataListOrder = []
        var dataListDelivary = []
        var dataListCancel = []
        var dataListSuccess = []
        snapshot.forEach(productSnapshot => {
          let data = productSnapshot.val();
          console.log(data)
          if (data.status == 0) {
            dataListOrder.push({
              img: data.product[0].picture,
              product: data.product,
              key:productSnapshot.key,
              date_order: data.date_order,
              price:data.price,
              status:data.status
            })
          } else if (data.status == 1) {
            dataListDelivary.push({
              key:productSnapshot.key,
              date_order: data.date_order,
              price:data.price,
              status:data.status
            })
          } else if (data.status == 2) {
            dataListSuccess.push({
              key:productSnapshot.key,
              date_order: data.date_order,
              price:data.price,
              status:data.status
            })
          } else if (data.status == 3) {
            dataListCancel.push({
              key:productSnapshot.key,
              date_order: data.date_order,
              price:data.price,
              status:data.status
            })
          }

        });
       
        var dataListOrderSort = dataListOrder.sort(function(a, b) {
          return (a.date_order > b.date_order) ? -1 : ((a.date_order < b.date_order) ? 1 : 0);
        });

        var dataListDelivarySort = dataListDelivary.sort(function(a, b) {
          return (a.date_order > b.date_order) ? -1 : ((a.date_order < b.date_order) ? 1 : 0);
        });

        var dataListCancelSort = dataListCancel.sort(function(a, b) {
          return (a.date_order > b.date_order) ? -1 : ((a.date_order < b.date_order) ? 1 : 0);
        });

        var dataListSuccessSort = dataListSuccess.sort(function(a, b) {
          return (a.date_order > b.date_order) ? -1 : ((a.date_order < b.date_order) ? 1 : 0);
        });
        this.setState({
          dataOrder:dataListOrderSort,
          dataDelivery: dataListDelivarySort,
          dataCancel: dataListCancelSort,
          dataSuccess: dataListSuccessSort
        })
      });
    }

    toggle(i) {
      this.setState({activeTab:i})
    }

    handleViewOrder(event) {
      console.log(event)
      const key_value = event
      this.props.history.push('/invoice/'+key_value)
    }

    handleCancelOrder(event) {
      console.log(event)
      const dataRef = firebase.database()
      const key_value = event
      var today = (new Date()).toISOString()
      var id = localStorage.getItem('id');
      dataRef.ref("orderweb/"+id+"/"+key_value).update({
        status: 3,
        date_cancel: today
        }).then(function () {
          console.log("success")
          alert("cancel success")
          }, function () {
          console.log('rejected promise')
      }).catch((e) => console.log(e))
    }

    handleSuccessOrder(event) {
      console.log(event)
      const dataRef = firebase.database()
      const key_value = event
      this.setState({idOrder:key_value})
      var today = (new Date()).toISOString()
      var id = localStorage.getItem('id');
      var context = this
      dataRef.ref("orderweb/"+id+"/"+key_value).update({
        status: 2,
        date_success: today
        }).then(function () {
          console.log("success")
          context.setState({
            isReview: true
          })
          }, function () {
          console.log('rejected promise')
      }).catch((e) => console.log(e))
    }

    clickRating(rating) {
      const dataRef = firebase.database()
      const key_value = this.state.idOrder
      var rating = rating
      var today = (new Date()).toISOString()
      var id = localStorage.getItem('id');
      var context = this
      dataRef.ref("orderweb/"+id+"/"+key_value).update({
        rating: rating,
        date_review: today
        }).then(function () {
          console.log("success")
          context.setState({
            isReview: false
          })
          }, function () {
          console.log('rejected promise')
      }).catch((e) => console.log(e))
    }

    cancelReview() {
      this.setState({isReview:false})
    }

    handleChange(event) {
      let reader = new FileReader();
      const files = event.target.files[0];
      //this.setState({file:files});
      reader.onloadend = () => {
        this.setState({
          file: files,
          profile_picture: reader.result,
          isUpload:true
        });
      }
      reader.readAsDataURL(files)
  }

  uploadToFirebase(event) {
    const dataRef = firebase.database()
    const storageRef = firebase.storage().ref();
    var id = localStorage.getItem('id');
    var context = this
    storageRef.child(`users/${this.state.file.name}`).put(this.state.file).then((snapshot) => {
        alert('Uploaded a blob or file!');
        var starsRef = storageRef.child(`users/${this.state.file.name}`);
        
        starsRef.getDownloadURL().then(function(url) {
            console.log(url)
            dataRef.ref("userweb/"+id).update({
                profile_picture : url
              }).then(function () {
                console.log("success")
                context.setState({isUpload:false})
                }, function () {
                console.log('rejected promise')
            }).catch((e) => console.log(e))
              
          }).catch(function(error) {
          
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/object-not-found':
                // File doesn't exist
                break;
          
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;
          
              case 'storage/canceled':
                // User canceled the upload
                break
          
              case 'storage/unknown':
                // Unknown error occurred, inspect the server response
                break;
            }
          });

    });
    event.preventDefault();
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
                    <Container>
                    <Row>
                      <Col md="4">
                        <br/>
                        <div>
                          <center>
                            <div class="profile-userpic">
                                <img className="img" src={this.state.profile_picture} alt=""/>
                                <div className="img-camera">
                                  <img className="img-responsive" width={10} height={10} src={img_camera}/>
                                </div> 
                                <input className="inputfile" type="file" name="file" onChange={this.handleChange.bind(this)} accept="image/*"/> 
                            </div>
                            {this.state.isUpload?
                              <Form onSubmit={this.uploadToFirebase.bind(this)}>
                                <Button outline color="primary" size="sm">upload</Button>
                              </Form>
                              :null
                            }
                          </center>
                        </div>
                        <Container>
                          {/* <Row>
                            <Col xs={4}><img className="img-menu" onClick={this.logout} src={img_logout}/></Col>
                            <Col xs={4}><img className="img-menu" onClick={this.logout} src={img_logout}/></Col>
                            <Col xs={4}><img className="img-menu" onClick={this.logout} src={img_logout}/></Col>
                          </Row> */}
                            <div className="view-menu">
                              <a href="https://github.com/DuckFollowTK">
                                <img src={img_qr_code} className="menu-width" alt="logo" />
                              </a>
                              <a href="https://www.facebook.com/p.supancho">
                                <img src={img_logout} className="menu-width" alt="logo" />
                              </a>
                              <a href="https://www.instagram.com/tankps/">
                                <img src={img_logout} className="menu-width" alt="logo" />
                              </a>
                              <a href="https://twitter.com/slammonder">
                                <img src={img_logout} className="menu-width" alt="logo" />
                              </a>
                            </div>
                            <Card>
                              <CardBody>
                                {this.state.firstname} {this.state.lastname}<br/>
                                ที่อยู่
                                {this.state.address}
                              </CardBody>
                            </Card>
                        </Container>
                      </Col>
                      <Col md="8">
                        <br/>
                        <Container className="page__tabs-container">
                          <Row>
                            <Col xs={6} md={3}><Button className={classnames({'btn-tabs':true,'btn-tabs-active': this.state.activeTab === '1' })} onClick={this.toggle.bind(this,'1')}>order {this.state.dataOrder.length >0? <Badge color="danger">{this.state.dataOrder.length}</Badge> :null}</Button></Col>
                            <Col xs={6} md={3}><Button className={classnames({'btn-tabs':true,'btn-tabs-active': this.state.activeTab === '2' })} onClick={this.toggle.bind(this,'2')}>delivary {this.state.dataDelivery.length >0? <Badge color="danger">{this.state.dataDelivery.length}</Badge> :null}</Button></Col>
                            <Col xs={6} md={3}><Button className={classnames({'btn-tabs':true,'btn-tabs-active': this.state.activeTab === '3' })} onClick={this.toggle.bind(this,'3')}>success {this.state.dataSuccess.length >0? <Badge color="danger">{this.state.dataSuccess.length}</Badge> :null}</Button></Col>
                            <Col xs={6} md={3}><Button className={classnames({'btn-tabs':true,'btn-tabs-active': this.state.activeTab === '4' })} onClick={this.toggle.bind(this,'4')}>cancel {this.state.dataCancel.length >0? <Badge color="danger">{this.state.dataCancel.length}</Badge> :null}</Button></Col>
                          </Row>
                        </Container>
                      <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                          <Row>
                            <Col sm="12">
                              <br/>
                            {this.state.dataOrder.map(item => (
                              <Card className="card-view-cart" key={item.key}>
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
                                    <Button outline color="info" size="lg" value={item.key} onClick={this.handleViewOrder.bind(this,item.key)}>รายละเอียด</Button> {' '}
                                    <Button outline color="danger" size="lg" value={item.key} onClick={this.handleCancelOrder.bind(this,item.key)}>cancel</Button>
                                  </CardBody>
                              </Card>
                            ))}
                            </Col>
                          </Row>
                        </TabPane>
                        <TabPane tabId="2">
                          <br/>
                          {this.state.dataDelivery.map(item => (
                              <Card className="card-view-cart" key={item.key}>
                                  <CardBody>
                                    {item.key}<br/>
                                    {item.date_order}<br/>
                                    ราคา {item.price}
                                    <Button outline color="info" size="sm" value={item.key} onClick={this.handleViewOrder.bind(this,item.key)}>view</Button>
                                    <Button outline color="success" size="sm" value={item.key} onClick={this.handleSuccessOrder.bind(this,item.key)}>success</Button>
                                  </CardBody>
                              </Card>
                            ))}
                        </TabPane>
                        <TabPane tabId="3">
                          <Row>
                            <Col sm="12">
                              <br/>
                            {this.state.dataSuccess.map(item => (
                              <Card className="card-view-cart" key={item.key}>
                                  <CardBody>
                                    {item.key}<br/>
                                    {item.date_order}<br/>
                                    ราคา {item.price}
                                    <Button outline color="info" size="sm" value={item.key} onClick={this.handleViewOrder.bind(this,item.key)}>view</Button>
                                  </CardBody>
                              </Card>
                            ))}
                            </Col>
                          </Row>
                        </TabPane>
                        <TabPane tabId="4">
                          <Row>
                            <Col sm="12">
                              <br/>
                            {this.state.dataCancel.map(item => (
                              <Card className="card-view-cart" key={item.key}>
                                  <CardBody>
                                    {item.key}<br/>
                                    {item.date_order}<br/>
                                    ราคา {item.price}
                                    <Button outline color="info" size="sm" value={item.key} onClick={this.handleViewOrder.bind(this,item.key)}>view</Button>
                                  </CardBody>
                              </Card>
                            ))}
                            </Col>
                          </Row>
                        </TabPane>
                      </TabContent>
                      </Col>
                    </Row> 
                    </Container>
                    <Modal isOpen={this.state.isReview} fade={false} toggle={this.cancelReview.bind(this)} className="" centered>
                      {/* <ModalHeader toggle={toggle}>Modal title</ModalHeader> */}
                      <ModalBody>
                        <h6>ให้คะแนน</h6>
                        <center>
                          <div className="view-review">
                            <img src={in_love} className="icon-review" onClick={this.clickRating.bind(this,5)}/>
                            <img src={smiling} className="icon-review" onClick={this.clickRating.bind(this,4)}/>
                            <img src={confused} className="icon-review" onClick={this.clickRating.bind(this,3)}/>
                            <img src={sad} className="icon-review" onClick={this.clickRating.bind(this,2)}/>
                            <img src={unhappy} className="icon-review" onClick={this.clickRating.bind(this,1)}/>
                          </div>
                        </center>
                      </ModalBody>
                      {/* <ModalFooter>
                        <Button color="primary" onClick={toggle}>Do Something</Button>{' '}
                        <Button color="secondary" onClick={toggle}>Cancel</Button>
                      </ModalFooter> */}
                    </Modal>       
            </div>

        )
    }
}