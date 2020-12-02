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
import { Container, Row, Col } from 'reactstrap';
import {Modal, ModalBody, PopoverBody } from 'reactstrap';
import {
    Card, CardImg, CardText, CardBody, CardLink,
    CardTitle, CardSubtitle
  } from 'reactstrap';
import { Masonry } from './Masonry';
import { Link } from "react-router-dom";
import './Shop.css';
import './ShopUser.css';
import './ShopStoreRegister.css';
import img_cart from '../assets/img/basket.svg'
import img_arrow from '../assets/img/arrow.svg'
import img_err from '../assets/img/error.svg'
import img_login from '../assets/img/web-login.png'
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import Lottie from 'react-lottie';
import animationData from '../assets/img/freelancers-life.json'
import animationError from '../assets/img/connection-error.json'
import { Form, FormGroup, Label } from 'reactstrap';

import * as firebase from 'firebase';
import img_fab from '../assets/img/fab-shop.svg'
import shop from '../assets/img/shop.png'
import shop_register from '../assets/img/shop_register.png'

import dataJson from '../api/raw_database.json'
import ShopFooter from './ShopFooter'
import duck_logo from '../assets/img/duck-blue-style.json';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
// import Button from '@material-ui/core/Button';
import {Button} from 'reactstrap';
import axios from 'axios';

