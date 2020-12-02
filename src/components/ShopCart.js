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
import { Badge, Modal, ModalBody } from 'reactstrap';
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
import './ShopCart.css';
import img_cart from '../assets/img/basket.svg'
import img_arrow from '../assets/img/arrow.svg'
import img_fab from '../assets/img/fab-shop.svg'
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import { Form, FormGroup, Label } from 'reactstrap';
import { Router, RouterContext, browserHistory } from 'react-router';
import classnames from 'classnames';
import * as firebase from 'firebase';
import dataJson from '../api/raw_database.json';
import textData from '../api/TextData.json';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
// import Button from '@material-ui/core/Button';
import profile from '../assets/img/user.png';
import axios from 'axios';

export default class ShopCart extends React.Component {
  
    constructor(props) {
        super(props);
        var id = localStorage.getItem('id');
        if (id !== null && id !== 'null') {
          var _province = localStorage.getItem('province')
          var _amphoe = localStorage.getItem('amphoe')
          var _district = localStorage.getItem('district')
        } else {
          var _province = 'กระบี่'
          var _amphoe = 'คลองท่อม'
          var _district = 'คลองท่อมเหนือ'
        }
        var province = []
        dataJson.forEach(function(element) {
          province.push(element.province)
        });

        console.log("test"+_province)
        province = province.filter((v, i, a) => a.indexOf(v) === i);        
        var amphoe = []
        let dataAmphoe = dataJson.filter(a => a.province == _province)
        dataAmphoe.forEach(function(element) {
          amphoe.push(element.amphoe)
        });
        amphoe = amphoe.filter((v, i, a) => a.indexOf(v) === i);
        console.log(amphoe)

        var district = []
        let dataDistrict = dataJson.filter(a => a.province == _province && a.amphoe == _amphoe)
        dataDistrict.forEach(function(element) {
          district.push(element.district)
        });
        district = district.filter((v, i, a) => a.indexOf(v) === i);

        var zipcode = []
        let dataZipcode = dataJson.filter(a => a.province == _province && a.amphoe == _amphoe && a.district == _district)
        dataZipcode.forEach(function(element) {
          zipcode.push(element.zipcode)
        });
        zipcode = zipcode.filter((v, i, a) => a.indexOf(v) === i);

        localStorage.setItem('page', 'cart');
        this.state = {
            isShowError: false,
            textError: "",
            dataCart:[],
            sumPrice: 0,
            firstname:'',
            lastname: '',
            phone: '',
            email: '',
            address: '',
            dataProvince:province,
            province: _province,
            dataAmphoe:amphoe,
            amphoe: _amphoe,
            dataDistrict: district,
            district: _district,
            dataZipcode: zipcode,
            zipcode: zipcode[0],
            price_delivery:"ฟรี",
            id: 'id',
            isEditAddress: true,
            ShopList: [],
            shopIndex: 0,
            dataUserStore: {}
        };
        this.goBack = this.goBack.bind(this);
    }

