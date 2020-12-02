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
import img_user from '../assets/img/user.svg'
import img_fab from '../assets/img/fab-shop.svg'
import ChatBot from 'react-simple-chatbot';
import * as firebase from 'firebase';
import { ToastContainer, toast } from 'react-toastify';
import {Toast, ToastBody, ToastHeader } from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption
  } from 'reactstrap';
import {Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import imgp from "../assets/img/imgp1.png";
import imgp2 from "../assets/img/imgp2.png";
import imgp3 from "../assets/img/imgp3.png";
import banner from "../assets/img/banner.png";
import smes from '../assets/img/smes.png'
import classnames from 'classnames';
import { Form, FormGroup, Label,Input } from 'reactstrap';
import ShopFooter from './ShopFooter'
import axios from 'axios';

export default class Shop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            dataShow:[],
            dataCart:[],
            firstname: "เข้าสู่ระบบ | สมัครสมาชิก",
            activeIndex: 0,
            animating: false,
            isChat: false,
            isShowBanner: false,
            isShowPromo:false,
            imgPromo: "",
            urlPromo: "",
            dataShowSlide: [],
            textCaption: '',
            textPrice: '',
            textDetails: '',
            id: 'id',
            clickAddCart: false,
            text: "",
            isShowLogin:false,
            isSoldOut: false,
            indexProduct: 0
        };

        this.brakePoints = [270,600, 750, 1024];
        this.images = [];
    }

    componentDidMount(){
        document.title = "duck shop - ร้านค้าออนไลน์"
        let favicon = document.getElementById("favicon");
        favicon.href = img_fab;

        const dataList = firebase.database().ref('productsweb');
        dataList.on('value', (snapshot) => {
          let freBaseData = snapshot.val();
          let dataStorage = [];
          let dataShowBanner = []    
          snapshot.forEach(StoreProduct => {
            StoreProduct.forEach(dataProduct => {
                let store_key = StoreProduct.key
                console.log(store_key)
                let data = dataProduct.val();
                if (data.status_active === 1) {
                    dataStorage.push({
                        store_key: store_key,
                        keyid:dataProduct.key,
                        name_product:data.name_product,
                        details_product:data.details_product,
                        price_product:data.price_product,
                        amount_product: data.amount_product,
                        picture:data.picture,
                    });
                    if (data.status === 1) {
                        dataShowBanner.push({
                            store_key: store_key,
                            keyid:dataProduct.key,
                            name_product:data.name_product,
                            details_product:data.details_product,
                            price_product:data.price_product,
                            amount_product: data.amount_product,
                            picture:data.picture,
                            src: data.picture,
                            altText: data.name_product,
                            caption: data.name_product
                        });
                    }
                }
            })
            
        });

            try {
                this.setState({
                    textCaption: dataShowBanner[0].caption,
                    textPrice: dataShowBanner[0].price_product,
                    textDetails: dataShowBanner[0].details_product
                  });
            }catch(err) {

            }
            try {
                this.setState({
                    dataShow: dataStorage,
                    dataShowSlide: dataShowBanner
                  });
            }catch (err) {

            }
        }); 

        var id = localStorage.getItem('id');
        if (id === null) {
            var id = 'id'
        }

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

        var firstname = localStorage.getItem('firstname')
        var lastname = localStorage.getItem('lastname')
        console.log(firstname)
        if (id !== null && id != 'null' && firstname !== 'null' && firstname !== null) {
            this.setState({
                id: id,
                firstname: firstname +' '+ lastname
            })
        } else {
            this.setState({
                firstname: "เข้าสู่ระบบ | สมัครสมาชิก"
            })
        }

        const dataWeb = firebase.database().ref('web_setting/banner');
        dataWeb.on('value', (snapshot) => {
          let dataSetting = snapshot.val();
          this.setState({isShowBanner:dataSetting.isShow,text:dataSetting.text})
          console.log(dataSetting.isShow)
        });

        const dataWebPromo = firebase.database().ref('web_setting/promotion');
        dataWebPromo.on('value', (snapshot) => {
          let dataSetting = snapshot.val();
          this.setState({isShowPromo:dataSetting.isShow,imgPromo:dataSetting.img,urlPromo:dataSetting.url})
          console.log(dataSetting.isShow)
        });

        const dataWebError = firebase.database().ref('web_setting/error');
        dataWebError.on('value', (snapshot) => {
            let dataSetting = snapshot.val();
            if (Boolean(dataSetting.page)) {
                this.props.history.push('/shop-error')
            } else {
                this.props.history.push('/shop')
            }
        });
      }

      handleAddCart(index) {
        // console.log(index)
        // console.log(this.state.dataShow[index])
        this.setState({indexProduct:index})
        var id = localStorage.getItem('id');
        if (id === null || id === 'null') {
            this.setState({isShowLogin:true})
        } else {
            this.setState({clickAddCart: true})
            const dataRef = firebase.database()
            const context = this
            var data = this.state.dataShow[index]
            const refProduct = dataRef.ref("productsweb/"+data.store_key+'/'+data.keyid);
            var amount_product = 0
            refProduct.on('value', (product) => {
            var data_product = product.val();
            console.log(data_product)
            amount_product = data_product.amount_product
            })
            if (amount_product > 0) {
                dataRef.ref("cartweb/"+this.state.id+"/"+data.store_key).push(data).then(function () {
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

                let dataLine = {
                    message: data.name_product,
                    imageThumbnail: data.picture,
                    imageFullsize:  data.picture
                }

                this.sendNotification(dataLine)
            } else {
                this.setState({isSoldOut:true,clickAddCart: false})
            }
        }
      }

      handleAddCart2(index) {
        // console.log(index)
        // console.log(this.state.dataShow[index])
        this.setState({indexProduct:index})
        var id = localStorage.getItem('id');
        if (id === null || id === 'null') { 
            this.setState({isShowLogin:true})
        } else {
            this.setState({clickAddCart: true})
            const dataRef = firebase.database()
            const context = this
            var data = this.state.dataShow[index]
            const refProduct = dataRef.ref("productsweb/"+data.store_key+'/'+data.keyid);
            var amount_product = 0
            refProduct.on('value', (product) => {
            var data_product = product.val();
            console.log(data_product)
            amount_product = data_product.amount_product
            })
            if (amount_product > 0) {
                dataRef.ref("cartweb/"+this.state.id+"/"+data.store_key).push(data).then(function () {
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

                let dataLine = {
                    message: data.name_product,
                    imageThumbnail: data.picture,
                    imageFullsize:  data.picture
                }

                this.sendNotification(dataLine)
            } else {
                this.setState({isSoldOut:true,clickAddCart: false})
            }
        }
    }

    onHide() {
        this.setState({isShowLogin:false,isSoldOut:false})
    }

    onLogin() {
        this.props.history.push('/shop-login')
    }

    next = () => {
        if (this.state.animating) return;
        const nextIndex = this.state.activeIndex === this.state.dataShowSlide.length - 1 ? 0 : this.state.activeIndex + 1;
        this.setState({
            activeIndex: nextIndex
        })
    }
    
    previous = () => {
        if (this.state.animating) return;
        const nextIndex = this.state.activeIndex === 0 ? this.state.dataShowSlide.length - 1 : this.state.activeIndex - 1;
        this.setState({
            activeIndex: nextIndex
        })
    }
    
    goToIndex = (newIndex) => {
        if (this.state.animating) return;
        this.setState({
            activeIndex: newIndex
        })
    }

    setIndex(i) {
        this.setState({
            activeIndex: i
        })
    }

    openForm() {
        if (!this.state.isChat) {
            this.setState({isChat:true})
        } else {
            this.setState({isChat:false})
        }
    }
      
    closeForm() {
        this.setState({isChat:false})
    }

    clickView(store_key,key) {
        localStorage.setItem('key_store_view', store_key);
        this.props.history.push('/view/'+key)
    }

    clickViewLgin() {
        this.props.history.push('/shop-login')
    }

    clickHidePromo () {
        this.setState({isShowPromo:false})
    }

    haveProduct() {
        const dataRef = firebase.database()
        const context = this
        var dataProduct = this.state.dataShow[this.state.indexProduct]
        var today = (new Date()).toISOString()
        var id = localStorage.getItem('id');
        var NameUser = localStorage.getItem('firstname') +" "+ localStorage.getItem('lastname')
        var data = {
            productId: dataProduct.keyid,
            name: dataProduct.name_product,
            username: NameUser,
            iduser: id,
            date: today
        }
        dataRef.ref("haveProducts/").push(data)
        this.setState({isSoldOut:false})
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
        let chat_class = this.state.isChat ? "chat-popup-show" : "chat-popup-close";
        const steps = [
            {
              id: '0',
              message: 'Welcome to react chatbot!',
              trigger: '1',
            },
            {
              id: '1',
              message: 'Bye!',
              end: false,
            },
          ];
        return (
            <div>
                <Container className="fixed-top">
                    <Navbar expand="md" className="nav-bar-border">
        <NavbarBrand onClick={this.clickViewLgin.bind(this)}><img width={25} height={25} src={img_user}/></NavbarBrand>
                            {/* <NavbarToggler onClick="" /> */}
                            {/* <Collapse isOpen="" navbar> */}
                            <Nav className="mr-auto" navbar>
                            <Link id="txt-name" to="/shop-login">{this.state.firstname}</Link>
                            </Nav>
                            <NavbarText> 
                            <Link to="/shop-cart" className="button-cart"> <img width={25} height={25} src={img_cart}/> <Badge color="danger">{this.state.dataCart.length}</Badge></Link>
                            </NavbarText>
                            {/* </Collapse> */}
                    </Navbar>               
                </Container>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                <Container fluid={true}>
                    {
                        this.state.isShowBanner? 
                        <div className="card-promotion">
                            <marquee>{this.state.text}</marquee>
                        </div>
                        :null
                    }
                    {this.state.dataShowSlide.length > 0?
                        <Jumbotron className="banner-show">
                            <Row>
                            <Col md="6">
                            <Carousel
                                activeIndex={this.state.activeIndex}
                                next={this.next}
                                previous={this.previous}
                                >
                                <CarouselIndicators items={this.state.dataShowSlide} activeIndex={this.state.activeIndex} onClickHandler={this.goToIndex} />
                                {this.state.dataShowSlide.map((item) => {
                                        return (
                                        <CarouselItem
                                            onExiting={() => this.setState({animating:true,textCaption:this.state.dataShowSlide[this.state.activeIndex].caption,textPrice:this.state.dataShowSlide[this.state.activeIndex].price_product,textDetails:this.state.dataShowSlide[this.state.activeIndex].details_product})}
                                            onExited={() => this.setState({animating:false,textCaption:this.state.dataShowSlide[this.state.activeIndex].caption,textPrice:this.state.dataShowSlide[this.state.activeIndex].price_product,textDetails:this.state.dataShowSlide[this.state.activeIndex].details_product})}
                                            key={item.src}
                                            autoPlay={true}
                                        >
                                            <img className="img-slide" src={item.src} alt={item.altText} />
                                            {/* <Image className="img-slide" src={item.src} fallback={<Shimmer className="img-slide" />}/> */}
                                            <CarouselCaption captionText={item.caption} captionHeader={item.caption} />
                                        </CarouselItem>
                                        );
                                    })
                                }
                                <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
                                <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
                            </Carousel>
                            </Col>
                            <Col md="6" className="details-slide">
                            <p className="textNameProduct">{this.state.textCaption}</p>
                            <p className="textPrice">{this.state.textPrice}.-</p>
                            <p className="text-limit-word">{this.state.textDetails}</p>
                                <Row className="btn-position-bottom">
                                    <Col sm="6"><Button width="100%" className="btn-solid-secondary" disabled={this.state.clickAddCart} onClick={this.handleAddCart.bind(this,this.state.activeIndex)}>เพิ่มไปยังตะกร้า</Button></Col>
                                    <Col sm="6"><Button width="100%" className="btn-solid-primary" disabled={this.state.clickAddCart} onClick={this.handleAddCart2.bind(this,this.state.activeIndex)}>ซื้อสินค้า</Button></Col>
                                </Row>
                            </Col>
                            </Row>
                    </Jumbotron>
                    :null}
                    <h4 className="txt-header-sub">สินค้าแนะนำ</h4>
                    <Masonry 
                        brakePoints={this.brakePoints} 
                        loadingComponent = {()=>{return ''}}
                        loadNext={({columns,totalItems}) => {
                            // {columns,totalItems} use this to construct url 
                            // for (let i = 0; i < 5; i++) {
                            //     const ih = 200 + Math.floor(Math.random() * 10) * 15;
                            //     this.images.push("https://unsplash.it/250/" + ih + "?image=" + (totalItems+i));
                            // }
                            // let self = this
                            /**loading kind of effect */
                            // setTimeout(()=>{
                            //     self.setState({
                            //         images: self.images
                            //     })
                            // },1000)
                            
                        }} ref={this.Masonry}>
                            {this.state.dataShow.map((data, id) => {
                                return (
                                    <Card className="card-view" key={id}>
                                        <div>
                                            <CardImg top className="zoom" src={data.picture} alt="Card image cap" onClick={this.clickView.bind(this,data.store_key,data.keyid)}/>
                                            {data.amount_product === 0?
                                                <div className="txt-sold-out">
                                                    <p className="txt-head-sold-out"><center>SOLD OUT</center></p>
                                                    <p><center>สินค้าหมดแล้ว!!</center></p>
                                                </div>
                                                :null
                                            } 
                                        </div>
                                        <div className="card-padding">
                                            <Row>
                                                <Col xs={12} className="col-padding-r col-padding-l">{data.name_product}</Col>
                                                <Col xs={4} className="col-padding-r col-padding-l center-text">฿{data.price_product}</Col>
                                                <Col xs={8} className="col-padding-r col-padding-l center-text"><label className="text-amount">มีสินค้าทั้งหมด {data.amount_product} ชิ้น</label></Col>
                                            </Row>
                                            <Row className="view-btn-card">
                                                <Col xs={12} md={6} className="col-padding-r col-padding-l"><Button size="sm" className="btn-solid-secondary" disabled={/*data.amount_product <= 0 ||*/ this.state.clickAddCart} onClick={this.handleAddCart.bind(this,id)}>หยิบใส่ตะกร้า</Button></Col>
                                                <Col xs={12} md={6} className="col-padding-r col-padding-l"><Button size="sm" className="btn-solid-primary" disabled={/*data.amount_product <= 0 ||*/ this.state.clickAddCart} onClick={this.handleAddCart2.bind(this,id)}>ซื้อสินค้า</Button></Col>
                                            </Row>  
                                        </div>
                                    </Card>
                                )
                            })}
                        </Masonry>

                    {/* footer */}
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <hr className="hr-dashed"/>

                    <Container>
                        <Row>
                            <Col xs={12} md={6} className="sme-content">
                                <h1 className="txt-header-sub">SMEs ไทย</h1>
                                <p>"เว็บไซต์สนับสนุนธุรกิจออนไลน์"</p>
                                <p>ติดต่อร่วมเป็นเครื่อข่ายธุรกิจออนไลน์ เพื่อพัฒนาระบบธุรกิจให้ยั่งยืน</p>
                            </Col>
                            <Col xs={12} md={6}>
                                <img width="100%" className="sme-content" src={smes}/>
                            </Col>
                        </Row>
                    </Container>
                    <br/>
                    <br/>
                    <hr/>
                    <ShopFooter/>

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
                </Container>
                {/* <div className={chat_class}>
                    <Button className="close-button" onClick={this.closeForm.bind(this)}>Close</Button>
                    <ChatBot steps={steps} />  
                </div>
                <Button className="open-button" onClick={this.openForm.bind(this)}>Chat</Button> */}

                <Modal id="promo" isOpen={this.state.isShowPromo} toggle={this.clickHidePromo.bind(this)} fade={false} centered>
                    <ModalBody>
                        <Button className="btn-close-promo" outline color="success" onClick={this.clickHidePromo.bind(this)}>X</Button>
                        <a target="_blank" href={this.state.urlPromo}>
                            <img width="100%" height="100%" src={this.state.imgPromo}/>
                        </a>
                    </ModalBody>
                </Modal>


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
                        <Button outline color="success" onClick={this.haveProduct.bind(this)}>
                        <svg width="20px" aria-hidden="true" focusable="false" data-prefix="far" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z"></path></svg> สนใจสินค้ารายการนี้</Button>
                        {' '}<Button outline color="danger" onClick={this.onHide.bind(this)}>
                        <svg width="16px" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="svg-inline--fa fa-times fa-w-11" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg> ปิด</Button>
                      </center>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}