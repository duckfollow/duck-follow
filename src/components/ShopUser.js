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
import profile from '../assets/img/user.png';
import img_camera from '../assets/img/ar-camera.svg';
import img_logout from '../assets/img/logout.svg'
import {Dropdown} from 'reactstrap';
import { TabContent, TabPane} from 'reactstrap';
import classnames from 'classnames';
import {Form} from 'reactstrap';

import * as firebase from 'firebase';

export default class ShopUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataOrder: [],
            dataCart:[],
            activeTab: '1',
            file: [],
            profile_picture: profile,
            isUpload:false
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
        this.setState({profile_picture:freBaseData.profile_picture})
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
        var dataList = []
        snapshot.forEach(productSnapshot => {
          let data = productSnapshot.val();
          console.log(data)
          dataList.push({
            key:productSnapshot.key,
            date_order: data.date_order,
            price:data.price
          })
        });
        this.setState({
          dataOrder:dataList
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
                                <input className="inputfile" type="file" name="file" onChange={this.handleChange.bind(this)} /> 
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
                          <Row>
                            <Col xs={4}><img className="img-menu" onClick={this.logout} src={img_logout}/></Col>
                            <Col xs={4}><img className="img-menu" onClick={this.logout} src={img_logout}/></Col>
                            <Col xs={4}><img className="img-menu" onClick={this.logout} src={img_logout}/></Col>
                          </Row>
                        </Container>
                      </Col>
                      <Col md="8">
                        <br/>
                      <Nav tabs>
                        <NavItem>
                          <NavLink
                            className={classnames({ active: this.state.activeTab === '1' })}
                            onClick={this.toggle.bind(this,'1')}
                          >
                            ออเดอร์ <Badge color="danger">{this.state.dataOrder.length}</Badge>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={this.toggle.bind(this,'2')}
                          >
                            กำลังจัดส่ง <Badge color="danger">0</Badge>
                          </NavLink>
                          </NavItem>
                          <NavItem>
                          <NavLink
                            className={classnames({ active: this.state.activeTab === '3' })}
                            onClick={this.toggle.bind(this,'3')}
                          >
                            รับสินค้าแล้ว <Badge color="danger">0</Badge>
                          </NavLink>
                          </NavItem>
                          <NavItem>
                          <NavLink
                            className={classnames({ active: this.state.activeTab === '4' })}
                            onClick={this.toggle.bind(this,'4')}
                          >
                            ยกเลิก <Badge color="danger">0</Badge>
                          </NavLink>
                        </NavItem>
                      </Nav>
                      <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                          <Row>
                            <Col sm="12">
                              <br/>
                            {this.state.dataOrder.map(item => (
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
                        <TabPane tabId="2">
                          <br/>
                          <Row>
                            <Col sm="6">
                              <Card body>
                                <CardTitle>Special Title Treatment</CardTitle>
                                <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                                <Button>Go somewhere</Button>
                              </Card>
                            </Col>
                            <Col sm="6">
                              <Card body>
                                <CardTitle>Special Title Treatment</CardTitle>
                                <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                                <Button>Go somewhere</Button>
                              </Card>
                            </Col>
                          </Row>
                        </TabPane>
                        <TabPane tabId="3">
                          <Row>
                            <Col sm="12">
                              <br/>
                            {this.state.dataOrder.map(item => (
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
            </div>

        )
    }
}