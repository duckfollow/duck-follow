import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import imgp2 from "../assets/img/imgp2.png";
import classnames from 'classnames';
import * as firebase from 'firebase';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavbarText
} from 'reactstrap';
import img_cart from '../assets/img/basket.svg'
import img_arrow from '../assets/img/arrow.svg'
import { Link } from "react-router-dom";
import { Badge,Modal,ModalBody } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import img_fab from '../assets/img/fab-shop.svg'

export default class ProductViewDetails extends React.Component {
    constructor(props) {
      super(props);
      let store_id = localStorage.getItem('key_store_view');
      this.state = {
          id: "",
          name_product: "",
          price_product: 0,
          amount_product: 0,
          details_product: "",
          details_product2: "",
          link_url: "",
          img_product: "",
          file: [],
          isShow:0,
          images:[],
          img_index:0,
          dataCart: [],
          clickAddCart: false,
          keyProduct: "",
          isShowLogin: false,
          isSoldOut: false,
          store_id: store_id
       };
       this.goBack = this.goBack.bind(this);
    }

    goBack(){
      this.props.history.goBack();
    }

    componentDidMount() {
     
        const { key } = this.props.match.params
        console.log(key)
        const Products = firebase.database().ref('productsweb/'+this.state.store_id+'/'+key);
        Products.on('value', (snapshot) => {
          let data = snapshot.val();
            console.log(data)
            var img = []

            try {
                Object.keys(data.images).forEach(function(key) {
                    console.log(key)
                    img.push({
                        key: key,
                        img: data.images[key].picture
                    })
                })
            }catch(err) {

            }
            console.log(data.link_url)
            this.setState({
                keyProduct: snapshot.key,
                name_product: data.name_product,
                price_product: data.price_product,
                amount_product: data.amount_product,
                details_product: data.details_product,
                details_product2: data.details_product2,
                link_url: data.link_url,
                img_product: data.picture,
                isShow: data.status,
                images: img
            })

            document.title = "duck shop - ร้านค้าออนไลน์ | "+data.name_product
            let favicon = document.getElementById("favicon");
            favicon.href = img_fab;
        })

        var id = localStorage.getItem('id');
        if (id === null) {
            var id = 'id'
        }
        this.setState({id:id})
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
              picture:data.picture,
              });
        });

          this.setState({
            dataCart: dataStorageCart
          });
        });

       
    }

  clickCancel() {
    this.props.history.push('/shop')
  }

  clickImage(index) {
    this.setState({
      img_product: this.state.images[index].img,
      img_index: index
    })
  }

  handleAddCart() {
    // console.log(index)
    // console.log(this.state.dataShow[index])
    var id = localStorage.getItem('id');
    if (id === null || id === 'null') { 
      this.setState({isShowLogin:true})
    } else {
      this.setState({clickAddCart: true})
      const dataRef = firebase.database()
      const context = this
      var data = {
        store_key: this.state.store_id,
        amount_product: this.state.amount_product,
        details_product: this.state.details_product,
        keyid: this.state.keyProduct,
        name_product: this.state.name_product,
        picture: this.state.img_product,
        price_product: this.state.price_product,
        store_key: this.state.store_id
      }
      const refProduct = dataRef.ref("productsweb/"+this.state.store_id+"/"+data.keyid);
      var amount_product = 0
      refProduct.on('value', (product) => {
        var data_product = product.val();
        console.log(data_product)
        amount_product = data_product.amount_product
      })
      if (amount_product > 0) {
          dataRef.ref("cartweb/"+this.state.id+"/"+this.state.store_id).push(data).then(function () {
              console.log("success")
              toast.dark('🛒 เพิ่มสินค้าในตะกร้าแล้ว', {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: 0,
              });
              refProduct.update({
                  amount_product: amount_product - 1
              }).then(function() {
                  context.setState({clickAddCart: false})
              })
              }, function () {
              console.log('rejected promise')
          }).catch((e) => console.log(e))
      } else {
        this.setState({isSoldOut:true,clickAddCart:false})
      }
    }
  }

  handleAddCart2() {
    // console.log(index)
    // console.log(this.state.dataShow[index])
    var id = localStorage.getItem('id');
    if (id === null || id === 'null') { 
      this.setState({isShowLogin:true})
    } else {
      this.setState({clickAddCart: true})
      const dataRef = firebase.database()
      const context = this
      var data = {
        amount_product: this.state.amount_product,
        details_product: this.state.details_product,
        keyid: this.state.keyProduct,
        name_product: this.state.name_product,
        picture: this.state.img_product,
        price_product: this.state.price_product,
        store_key: this.state.store_id
      }
      const refProduct = dataRef.ref("productsweb/"+this.state.store_id+"/"+data.keyid);
      var amount_product = 0
      refProduct.on('value', (product) => {
        var data_product = product.val();
        console.log(data_product)
        amount_product = data_product.amount_product
      })
      if (amount_product > 0) {
          dataRef.ref("cartweb/"+this.state.id+"/"+this.state.store_id).push(data).then(function () {
              console.log("success")
              // toast.dark('🛒 เพิ่มสินค้าในตะกร้าแล้ว', {
              //     position: "top-right",
              //     autoClose: 2000,
              //     hideProgressBar: true,
              //     closeOnClick: true,
              //     pauseOnHover: true,
              //     draggable: true,
              //     progress: 0,
              // });
              refProduct.update({
                  amount_product: amount_product - 1
              }).then(function() {
                  context.setState({clickAddCart: false})
                  context.props.history.push('/shop-cart')
              })
              }, function () {
              console.log('rejected promise')
          }).catch((e) => console.log(e))
      } else {
        this.setState({isSoldOut:true,clickAddCart:false})
      }
    }
  }

  onHide() {
    this.setState({isShowLogin:false,isSoldOut:false})
}

