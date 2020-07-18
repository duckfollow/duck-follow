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
import classnames from 'classnames';
import { Form, FormGroup, Label,Input } from 'reactstrap';
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
            dataShowSlide: [],
            textCaption: '',
            textPrice: '',
            textDetails: '',
            id: 'id',
            clickAddCart: false,
            text: ""
        };

        this.brakePoints = [600, 750, 1024];
        this.images = [];
    }

    componentDidMount(){
        document.title = "duck shop - ร้านค้าออนไลน์"
        let favicon = document.getElementById("favicon");
        favicon.href = img_fab;

        console.log(document.favicon)

        const dataList = firebase.database().ref('productsweb');
        dataList.on('value', (snapshot) => {
          let freBaseData = snapshot.val();
          let dataStorage = [];
          let dataShowBanner = []    
          snapshot.forEach(productSnapshot => {
            let data = productSnapshot.val();
            console.log('data: ', productSnapshot.key);
            console.log(data.name_product, data.name_product);
            dataStorage.push({
              keyid:productSnapshot.key,
              name_product:data.name_product,
              details_product:data.details_product,
              price_product:data.price_product,
              amount_product: data.amount_product,
              picture:data.picture,
            });
            if (data.status === 1) {
                dataShowBanner.push({
                    keyid:productSnapshot.key,
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
        console.log(firstname)
        if (id !== null && id != 'null') {
            this.setState({
                id: id,
                firstname: firstname
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
          this.setState({isShowPromo:dataSetting.isShow,imgPromo:dataSetting.img})
          console.log(dataSetting.isShow)
        });

      }

      handleAddCart(index) {
        // console.log(index)
        // console.log(this.state.dataShow[index])
        this.setState({clickAddCart: true})
        const dataRef = firebase.database()
        const context = this
        var data = this.state.dataShow[index]
        const refProduct = dataRef.ref("productsweb/"+data.keyid);
        var amount_product = 0
        refProduct.on('value', (product) => {
          var data_product = product.val();
          console.log(data_product)
          amount_product = data_product.amount_product
        })
        if (amount_product > 0) {
            dataRef.ref("cartweb/"+this.state.id).push(data).then(function () {
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

        }
      }

      handleAddCart2(index) {
        // console.log(index)
        // console.log(this.state.dataShow[index])
        this.setState({clickAddCart: true})
        const dataRef = firebase.database()
        const context = this
        var data = this.state.dataShow[index]
        const refProduct = dataRef.ref("productsweb/"+data.keyid);
        var amount_product = 0
        refProduct.on('value', (product) => {
          var data_product = product.val();
          console.log(data_product)
          amount_product = data_product.amount_product
        })
        if (amount_product > 0) {
            dataRef.ref("cartweb/"+this.state.id).push(data).then(function () {
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

        }
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

    clickView(key) {
        this.props.history.push('/view/'+key)
    }

    clickHidePromo () {
        this.setState({isShowPromo:false})
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
        <NavbarBrand><Link to={`/shop-login`} className="button-cart"> <img width={25} height={25} src={img_user}/></Link></NavbarBrand>
                            {/* <NavbarToggler onClick="" /> */}
                            {/* <Collapse isOpen="" navbar> */}
                            <Nav id="txt-name" className="mr-auto" navbar>
                                {this.state.firstname}
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
                <Container fluid={true}>
                    {
                        this.state.isShowBanner? 
                        <div className="card-promotion">
                            <marquee>{this.state.text}</marquee>
                        </div>
                        :null
                    }
                    {this.state.dataShowSlide.length > 0?
                        <Jumbotron>
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
                            <p>{this.state.textDetails}</p>
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
                                        <CardImg top width="100%" src={data.picture} alt="Card image cap" onClick={this.clickView.bind(this,data.keyid)}/>
                                        <CardBody>
                                            <CardTitle>{data.name_product}</CardTitle>
                                            มีสินค้าทั้งหมด {data.amount_product} ชิ้น
                                            <CardText>฿{data.price_product} </CardText>
                                            <Row>
                                                <Col className="col-padding"><Button size="sm" className="btn-solid-secondary" disabled={data.amount_product <= 0 || this.state.clickAddCart} onClick={this.handleAddCart.bind(this,id)}>เพิ่มไปยังตะกร้า</Button></Col>
                                                <Col className="col-padding"><Button size="sm" className="btn-solid-primary" disabled={data.amount_product <= 0 || this.state.clickAddCart} onClick={this.handleAddCart2.bind(this,id)}>ซื้อสินค้า</Button></Col>
                                            </Row>  
                                        </CardBody>
                                    </Card>
                                )
                            })}
                        </Masonry>

                    {/* footer */}
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    {/* <Row className="contact">
                        <Col xs={12}>
                        <center><h1>สมัครเป็นกลุ่มเกษตรกรออนไลน์</h1></center>
                        </Col>
                        <Col xs={12} md={6} className="content-contact">
                            ศูนย์รวมสินค้าเกษตรกรออนไลน์
                        </Col>
                        <Col xs={12} md={6}>
                            <Form>
                                <Row form>
                                <Col md={6}>
                                    <FormGroup>
                                    <Label for="exampleEmail">ชื่อ</Label>
                                    <Input type="text" id="firstname"  placeholder=""/>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                    <Label for="examplePassword">นามสกุล</Label>
                                    <Input type="text" id="lastname" placeholder=""/>
                                    </FormGroup>
                                </Col>
                                </Row>
                                <FormGroup>
                                    <Label for="exampleAddress">เบอร์โทรศัพท์</Label>
                                    <Input type="phone"/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="exampleAddress">จังหวัด</Label>
                                    <Input type="text"/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="exampleAddress">ธุรกิจของคุณ</Label>
                                    <Input type="text"/>
                                </FormGroup>
                                <Button outline color="success" size="lg">ลงทะเบียน</Button>
                            </Form>
                        </Col>
                    </Row> */}

                    <hr/>
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

                <Modal id="promo" isOpen={this.state.isShowPromo} toggle={this.clickHidePromo.bind(this)} centered>
                    {/* <ModalHeader toggle={this.clickHidePromo.bind(this)}></ModalHeader> */}
                    <ModalBody>
                        <Button className="btn-close-promo" outline color="success" onClick={this.clickHidePromo.bind(this)}>X</Button>
                        <img width="100%" src={this.state.imgPromo}/>
                    </ModalBody>
                    {/* <ModalFooter>
                    <Button color="primary" onClick={this.clickHidePromo.bind(this)}>Do Something</Button>{' '}
                    <Button color="secondary" onClick={this.clickHidePromo.bind(this)}>Cancel</Button>
                    </ModalFooter> */}
                </Modal>
            </div>
        )
    }
}