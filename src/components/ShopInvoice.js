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
import { Modal, ModalBody,Form,Badge } from 'reactstrap';
import { Jumbotron, Button } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import {UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
import {
    Card, CardImg, CardText, CardBody, CardLink,
    CardTitle, CardSubtitle
  } from 'reactstrap';
import { Masonry } from './Masonry';
import { Link } from "react-router-dom";
import './ShopInvoice.css';
import img_qr from '../assets/img/log_fab.png'
import img_arrow from '../assets/img/arrow.svg'
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import { QRCode } from 'react-qrcode-logo';

import * as firebase from 'firebase';
import img_fab from '../assets/img/fab-shop.svg'
import qr_code_pay from '../assets/img/qr_code_pay.png'
import scb_logo from '../assets/img/scb-logo.jpg'
import kbank_logo from '../assets/img/kbank.png'
import axios from 'axios';
import textData from '../api/TextData.json';


var dataBank = {
  img_kbank: kbank_logo,
  name_kbank: 'ธนาคารกสิกรไทย',
  img_scb: scb_logo,
  name_scb: 'ธนาคารไทยพาณิชย์'
}


export default class ShopInvoice extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataCart:[],
            orderid: '',
            dataAddress:{},
            date_order:'',
            price:0,
            delivery_price:"",
            isUpload: false,
            img_receipt: "",
            qr_code_payment: "",
            isUploadSuccess: false,
            textSubUpload: "",
            statusDetails: [],
            bank_name: '',
            bank_type: '',
            bank_number: ''
        };
    }

    componentDidMount(){
      document.title = "duck shop - ร้านค้าออนไลน์"
      let favicon = document.getElementById("favicon");
      favicon.href = img_fab;
      var context = this

        var id = localStorage.getItem('id');
        if (id === null || id === 'null') {
          this.props.history.push('/shop-login')
        }
        var page = localStorage.getItem('page');
        const dataRef = firebase.database()
       
        const { orderid } = this.props.match.params
        const dataOrder = firebase.database().ref('orderweb/'+id+'/'+orderid);
        // lrHUnb9xep9Pz88jHl36q7p8i07nsK5qKHDNS1kD729
        dataOrder.on('value', (snapshot) => {
          let OrderData = snapshot.val();
          console.log(OrderData)
          try{
            let date_order = new Date(OrderData.date_order)
            this.setState(
              {
                dataCart: OrderData.product,
                dataAddress: OrderData.address,
                date_order: date_order.toLocaleString('th-TH') + " น.",
                price:OrderData.price.toLocaleString('th-TH'),
                delivery_price: OrderData.delivery_price,
                img_receipt: OrderData.img_receipt,
                qr_code_payment:OrderData.qr_code_payment
              }
            )

            const dataShop = firebase.database().ref('userwebstore/'+OrderData.shopKey);
            dataShop.on('value', (snapshot) => {
              let ShopData = snapshot.val();
              console.log(ShopData)
              context.setState({
                bank_name: ShopData.bank_name,
                bank_type: ShopData.bank_type,
                bank_number: ShopData.bank_number
              })
            })

            if (page === 'cart') {
              dataRef.ref("cartweb").child(id+"/"+OrderData.shopKey).remove();
            }

            try {
              if (typeof(OrderData.statusDetails) !== "undefined") {
                let statusDetails = []
                console.log("statusDetails")
                console.log(statusDetails)
                for (var key in OrderData.statusDetails) {
                  let date_details = new Date(OrderData.statusDetails[key].date)
                  statusDetails.push({
                    date:date_details.toLocaleString('th-TH') + " น.",
                    text: OrderData.statusDetails[key].text,
                    detail: OrderData.statusDetails[key].detail
                  })
                }

                this.setState({
                  statusDetails: statusDetails
                })
              }
            }catch (err) {
              console.log(err)
            }
          }catch(err) {
            this.props.history.push('/shop')
          }
        });

        this.setState({
          orderid:orderid
        })
      }

      handleChange(event) {
        let reader = new FileReader();
        const files = event.target.files[0];
        //this.setState({file:files});
        reader.onloadend = () => {
          this.setState({
            file: files,
            img_receipt: reader.result,
            isUpload:true
          });
        }
    
        reader.readAsDataURL(files)
    }
  
    uploadToFirebase(event) {
      const dataRef = firebase.database()
      const storageRef = firebase.storage().ref();
      var id = localStorage.getItem('id');
      const { orderid } = this.props.match.params
      var context = this
      storageRef.child(`invoices/${this.state.file.name}`).put(this.state.file).then((snapshot) => {
          // alert('Uploaded a blob or file!');
          var starsRef = storageRef.child(`invoices/${this.state.file.name}`);
          var today = (new Date()).toISOString()
          starsRef.getDownloadURL().then(function(url) {
              
              dataRef.ref("orderweb/"+id+"/"+orderid).update({
                  img_receipt : url,
                  status: 1,
                  date_receipt: today
                }).then(function () {
                  console.log("success")
                  var data = {
                    date: today,
                    text: textData.upload_receipt_success,
                    detail: textData.upload_receipt_success_detail
                  }
                  dataRef.ref("orderweb/"+id+"/"+orderid+"/statusDetails").push(data)
                  context.setState({isUpload:false})
                  context.setState({isUploadSuccess:true,textSubUpload:"อัพโหลดใบเสร็จสำเร็จแล้ว"})
                  console.log(url)
                  let dataLine = {
                    message: today+'\nรหัสออเดอร์:'+orderid+'\n'+'ราคา:'+context.state.price,
                    imageThumbnail: url,
                    imageFullsize: url
                  }
                  context.sendNotification(dataLine)
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

      onUpload() {
        console.log('test')
      }

      onBack() {
        this.props.history.push('/shop')
      }

      onHide() {
        this.setState({isUploadSuccess:false})
      }

      cancelReceipt () {
        this.setState({img_receipt:""})
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
        return (
            <Container className="invoice-content">
              <div className="card-invoice">
                <div className="container">
        <p>เลขที่ใบเสร็จ {this.state.orderid} <br/>เวลา: {this.state.date_order}</p>
                  <Row>
                    <Col xs={12} md={6}>
                      <p className="text-head-invoice">สินค้า</p>
                      {this.state.dataCart.map(item => (
                        <div key={item.keyid}>
                          <Row>
                            <Col xs={8}>
                              <Row>
                                <Col xs={2} className="img-cart"><img width={40} height={40} src={item.picture} alt="Card image cap" /></Col>
                                <Col xs={10}>
                                <label className="text-cart-id">{item.keyid}</label><br/>
                                <label className="text-name-product">{item.name_product}</label><br/>
                                </Col>
                              </Row>
                            </Col>
                            <Col xs={4}><p className="text-price">{item.price_product} .-</p></Col>
                          </Row>
                        </div>
                      ))}
                      <hr/>
                      <p>ค่าจัดส่ง {this.state.delivery_price}</p>
                      <h5>ทั้งหมด {this.state.dataCart.length} ชิ้น ราคา {this.state.price} บาท</h5>
                    </Col>
                    <Col xs={12} md={6}>
                      <div className="card-address">
                        <p><b>ที่อยู่จัดส่ง</b></p>
                        {this.state.dataAddress.firstname} {this.state.dataAddress.lastname}<br/>
                        {this.state.dataAddress.email} {this.state.dataAddress.phone} <br/>
                        {this.state.dataAddress.address} {this.state.dataAddress.province} {this.state.dataAddress.ampphoe} {this.state.dataAddress.district} {this.state.dataAddress.zipcode}
                      </div>
                      
                    </Col>
                  </Row>
                  <br/>
                  <hr/>
                  <p><b>สถานะ</b></p>                   
                      {this.state.statusDetails.map(item => (                      
                              <Row>
                                <Col xs={12}>
                                  <div className="item-detail">{item.date}</div>
                                  <div className="item-title">{item.text}</div>
                                  <div className="item-detail">{item.detail}</div>
                                  <br/>
                                </Col>
                              </Row>

                      ))}
                  <hr/>
                  <div>
                      <Row>
                        <Col xs={12} md={6}>
                        <p><b>อัพโหลดใบเสร็จ</b></p>
                        <input type="file" name="file" onChange={this.handleChange.bind(this)} accept="image/*" disabled={this.state.img_receipt !== ""}/>
                        {this.state.isUpload?
                              <Form>
                                <Button outline color="primary" size="sm" onClick={this.uploadToFirebase.bind(this)}>อัพโหลดใบเสร็จ</Button>{' '}
                                <Button outline color="danger" size="sm" onClick={this.cancelReceipt.bind(this)}>ยกเลิก</Button>
                              </Form>
                              :null
                        } 
                        </Col>
                        <Col xs={12} md={6} className="img-recript-content">
                          <img className="img-recript" src={this.state.img_receipt}  alt=""/>
                        </Col>
                      </Row>
                  </div>
                  <br/>
                  <hr/>
                  <Row>
                    <Col xs={12} md={6}>
                      <h3>ช่องทางการชำระสินค้า</h3>
                      <p>*หากไม่มีการชำระภายใน 7 วันระบบจะทำการยกเลิกรายการสั่งซื้อโดยอัตโนมัติ</p>

                      <br/>
                      <p><b>ขั้นตอนการชำระเงิน</b></p>
                      <ul>
                        <li>เลือกวิธีการชำระผ่านพร้อมเพย์หรือทางบัญชีธนาคาร</li>
                        <li>อัพโหลดใบเสร็จหรือหลักฐานการชำระเงิน</li>
                      </ul>
                      <p className="text-red">*โปรดตรวจสอบข้อมูลให้ถูกต้องก่อนการชำระเงินทุกครั้ง</p>
                    </Col>
                    <Col xs={12} md={6} className="view-content-qr">
                        <Row>
                          {/* <Col xs={12} md={4}><img width="100%" src={qr_code_pay}/></Col> */}
                          <Col xs={12} md={12}>
                            <Row>
                              <Col xs={3}><img width="100%" src={dataBank['img_'+this.state.bank_type]}/></Col>
                              <Col xs={9}>
                                <b>{dataBank['name_'+this.state.bank_type]}</b><br/>
                                <b>ชื่อบัญชี: </b>
                                {this.state.bank_name}<br/>
                                <b>เลขบัญชี: </b>
                                {this.state.bank_number}<br/>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <br/>
                        {/* <Row>
                          <Col xs={7}><b>จ่ายมาพร้อมเพย์หมายเลข</b></Col>
                          <Col xs={5}>xxx-xxx-1282</Col>
                        </Row> */}
                        <hr/>
                        <Row>
                          <Col xs={7}><b>จำนวนเงินที่ต้องชำระ</b></Col>
                          <Col xs={5}>{this.state.price} บาท</Col>
                        </Row>
                    </Col>
                  </Row>
                </div>
              </div>
              <br/>
                <center>
                  <Button outline color="primary" className="btn-text-inline" onClick={this.onBack.bind(this)}>กลับไปที่หน้าหลัก</Button>{" "}
                  <Button>พิมพ์ใบเสร็จ</Button>
                </center>
              <br/>
                <Modal id="upload-receipt" isOpen={this.state.isUploadSuccess} toggle={this.onHide.bind(this)} fade={false} centered>
                    <ModalBody>
                      <center>
                        <h3 className="txt-header-sub">อัพโหลดใบเสร็จ</h3>
                        <p>{this.state.textSubUpload}</p>
                        <Button outline color="success" onClick={this.onHide.bind(this)}>ปิด</Button>
                      </center>
                    </ModalBody>
                </Modal> 
            </Container>
        )
    }
}