onLogin() {
    this.props.history.push('/shop-login')
}

haveProduct() {
  const dataRef = firebase.database()
  const context = this
  var today = (new Date()).toISOString()
  var id = localStorage.getItem('id');
  var NameUser = localStorage.getItem('firstname') +" "+ localStorage.getItem('lastname')
  var data = {
      productId: this.state.keyProduct,
      name: this.state.name_product,
      username: NameUser,
      iduser: id,
      date: today
  }
  dataRef.ref("haveProducts/").push(data)
  this.setState({isSoldOut:false})
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
            <Container>
                <Row>
                    <Col xs={{ size: 12}} md={{ size: 5}}>
                        <img src={this.state.img_product} width="100%"/>
                        <div>
                          {this.state.images.map((item,index) => (
                              <img src={item.img} className={classnames({"img-view-product":true,"img-view-border":this.state.img_index == index})} onClick={this.clickImage.bind(this,index)} onMouseOver={this.clickImage.bind(this,index)} />
                          ))}
                        </div>
                    </Col>
                    <Col xs={{ size: 12}} md={{ size: 7}}>
                        <h1>{this.state.name_product}</h1>
                        <p>ราคา {this.state.price_product}</p>
                        <p>สินค้าเหลือ {this.state.amount_product}</p>
                        <p>{this.state.details_product}</p>
                        <Row className="btn-position-bottom">
                          <Col sm="6"><Button width="100%" className="btn-solid-secondary" disabled={/*this.state.amount_product <= 0 || */this.state.clickAddCart} onClick={this.handleAddCart.bind(this)}>หยิบใส่ตะกร้า</Button></Col>
                           <Col sm="6"><Button width="100%" className="btn-solid-primary" disabled={/*this.state.amount_product <= 0 ||*/ this.state.clickAddCart} onClick={this.handleAddCart2.bind(this)}>ซื้อสินค้า</Button></Col>
                        </Row>
                    </Col>
                </Row>
                <br/>
                <br/>

                <Row>
                    <Col xs={{ size: 12, order: 2}} md={{ size: 6, order: 1}}>
                      {this.state.details_product2 !== ""?
                        <div>
                          <p>รายละเอียด</p>
                          {this.state.details_product2}
                        </div>
                        :null
                    }
                      
                    </Col>
                    <Col xs={{ size: 12, order: 1}} md={{ size: 6, order: 2}}>
                      {this.state.link_url !== ""?
                        <div>
                          <iframe width="100%" height="360px" src={this.state.link_url} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                          ขออนุญาตใช้วิดีโอ Mockup
                        </div>
                        :null
                      }
                    </Col>
                </Row>

                <Modal id="login-error" isOpen={this.state.isShowLogin} toggle={this.onHide.bind(this)} fade={false} centered>
                    <ModalBody>
                      <center>
                        <h3 className="txt-header-sub">ขออภัยในความไม่สะดวก</h3>
                        <p>กรุณาลงทะเบียนหรือเข้าสู่ระบบก่อนทำการสั่งสินค้า</p>
                        <Button outline color="success" onClick={this.onLogin.bind(this)}>ตกลง</Button>
                      </center>
                    </ModalBody>
                </Modal>
                <Modal id="sold-out-error" isOpen={this.state.isSoldOut} toggle={this.onHide.bind(this)} fade={false} centered>
                    <ModalBody>
                      <center>
                        <h3 className="txt-header-sub">สิ้นค้าหมดแล้ว</h3>
                        <p>ขออภัยในความไม่สะดวก!</p>
                        <Button outline color="success" onClick={this.haveProduct.bind(this)}><svg width="20px" aria-hidden="true" focusable="false" data-prefix="far" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z"></path></svg> สนใจสินค้ารายการนี้</Button>
                        {' '}<Button outline color="danger" onClick={this.onHide.bind(this)}>
                        <svg width="16px" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="svg-inline--fa fa-times fa-w-11" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg> ปิด</Button>
                      </center>
                    </ModalBody>
                </Modal>
            </Container>
            <ToastContainer
                        position="bottom-right"
                        autoClose={5000}
                        hideProgressBar
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover />
        </div>
      );
    }
  }
  