export default class ShopStoreRegister extends React.Component {

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
            speed: 1,
            isShowError: false,
            textError: "",
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
            zipcode: zipcode[0],
            isLogining: false
        };

        this.goBack = this.goBack.bind(this);
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        var id = localStorage.getItem('store_id');
        console.log(id)
        if (id !== null && id !== 'null')  {
          this.props.history.push('/shop-dashboard');
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
    }

      login () {
        this.setState({speed:2.5})
        console.log(this.state.idUser)
        this.setState({isLogining: true})
        if (this.state.idUser !== 'undefined' && this.state.idUser !== undefined && this.state.idUser !== '') {
          const dataUser = firebase.database().ref('userwebstore/'+this.state.idUser);
          dataUser.on('value', (snapshot) => {
            try {
              let DataShop = snapshot.val();
              console.log(DataShop)
              if (DataShop !== null) {
                localStorage.setItem('store_id', this.state.idUser);
                localStorage.setItem('store_province', DataShop.province);
                localStorage.setItem('store_amphoe', DataShop.amphoe);
                localStorage.setItem('store_district', DataShop.district);
                let dataLine = {
                  message: "shop_id:"+this.state.idUser+"\n Login..."
                }
                this.sendNotification(dataLine)
                setTimeout(function() { //Start the timer
                  this.props.history.push('/shop-dashboard')
                  this.setState({speed:1})
                }.bind(this), 1500) 
              } else {
                // this.setState({isError:true})
                this.setState({isShowError:true,textError:"กรุณากรอก รหัสที่ถูกต้อง ใหม่อีกครั้ง"})
                this.setState({speed:1})
                this.setState({isLogining: false})
              }
            }catch(err) {
              this.setState({isLogining: false})
            }
          });
        } else {
          this.setState({speed:1})
          this.setState({isShowError:true,textError:"กรุณากรอก รหัสที่ถูกต้อง ใหม่อีกครั้ง"})
          this.setState({isLogining: false})
        }
      }

      register() {
        if (this.state.firstname !== '' && this.state.lastname !== '' && this.state.address !== '' && this.state.phone !== '' && this.state.email !== '' && this.state.province !== '' && this.state.amphoe !== '' && this.state.district !== '' && this.state.zipcode !== '') {
          this.setState({speed:2.5})
          this.setState({isLogining: true})
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
            zipcode: this.state.zipcode,
            status_register: 0,
            status_add_product: 0,
            message: "",
            rule: 'store',
            confirm_email: 0
          }
          var newUser = dataRef.ref("userwebstore").push(data).then(function (snapshot) {
              console.log("success")
              console.log(snapshot.key)
              localStorage.setItem('store_id', snapshot.key);
              localStorage.setItem('store_province', data.province);
              localStorage.setItem('store_amphoe', data.amphoe);
              localStorage.setItem('store_district', data.district);
              context.setState({isLogining: false,speed:1})
              data['key'] = snapshot.key
              context.saveReportShop(data)
              let dataLine = {
                message: "shop_id:"+snapshot.key
              }
              context.sendNotification(dataLine)
              context.props.history.push('/shop-dashboard/')
              }, function () {
              console.log('rejected promise')
          }).catch((e) => console.log(e))
        } else {
          this.setState({isShowError:true,textError:"กรุณากรอก ข้อมูลที่ถูกต้อง ใหม่อีกครั้ง"})
        }
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

      onHide() {
        this.setState({isShowError:false})
      }

      saveReportShop(data) {
        console.log(data)
        axios.post("https://api-duckfollow.herokuapp.com/shop/save",data,{
        })
        .then(response => {
              console.log("response: ", response)
              // do something about response
        })
        .catch(err => {
              console.error(err)
        })
      }

      sendNotification(data) {
        console.log(data)
        axios.post("https://api-duckfollow.herokuapp.com/line/send",data,{
        })
        .then(response => {
              console.log("response: ", response)
              // do something about response
        })
        .catch(err => {
              console.error(err)
        })
      }

    render() {
        const defaultOptions = {
            loop: true,
            autoplay: true, 
            animationData: duck_logo,
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
                            
                            </NavbarText>
                            {/* </Collapse> */}
                    </Navbar>               
                </Container>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                <Container fluid={true}>
                    <Row>
                        {/* <Col md={1}></Col> */}
                        <Col xs={{ size: 12, order: 2}} md={{ size: 6, order: 1}} className="content-center">
                          <h1>
                            Welcome <br/>
                            Back Shop
                          </h1>
                          <br/>
                          {/* <Lottie options={defaultOptions}
                              height={300}
                              width={300}
                              speed={this.state.speed}
                              isStopped={this.state.isStopped}
                              isPaused={this.state.isPaused}/> */}
                              {/* <img width="100%" src={img_login}/> */}
                          {/* <Label for="examplePassword" className="mr-sm-2">ใส่รหัสของคุณ (User ID)</Label> */}
                          {/* <Form inline>
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                              <Input type="text" placeholder=""  />
                              <Button  className="btn-width">ตกลง</Button>
                            </FormGroup>
                            
                          </Form> */}
                          <Row>
                            <Col xs={9}>
                                {/* <Input onChange={this.onChangeIdUser} className="form_input-login" type="text"/> */}
                                <TextField fullWidth id="idUser" label="ใส่รหัสของคุณ (User ID)" variant="outlined" value={this.state.idUser} onChange={this.onChangeIdUser} />
                            </Col>
                            <Col xs={3}>
                                <Button className="btn-ok-login" size="lg" color="primary" outline onClick={this.login.bind(this)}><svg width="25px" height="25px" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-right" class="svg-inline--fa fa-arrow-right fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path></svg></Button>
                            </Col>
                          </Row>
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
                        {/* <Col md={1}></Col> */}
                        <Col xs={{ size: 12, order: 1}} md={{ size: 6, order: 2}}>
                          <img src={shop} className="img-login"/>
                        </Col>
                        {/* <Col md={1}></Col> */}
                    </Row>

                    <Row>
                        <Col md={1}></Col>
                        <Col xs={12} md={4} className="content-center">
                          <img src={shop_register} className="img-login"/>
                          <p align="center">ลงทะเบียนเป็นร้านค้ากับเราได้แล้ววันนี้ฟรี</p>
                        </Col>
                        <Col md={1}></Col>
                        <Col xs={12} md={5}>
                        <h1>ลงทะเบียน</h1>
                          <Form>
                            <Row form>
                              <Col xs={6} md={6}>
                                <FormGroup>
                                  <TextField fullWidth id="firstname" label="ชื่อ" variant="outlined" value={this.state.firstname} onChange={this.onChangeFirstName} />
                                </FormGroup>
                              </Col>
                              <Col xs={6} md={6}>
                                <FormGroup>
                                  <TextField fullWidth id="lastname" label="นามสกุล" variant="outlined" value={this.state.lastname} onChange={this.onChangeLastName}/>
                                </FormGroup>
                              </Col>
                            </Row>
                            <FormGroup>
                              <TextField fullWidth id="phone" label="เบอร์โทรศัพท์" variant="outlined" value={this.state.phone} onChange={this.onChangePhone.bind(this)}/>
                            </FormGroup>
                            <FormGroup>
                              <TextField fullWidth id="email" label="อีเมล" variant="outlined" value={this.state.email} onChange={this.onChangeEmail.bind(this)}/>
                            </FormGroup>
                            <FormGroup>
                              <TextField fullWidth multiline id="address" label="ที่อยู่" variant="outlined" value={this.state.address} onChange={this.onChangeAddress}/>
                            </FormGroup>
                            <FormGroup>
                              <TextField
                                id="filled-select-currency"
                                select
                                label="จังหวัด"
                                value={this.state.province}
                                onChange={this.onChangeProvince.bind(this)}
                                helperText=""
                                variant="outlined"
                                fullWidth
                              >
                                {this.state.dataProvince.map((item,index) => (
                                  <MenuItem key={this.state.dataProvince[index]} value={this.state.dataProvince[index]}>
                                    {this.state.dataProvince[index]}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </FormGroup>
                            <FormGroup>
                              <TextField
                                id="filled-select-currency"
                                select
                                label="อำเภอ"
                                value={this.state.amphoe}
                                onChange={this.onChangeAmphoe.bind(this)}
                                helperText=""
                                variant="outlined"
                                fullWidth
                              >
                                {this.state.dataAmphoe.map((item,index) => (
                                  <MenuItem key={this.state.dataAmphoe[index]} value={this.state.dataAmphoe[index]}>
                                    {this.state.dataAmphoe[index]}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </FormGroup>
                            <Row form>
                              <Col md={8}>
                                <FormGroup>
                                  <TextField
                                    id="filled-select-currency"
                                    select
                                    label="ตำบล"
                                    value={this.state.district}
                                    onChange={this.onChangeDistrict.bind(this)}
                                    helperText=""
                                    variant="outlined"
                                    fullWidth
                                  >
                                    {this.state.dataDistrict.map((item,index) => (
                                      <MenuItem key={this.state.dataDistrict[index]} value={this.state.dataDistrict[index]}>
                                        {this.state.dataDistrict[index]}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup>
                                  <TextField
                                    id="filled-select-currency"
                                    select
                                    label="รหัสไปรษณีย์"
                                    value={this.state.zipcode}
                                    onChange={this.onChangeZipCode.bind(this)}
                                    helperText=""
                                    variant="outlined"
                                    fullWidth
                                  >
                                    {this.state.dataZipcode.map((item,index) => (
                                      <MenuItem key={this.state.dataZipcode[index]} value={this.state.dataZipcode[index]}>
                                        {this.state.dataZipcode[index]}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </FormGroup>  
                              </Col>
                            </Row>
                            <Button size="lg" outline color="success" onClick={this.register} className="btn-register">ลงทะเบียน</Button>
                          </Form>
                        </Col>
                        <Col md={1}></Col>
                    </Row>
                </Container>

                <br/>
                <br/>
                <br/>

                <Container fluid={true}>
                  <ShopFooter/>
                </Container>

                <Modal id="login-error" isOpen={this.state.isShowError} toggle={this.onHide.bind(this)} fade={false} centered>
                    <ModalBody>
                      <center>
                        <h3 className="txt-header-sub">ลองใหม่อีกครั้ง</h3>
                        <p>{this.state.textError}</p>
                        <Button color="success" onClick={this.onHide.bind(this)}>ปิด</Button>
                      </center>
                    </ModalBody>
                </Modal>

                <Modal id="logining" isOpen={this.state.isLogining} fade={false} centered>
                   <center>
                        <Lottie options={defaultOptions}
                          height={200}
                          width={200}
                          speed={this.state.speed}
                          isStopped={this.state.isStopped}
                          isPaused={this.state.isPaused}/>
                   </center>
                </Modal>
            </div>

        )
    }
}