    componentDidMount(){
        document.title = "duck shop - ร้านค้าออนไลน์"
        let favicon = document.getElementById("favicon");
        favicon.href = img_fab;

        var id = localStorage.getItem('id');
        // if (id === null) {
        //   var id = 'id'
        // }
        var firstname = localStorage.getItem('firstname')
        var lastname = localStorage.getItem('lastname')
        var phone = localStorage.getItem('phone')
        var email = localStorage.getItem('email')
        var address = localStorage.getItem('address')
        var province = localStorage.getItem('province')
        var amphoe = localStorage.getItem('amphoe')
        var district = localStorage.getItem('district')
        var zipcode = localStorage.getItem('zipcode')
        let dataShop = []
        const dataShopList = firebase.database().ref('cartweb/'+id);
        var context = this
        dataShopList.on('value', (snapshot) => {
          snapshot.forEach(shop => {
            dataShop.push({
              keyShop: shop.key
            })
          })
          this.setState({
            ShopList: dataShop
          })
          if (dataShop.length !== 0) {
            const dataCart = firebase.database().ref('cartweb/'+id+"/"+dataShop[this.state.shopIndex].keyShop);
            dataCart.on('value', (snapshotTest) => {
              let freBaseData = snapshotTest.val();
              let dataStorageCart = [];
              let price = 0;   
              snapshotTest.forEach(productSnapshot => {
                let data = productSnapshot.val();
                console.log(data.store_key)
                dataStorageCart.push({
                  store_key: data.store_key,
                  keyid:productSnapshot.key,
                  key_product: data.keyid,
                  name_product:data.name_product,
                  details_product:data.details_product,
                  price_product:data.price_product,
                  amount_product: data.amount_product,
                  picture:data.picture,
                  });
                  price =  price + Number(data.price_product)
            });

            if (dataStorageCart.length !== 0) {
              if (price >= textData.price_delivery_cond) {
                this.setState({
                  price_delivery:"ฟรี"
                }) 
              } else {
                this.setState({
                  price_delivery: " "+textData.price_delivery+" บาท"
                })
                price = price + textData.price_delivery
              }
            }
    
            this.setState({
                dataCart: dataStorageCart,
                sumPrice: price
              });
            });

          }
        })

        console.log(id)
        console.log(province)
        console.log(district)
        if (id !== null && id !== 'null') {
            this.setState({
                id: id,
                firstname: firstname,
                lastname:lastname,
                phone: phone,
                email: email,
                address:address,
                province: province,
                amphoe: amphoe,
                district: district,
                zipcode: zipcode
            })
        } else {
          // this.props.history.push('/shop-login')
        }

        const dataUserStore = firebase.database().ref('userwebstore/');
        dataUserStore.on('value', (user) => {
          let dataUser = {}
          user.forEach(shop => {
            let obj = shop.val()
            console.log(obj.imageProfile)
            if (typeof(obj.imageProfile) !== 'undefined') {
              dataUser[shop.key+'_img'] = obj.imageProfile
            } else {
              dataUser[shop.key+'_img'] = profile
              
            }
            dataUser[shop.key+'_name'] = obj.firstname
          })

          this.setState({
            dataUserStore: dataUser
          })
        })

      }

      handleRemoveCart(keystore,key,index) {
        console.log(key)
        console.log(index)
        var id = localStorage.getItem('id');
        // if (id === null) {
        //   var id = 'id'
        // }
        const dataRef = firebase.database()
        const key_value = key
        var data = this.state.dataCart[index]
        const refProduct = dataRef.ref("productsweb/"+keystore+"/"+data.key_product);
        console.log(data)
        var amount_product = 0
        refProduct.on('value', (product) => {
          var data_product = product.val();
          console.log(data_product)
          amount_product = data_product.amount_product
           
        })
        dataRef.ref("cartweb/"+id+"/"+keystore).child(key_value).remove().then(function() {
          console.log("Remove succeeded.")
          refProduct.update({
            amount_product: amount_product  + 1
          })
        })
        .catch(function(error) {
          console.log("Remove failed: " + error.message)
        });
      }

