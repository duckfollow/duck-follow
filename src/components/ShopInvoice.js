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
import { Form,Badge } from 'reactstrap';
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
            img_receipt: ""
        };
    }

    componentDidMount(){
        var id = localStorage.getItem('id');
        const dataRef = firebase.database()
        dataRef.ref("cartweb").child(id).remove();
        const { orderid } = this.props.match.params
        const dataOrder = firebase.database().ref('orderweb/'+id+'/'+orderid);
        // lrHUnb9xep9Pz88jHl36q7p8i07nsK5qKHDNS1kD729
        dataOrder.on('value', (snapshot) => {
          let freBaseData = snapshot.val();
          console.log(freBaseData)
          try{
            this.setState(
              {
                dataCart: freBaseData.product,
                dataAddress: freBaseData.address,
                date_order: freBaseData.date_order,
                price:freBaseData.price,
                delivery_price: freBaseData.delivery_price,
                img_receipt: freBaseData.img_receipt
              }
            )
          }catch(err) {

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
          alert('Uploaded a blob or file!');
          var starsRef = storageRef.child(`invoices/${this.state.file.name}`);
          var today = (new Date()).toISOString()
          starsRef.getDownloadURL().then(function(url) {
              console.log(url)
              dataRef.ref("orderweb/"+id+"/"+orderid).update({
                  img_receipt : url,
                  status: 1,
                  date_receipt: today
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

      onUpload() {
        console.log('test')
      }

      onBack() {
        this.props.history.push('/shop')
      }
    render() {
        return (
            <Container className="invoice-content">
              <div className="card-invoice">
                <div className="container">
        <p>เลขที่ใบเสร็จ {this.state.orderid} <br/>เวลา: {this.state.date_order}</p>
                  <Row>
                    <Col xs={12} md={8}>
                      <p>สินค้า</p>
                      {this.state.dataCart.map(item => (
                        <div key={item.keyid}>
                          <img width={40} height={40} src={item.picture} alt="Card image cap" />
                          {item.keyid}<br/>
                          {item.name_product}<br/>
                          ราคา {item.price_product}
                        </div>
                      ))}
                      <hr/>
                      <p>ค่าจัดส่ง {this.state.delivery_price}</p>
                      <h5>ทั้งหมด {this.state.dataCart.length} ชิ้น ราคา {this.state.price} บาท</h5>
                    </Col>
                    <Col xs={12} md={4}>
                      <div className="card-address">
                        <p>ที่อยู่จัดส่ง</p>
                        {this.state.dataAddress.firstname}<br/>
                        {this.state.dataAddress.lastname}<br/>
                        {this.state.dataAddress.address}
                      </div>
                      
                    </Col>
                  </Row>
                  <p>สถานะ</p>
                  <div className="timeline-wrap">
                    <div className="timeline"></div>
                    <div className="marker mfirst timeline-icon one">
                    </div>
                    <div className="marker m2 timeline-icon two">
                    </div>
                    <div className="marker m3 timeline-icon three">
                    </div>
                    <div className="marker mlast timeline-icon four">
                    </div>
                  </div>
                  <div>
                    <p>อัพโหลดใบเสร็จ</p>
                    <input type="file" name="file" onChange={this.handleChange.bind(this)} accept="image/*"/>
                    <Container>
                      <Row>
                        <Col md={8}>
                          <img className="img-recript" src={this.state.img_receipt}  alt=""/>
                        </Col>
                        <Col md={4}>
                        {this.state.isUpload?
                          <Form onSubmit={this.uploadToFirebase.bind(this)}>
                            <Button outline color="primary" size="sm">upload</Button>
                          </Form>
                          :null
                        }
                        </Col>
                      </Row>
                    </Container>
                  </div>
                  <h3>ช่องทางการชำระ</h3>
                  <p>*หากไม่มีการชำระภายใน 7 วันระบบจำทำการยกเลิกรายการสั่งซื้อโดยอัตโนมัติ</p>
                  {/* <QRCode logoWidth={40} logoImage={img_qr} value="https://github.com/gcoro/react-qrcode-logo" /> */}
                </div>
              </div>
              <br/>
              <Row>
                <Col xs={12} md={6}>
                  <Button outline color="primary" onClick={this.onBack.bind(this)}>กลับไปที่หน้าหลัก</Button>
                </Col>
                <Col xs={12} md={6}>
                  <Button>พิมพ์ใบเสร็จ</Button>
                </Col>
              </Row> 
            </Container>
        )
    }
}