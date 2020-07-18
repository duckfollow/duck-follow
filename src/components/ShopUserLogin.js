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
import img_err from '../assets/img/error.svg'
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import Lottie from 'react-lottie';
import animationData from '../assets/img/freelancers-life.json'
import animationError from '../assets/img/connection-error.json'
import { Form, FormGroup, Label } from 'reactstrap';

import * as firebase from 'firebase';
import img_fab from '../assets/img/fab-shop.svg'

import dataJson from '../api/raw_database.json'

export default class ShopUserLogin extends React.Component {

    constructor(props) {
        super(props);
        var province = []
        dataJson.forEach(function(element) {
          province.push(element.province)
        });

        province = province.filter((v, i, a) => a.indexOf(v) === i);        
        var amphoe = []
        let dataAmphoe = dataJson.filter(a => a.province == province[0])
        dataAmphoe.forEach(function(element) {
          amphoe.push(element.amphoe)
        });
        amphoe = amphoe.filter((v, i, a) => a.indexOf(v) === i);
        console.log(amphoe)

        var district = []
        let dataDistrict = dataJson.filter(a => a.province == province[0] && a.amphoe == amphoe[0])
        dataDistrict.forEach(function(element) {
          district.push(element.district)
        });
        district = district.filter((v, i, a) => a.indexOf(v) === i);

        var zipcode = []
        let dataZipcode = dataJson.filter(a => a.province == province[0] && a.amphoe == amphoe[0] && a.district == district[0])
        dataZipcode.forEach(function(element) {
          zipcode.push(element.zipcode)
        });
        zipcode = zipcode.filter((v, i, a) => a.indexOf(v) === i);

        this.state = {
            dataCart:[],
            isStopped: false, 
            isPaused: false,
            idUser:'',
            isError: false,
            firstname:'',
            lastname: '',
            phone: '',
            email: '',
            address: '',
            dataProvince:province,
            province: province[0],
            dataAmphoe:amphoe,
            amphoe: amphoe[0],
            dataDistrict: district,
            district: district[0],
            dataZipcode: zipcode,
            zipcode: zipcode[0]
        };

        this.goBack = this.goBack.bind(this);
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        var id = localStorage.getItem('id');
        console.log(id)
        if (id !== null && id !== 'null')  {
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
      document.title = "duck shop - ร้านค้าออนไลน์"
      let favicon = document.getElementById("favicon");
      favicon.href = img_fab;

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
          try {
            let freBaseData = snapshot.val();
            console.log(freBaseData)
            if (freBaseData !== null) {
              localStorage.setItem('id', this.state.idUser);
              localStorage.setItem('firstname', freBaseData.firstname);
              localStorage.setItem('lastname', freBaseData.lastname);
              localStorage.setItem('address', freBaseData.address);
              this.props.history.push('/profile')
            } else {
              this.setState({isError:true})
            }
          }catch(err) {

          }
        });
      }

      register() {
        const dataRef = firebase.database()
        const context = this
        var data = {
          firstname: this.state.firstname,
          lastname: this.state.lastname,
          address: this.state.address,
          phone: this.state.phone,
          email: this.state.email,
          province: this.state.province,
          amphoe: this.state.amphoe,
          district: this.state.district,
          zipcode: this.state.zipcode
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
      
      onChangePhone(event) {
        this.setState({phone: event.target.value});
      }

      onChangeEmail(event) {
        this.setState({email: event.target.value});
      }

      onChangeAddress(event) {
        this.setState({address: event.target.value});
      }

      onChangeIdUser(event) {
        this.setState({idUser: event.target.value});
      }

      onChangeProvince(event) {
        console.log(event.target.value)
        this.setState({province: event.target.value})
        var amphoe = []
        let dataAmphoe = dataJson.filter(a => a.province == event.target.value)
        dataAmphoe.forEach(function(element) {
          amphoe.push(element.amphoe)
        });
        amphoe = amphoe.filter((v, i, a) => a.indexOf(v) === i);
        console.log(amphoe)
        this.setState({dataAmphoe:amphoe})

        this.setState({amphoe: amphoe[0]})
        var district = []
        let dataDistrict = dataJson.filter(a => a.province == event.target.value && a.amphoe == amphoe[0])
        dataDistrict.forEach(function(element) {
          district.push(element.district)
        });
        district = district.filter((v, i, a) => a.indexOf(v) === i);
        console.log(district)
        this.setState({dataDistrict:district})

        this.setState({district: district[0]})
        var zipcode = []
        let dataZipcode = dataJson.filter(a => a.province == event.target.value && a.amphoe == amphoe[0] && a.district == district[0])
        dataZipcode.forEach(function(element) {
          zipcode.push(element.zipcode)
        });
        zipcode = zipcode.filter((v, i, a) => a.indexOf(v) === i);
        console.log(zipcode)
        this.setState({dataZipcode:zipcode})
        this.setState({zipcode: zipcode[0]})
      }

      onChangeAmphoe(event) {
        this.setState({amphoe: event.target.value})
        var district = []
        let dataDistrict = dataJson.filter(a => a.province == this.state.province && a.amphoe == event.target.value)
        dataDistrict.forEach(function(element) {
          district.push(element.district)
        });
        district = district.filter((v, i, a) => a.indexOf(v) === i);
        console.log(district)
        this.setState({dataDistrict:district})
        this.setState({district:district[0]})

        var zipcode = []
        let dataZipcode = dataJson.filter(a => a.province == this.state.province && a.amphoe == event.target.value && a.district == district[0])
        dataZipcode.forEach(function(element) {
          zipcode.push(element.zipcode)
        });
        zipcode = zipcode.filter((v, i, a) => a.indexOf(v) === i);
        console.log(zipcode)
        this.setState({dataZipcode:zipcode})
      }

      onChangeDistrict(event) {
        console.log(event.target.value)
        this.setState({district: event.target.value})
        var zipcode = []
        let dataZipcode = dataJson.filter(a => a.province == this.state.province && a.amphoe == this.state.amphoe && a.district == event.target.value)
        dataZipcode.forEach(function(element) {
          zipcode.push(element.zipcode)
        });
        zipcode = zipcode.filter((v, i, a) => a.indexOf(v) === i);
        console.log(zipcode)
        this.setState({dataZipcode:zipcode})
        this.setState({zipcode:zipcode[0]})
      }

      onChangeZipCode(event) {
        this.setState({
          zipcode:event.target.value
        })
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

        const animError = {
          loop: true,
          autoplay: true, 
          animationData: animationError,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
          }
      };
        return (
            <div>
                <Container className="fixed-top">
                    <Navbar style={{backgroundColor: '#008577'}} expand="md" className="nav-bar-border">
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
                          {
                            this.state.isError?
                            // <Card>
                            //   <CardBody>
                            //   <Lottie options={animError}
                            //     height={50}
                            //     width={50}
                            //     isStopped={this.state.isStopped}
                            //     isPaused={this.state.isPaused}/>
                            //     ไม่พบรหัสใช้งาน
                            //   </CardBody>
                            // </Card>
                            <div className="view-error">
                              <img src={img_err} width="20px" height="auto" />
                              ไม่พบรหัสใช้งาน
                            </div>
                            :null
                          }
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
                              <Label for="exampleAddress">เบอร์โทรศัพท์</Label>
                              <Input type="phone" value={this.state.phone} onChange={this.onChangePhone.bind(this)}/>
                            </FormGroup>
                            <FormGroup>
                              <Label for="exampleAddress">อีเมล</Label>
                              <Input type="text" id="exampleAddress" placeholder="1234 Main St" value={this.state.email} onChange={this.onChangeEmail.bind(this)}/>
                            </FormGroup>
                            <FormGroup>
                              <Label for="exampleAddress">ที่อยู่</Label>
                              <Input type="text" id="exampleAddress" placeholder="1234 Main St" value={this.state.address} onChange={this.onChangeAddress}/>
                            </FormGroup>
                            <FormGroup>
                              <Label for="exampleAddress">จังหวัด</Label>
                              <Input type="select" name="select" id="exampleSelect" onChange={this.onChangeProvince.bind(this)} value={this.state.province}>
                                    {this.state.dataProvince.map((item,index) => (
                                        <option value={this.state.dataProvince[index]}>{this.state.dataProvince[index]}</option>
                                    ))}
                                  </Input>
                            </FormGroup>
                            <FormGroup>
                                  <Label for="exampleCity">อำเภอ</Label>
                                  <Input type="select" name="select" id="exampleSelect" onChange={this.onChangeAmphoe.bind(this)} value={this.state.amphoe}>
                                    {this.state.dataAmphoe.map((item,index) => (
                                        <option value={this.state.dataAmphoe[index]}>{this.state.dataAmphoe[index]}</option>
                                    ))}
                                  </Input>
                            </FormGroup>
                            <Row form>
                              <Col md={8}>
                                <FormGroup>
                                  <Label for="exampleState">ตำบล</Label>
                                  <Input type="select" name="select" id="exampleSelect" onChange={this.onChangeDistrict.bind(this)} value={this.state.district}>
                                    {this.state.dataDistrict.map((item,index) => (
                                        <option value={this.state.dataDistrict[index]}>{this.state.dataDistrict[index]}</option>
                                    ))}
                                  </Input>
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup>
                                  <Label for="exampleZip">รหัสไปรษณีย์</Label>
                                  <Input type="select" name="select" id="exampleSelect" onChange={this.onChangeZipCode.bind(this)} value={this.state.zipcode}>
                                    {this.state.dataZipcode.map((item,index) => (
                                        <option value={this.state.dataZipcode[index]}>{this.state.dataZipcode[index]}</option>
                                    ))}
                                  </Input>
                                </FormGroup>  
                              </Col>
                            </Row>
                            <Button outline color="success" onClick={this.register} className="btn-register">ลงทะเบียน</Button>
                          </Form>
                        </Col>
                    </Row>
                </Container>

                <br/>
                <br/>
                <br/>

                <Container fluid={true}>
                  <Jumbotron className="footer-custom">
                        
                        <Row>
                            <Col xs={12} md={3}></Col>
                            <Col xs={12} md={3}>
                                <h6>ติดต่อได้ที่</h6>
                                <p>50 หมุ่ 18 ต.สำราญใต้ อ.สามชัย จ.กาฬสินธุ์ 46180 เบอร์โทรติดต่อ 090 9931 282</p>
                            </Col>
                            <Col xs={12} md={3}></Col>
                            <Col xs={12} md={3}></Col>
                        </Row>
                        <hr className="my-2" />
                        <p>@copy right duckfollow 2020</p>
                    </Jumbotron>
                </Container>

            </div>

        )
    }
}