      clickInvoice() {
        if (this.state.dataCart.length > 0) {
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
              phone: this.state.phone,
              email: this.state.email,
              address: this.state.address,
              province: this.state.province,
              amphoe: this.state.amphoe,
              district: this.state.district,
              zipcode: this.state.zipcode
            },
            img_receipt:'',
            delivery_price: this.state.price_delivery,
            delivery_code:'',
            description_status:'',
            status:0,
            status_receipt: 0,
            date_order:today,
            shopKey: this.state.ShopList[this.state.shopIndex].keyShop
          }
          var newUser = dataRef.ref("orderweb/"+id).push(data).then(function (snapshot) {
              console.log("success")
              console.log(snapshot.key)
              data['key'] = snapshot.key
              data['user_id'] = id
              context.saveReportOrder(data)
              context.props.history.push('/invoice/'+snapshot.key)
              }, function () {
              console.log('rejected promise')
          }).catch((e) => console.log(e))
        } else {
          this.setState({isShowError:true,textError:"ยังไม่มีสินค้าในตะกร้า กรุณากลับไปที่หน้าหลัก"})
        }
      }

      saveReportOrder(data) {
        console.log(data)
        // "https://api-duckfollow.herokuapp.com/members/save"
        // "http://localhost:5000/members/save"
        axios.post("https://api-duckfollow.herokuapp.com/order/save",data,{
        })
        .then(response => {
              console.log("response: ", response)
              // do something about response
        })
        .catch(err => {
              console.error(err)
        })
      }

      goBack(){
        this.props.history.goBack();
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

      onClickEdit () {
        this.setState({
          isEditAddress: false
        })
      }

      onClickOk () {
        this.setState({
          isEditAddress: true
        })
      }

      onHide() {
        this.setState({isShowError:false})
      }

      clickShop(index) {
        this.setState({
          shopIndex: index
        })
        this.SelectCartIndex(index)
      }

      SelectCartIndex(i) {
        var id = localStorage.getItem('id');
        const dataCart = firebase.database().ref('cartweb/'+id+"/"+this.state.ShopList[i].keyShop);
            dataCart.on('value', (snapshotTest) => {
              let freBaseData = snapshotTest.val();
              let dataStorageCart = [];
              let price = 0;   
              snapshotTest.forEach(productSnapshot => {
                let data = productSnapshot.val();
                console.log(data.store_key)
                dataStorageCart.push({
                  store_key: data.store_key,
                  keyid:productSnapshot.key,
                  key_product: data.keyid,
                  name_product:data.name_product,
                  details_product:data.details_product,
                  price_product:data.price_product,
                  amount_product: data.amount_product,
                  picture:data.picture,
                  });
                  price =  price + Number(data.price_product)
            });

            if (dataStorageCart.length !== 0) {
              if (price >= textData.price_delivery_cond) {
                this.setState({
                  price_delivery:"ฟรี"
                }) 
              } else {
                this.setState({
                  price_delivery: " "+textData.price_delivery+" บาท"
                })
                price = price + textData.price_delivery
              }
            }
    
            this.setState({
                dataCart: dataStorageCart,
                sumPrice: price
              });
            });
      }

    render() {
        
        return (
            <div>
                <Container className="fixed-top">
                    <Navbar expand="md" className="nav-bar-border" style={{backgroundColor: '#008577'}}>
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
                <Container className="view-cart" fluid={true}>
                  <Row>
                    <Col md="2">
                      <Row>
                      {this.state.ShopList.map((item,index) => (
                        <Col xs={2} md={12} onClick={this.clickShop.bind(this,index)}>
                          <img id={item.keyShop} className={classnames({"img-shop":true,"img-shop-border":this.state.shopIndex == index})} src={this.state.dataUserStore[item.keyShop+"_img"]} />
                          <UncontrolledPopover trigger="hover" placement="auto" target={item.keyShop}>
                            {/* <PopoverHeader>Legacy Trigger</PopoverHeader> */}
                            <PopoverBody>
                            {this.state.dataUserStore[item.keyShop+"_name"]}</PopoverBody>
                          </UncontrolledPopover>
                        </Col>
                      ))}
                      </Row>
                    </Col>
                    <Col md="5">
                    <h2>ตะกร้าสินค้า</h2>
                      {this.state.dataCart.map((item,index) => (
                          <Card className="card-view-cart" key={item.keyid}>
                              <CardBody>
                                  <img width={40} height={40} src={item.picture} alt="Card image cap" />
                                  {item.keyid}<br/>
                                  {item.name_product}<br/>
                                  ราคา {item.price_product}
                                  <Button id="btn-del-cart" outline color="danger" size="sm" value={item.keyid} onClick={this.handleRemoveCart.bind(this,item.store_key,item.keyid,index)}>ลบ</Button>
                              </CardBody>
                          </Card>
                      ))}
                          
                    </Col>
                    <Col md="5">
                        <h2>ที่อยู่จัดส่ง</h2>
                        <Card>
                            <CardBody>
                                <Form>
                                <Row form>
                                  <Col md={6}>
                                    <FormGroup>
                                      {/* <Label className="txt-head-address">ชื่อ</Label>
                                      <Input className={classnames({'textBox':this.state.isEditAddress})} type="text" id="firstname"  placeholder="" value={this.state.firstname} onChange={this.onChangeFirstName.bind(this)} /> */}
                                      <TextField defaultValue="Small" size="small" disabled={this.state.isEditAddress} fullWidth id="firstname" label="ชื่อ" variant="outlined" value={this.state.firstname} onChange={this.onChangeFirstName.bind(this)} />
                                    </FormGroup>
                                  </Col>
                                  <Col md={6}>
                                    <FormGroup>
                                      {/* <Label className="txt-head-address">นามสกุล</Label>
                                      <Input className={classnames({'textBox':this.state.isEditAddress})} type="text" id="lastname" placeholder="" value={this.state.lastname} onChange={this.onChangeLastName.bind(this)}/> */}
                                      <TextField defaultValue="Small" size="small" disabled={this.state.isEditAddress} fullWidth id="lastname" label="นามสกุล" variant="outlined" value={this.state.lastname} onChange={this.onChangeLastName.bind(this)} />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <FormGroup>
                                  {/* <Label className="txt-head-address">เบอร์โทรศัพท์</Label>
                                  <Input className={classnames({'textBox':this.state.isEditAddress})} type="phone" value={this.state.phone} onChange={this.onChangePhone.bind(this)}/> */}
                                  <TextField defaultValue="Small" size="small" disabled={this.state.isEditAddress} fullWidth id="phone" label="เบอร์โทรศัพท์" variant="outlined" value={this.state.phone} onChange={this.onChangePhone.bind(this)} />
                                </FormGroup>
                                <FormGroup>
                                  {/* <Label className="txt-head-address">อีเมล</Label>
                                  <Input className={classnames({'textBox':this.state.isEditAddress})} type="text" id="exampleAddress" placeholder="1234 Main St" value={this.state.email} onChange={this.onChangeEmail.bind(this)}/> */}
                                  <TextField defaultValue="Small" size="small" disabled={this.state.isEditAddress} fullWidth id="email" label="อีเมล" variant="outlined" value={this.state.email} onChange={this.onChangeEmail.bind(this)} />
                                </FormGroup>
                                <FormGroup>
                                  {/* <Label className="txt-head-address">ที่อยู่</Label>
                                  <Input className={classnames({'textBox':this.state.isEditAddress})} type="text" id="exampleAddress" placeholder="1234 Main St" value={this.state.address} onChange={this.onChangeAddress}/> */}
                                  <TextField defaultValue="Small" size="small" disabled={this.state.isEditAddress} fullWidth multiline id="address" label="ที่อยู่" variant="outlined" value={this.state.address} onChange={this.onChangeAddress}/>
                                </FormGroup>
                                <FormGroup>
                                  {/* <Label className="txt-head-address">จังหวัด</Label>
                                  <Input className={classnames({'textBox':this.state.isEditAddress})} type="select" name="select" id="exampleSelect" onChange={this.onChangeProvince.bind(this)} value={this.state.province}>
                                        {this.state.dataProvince.map((item,index) => (
                                            <option value={this.state.dataProvince[index]}>{this.state.dataProvince[index]}</option>
                                        ))}
                                      </Input> */}
                                  <TextField
                                    id="filled-select-currency"
                                    select
                                    label="จังหวัด"
                                    value={this.state.province}
                                    onChange={this.onChangeProvince.bind(this)}
                                    helperText=""
                                    variant="outlined"
                                    fullWidth
                                    disabled={this.state.isEditAddress}
                                    defaultValue="Small" size="small"
                                  >
                                    {this.state.dataProvince.map((item,index) => (
                                      <MenuItem key={this.state.dataProvince[index]} value={this.state.dataProvince[index]}>
                                        {this.state.dataProvince[index]}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </FormGroup>
                                <FormGroup>
                                      {/* <Label className="txt-head-address">อำเภอ</Label>
                                      <Input className={classnames({'textBox':this.state.isEditAddress})} type="select" name="select" id="exampleSelect" onChange={this.onChangeAmphoe.bind(this)} value={this.state.amphoe}>
                                        {this.state.dataAmphoe.map((item,index) => (
                                            <option value={this.state.dataAmphoe[index]}>{this.state.dataAmphoe[index]}</option>
                                        ))}
                                      </Input> */}
                                  <TextField
                                    id="filled-select-currency"
                                    select
                                    label="อำเภอ"
                                    value={this.state.amphoe}
                                    onChange={this.onChangeAmphoe.bind(this)}
                                    helperText=""
                                    variant="outlined"
                                    fullWidth
                                    disabled={this.state.isEditAddress}
                                    defaultValue="Small" size="small"
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
                                      {/* <Label className="txt-head-address">ตำบล</Label>
                                      <Input className={classnames({'textBox':this.state.isEditAddress})} type="select" name="select" id="exampleSelect" onChange={this.onChangeDistrict.bind(this)} value={this.state.district}>
                                        {this.state.dataDistrict.map((item,index) => (
                                            <option value={this.state.dataDistrict[index]}>{this.state.dataDistrict[index]}</option>
                                        ))}
                                      </Input> */}
                                      <TextField
                                        id="filled-select-currency"
                                        select
                                        label="ตำบล"
                                        value={this.state.district}
                                        onChange={this.onChangeDistrict.bind(this)}
                                        helperText=""
                                        variant="outlined"
                                        fullWidth
                                        disabled={this.state.isEditAddress}
                                        defaultValue="Small" size="small"
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
                                      {/* <Label className="txt-head-address">รหัสไปรษณีย์</Label>
                                      <Input className={classnames({'textBox':this.state.isEditAddress})} type="select" name="select" id="exampleSelect" onChange={this.onChangeZipCode.bind(this)} value={this.state.zipcode}>
                                        {this.state.dataZipcode.map((item,index) => (
                                            <option value={this.state.dataZipcode[index]}>{this.state.dataZipcode[index]}</option>
                                        ))}
                                      </Input> */}
                                      <TextField
                                        id="filled-select-currency"
                                        select
                                        label="รหัสไปรษณีย์"
                                        value={this.state.zipcode}
                                        onChange={this.onChangeZipCode.bind(this)}
                                        helperText=""
                                        variant="outlined"
                                        fullWidth
                                        disabled={this.state.isEditAddress}
                                        defaultValue="Small" size="small"
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
                                  <Button onClick={this.onClickEdit.bind(this)} outline color="warning">แก้ไขข้อมูล</Button> <Button color="info" onClick={this.onClickOk.bind(this)}>ตกลง</Button>
                                </Form>    
                            </CardBody>
                        </Card>
                    </Col>
                  </Row>
                </Container>
            </div>

            <div className={this.state.dataCart.length > 0 ? 'hidden' : 'show'}>
               <center>
                 <h1>ยังไม่มีสินค้าในตะกร้า</h1>
                 <a className="btn-back-cart-home" onClick={this.goBack}>กลับไปที่หน้าหลัก</a>
               </center>
            </div>

            <Container className="fixed-bottom">
                <h4>จำนวนทั้งหมด {this.state.dataCart.length} ชิ้น ราคา {this.state.sumPrice.toLocaleString('th-TH')} บาท</h4>
                      <h6>ค่าจัดส่ง {this.state.price_delivery}</h6>
                  <Row>
                    <Col>
                      <div className="btn-right">
                        <Button outline onClick={this.goBack}>กลับหน้าหลัก</Button>{' '}<Button color="success" onClick={this.clickInvoice.bind(this)}>ชำระเงิน</Button>
                      </div>
                    </Col>
                  </Row>
            </Container>

            <Modal id="login-error" isOpen={this.state.isShowError} toggle={this.onHide.bind(this)} fade={false} centered>
                    <ModalBody>
                      <center>
                        <h3 className="txt-header-sub">ลองใหม่อีกครั้ง</h3>
                        <p>{this.state.textError}</p>
                        <Button outline color="success" onClick={this.onHide.bind(this)}>ปิด</Button>
                      </center>
                    </ModalBody>
            </Modal>
            </div>
        )
    }
}