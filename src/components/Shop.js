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
import ChatBot from 'react-simple-chatbot';
import * as firebase from 'firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption
  } from 'reactstrap';
import imgp from "../assets/img/imgp1.png";
import imgp2 from "../assets/img/imgp2.png";
import imgp3 from "../assets/img/imgp3.png";
export default class Shop extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            dataShow:[],
            dataCart:[],
            firstname: "ลงทะเบียน",
            activeIndex: 0,
            animating: false,
            isChat: false,
            isShowBanner: false,
            dataShowSlide: [],
            textCaption: '',
            id: 'id'
        };

        this.brakePoints = [600, 750, 1024];
        this.images = [];
        this.items = [
            {
              src: imgp,
              altText: 'Slide 1',
              caption: 'Slide 1'
            },
            {
              src: imgp2,
              altText: 'Slide 2',
              caption: 'Slide 2'
            },
            {
              src: imgp3,
              altText: 'Slide 3',
              caption: 'Slide 3'
            }
          ];
    }

    componentDidMount(){
        const dataList = firebase.database().ref('test');
    
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
              profile_picture:data.profile_picture,
            });
            if (data.status === 1) {
                dataShowBanner.push({
                    keyid:productSnapshot.key,
                    name_product:data.name_product,
                    details_product:data.details_product,
                    price_product:data.price_product,
                    profile_picture:data.profile_picture,
                    src: data.profile_picture,
                    altText: data.name_product,
                    caption: data.name_product
                });
            }
        });

          this.setState({
            dataShow: dataStorage,
            dataShowSlide: dataShowBanner,
            textCaption: dataShowBanner[0].caption
          });
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
              profile_picture:data.profile_picture,
              });
        });

          this.setState({
            dataCart: dataStorageCart
          });
        });


        
        var firstname = localStorage.getItem('firstname')
        console.log(firstname)
        if (id !== null) {
            this.setState({
                id: id,
                firstname: firstname
            })
        }

        const dataWeb = firebase.database().ref('web_setting/banner');
        dataWeb.on('value', (snapshot) => {
          let dataSetting = snapshot.val();
          this.setState({isShowBanner:dataSetting.isShow})
          console.log(dataSetting.isShow)
        });

      }

      handleAddCart(index) {
        // console.log(index)
        // console.log(this.state.dataShow[index])
        const dataRef = firebase.database()
        const context = this
        var data = this.state.dataShow[index]
        dataRef.ref("cartweb/"+this.state.id).push(data).then(function () {
            console.log("success")
            toast.success('เพิ่มสินค้าในตะกร้าแล้ว', {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            }, function () {
            console.log('rejected promise')
        }).catch((e) => console.log(e))
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
                    <Navbar color="light" light expand="md" className="nav-bar-border">
        <NavbarBrand><Link to={`/shop-login`} className="button-cart"> <img width={25} height={25} src={img_user}/></Link></NavbarBrand>
                            {/* <NavbarToggler onClick="" /> */}
                            {/* <Collapse isOpen="" navbar> */}
                            <Nav className="mr-auto" navbar>
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
                <Container>
                    {
                        this.state.isShowBanner? 
                        <div className="card-promotion">
                            <h6>ประกาศ</h6>
                        </div>
                        :null
                    }
                    <Jumbotron>
                        <h1 className="display-3">สินค้าแนะนำ</h1>
                        <hr className="my-2" />
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
                                        onExiting={() => this.setState({animating:true,textCaption:this.state.dataShowSlide[this.state.activeIndex].caption})}
                                        onExited={() => this.setState({animating:false,textCaption:this.state.dataShowSlide[this.state.activeIndex].caption})}
                                        key={item.src}
                                        autoPlay={true}
                                    >
                                        <img width="100%" src={item.src} alt={item.altText} />
                                        <CarouselCaption captionText={item.caption} captionHeader={item.caption} />
                                    </CarouselItem>
                                    );
                                })
                            }
                            <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
                            <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
                        </Carousel>
                        </Col>
                        <Col md="6">
                        <h3>{this.state.textCaption}</h3>
                            <Row className="btn-position-bottom">
                                <Col sm="6"><Button width="100%" className="btn-solid-secondary" onClick={this.handleAddCart.bind(this,this.state.activeIndex)}>เพิ่มไปยังตะกร้า</Button></Col>
                                <Col sm="6"><Button width="100%" className="btn-solid-primary">ซื้อสินค้า</Button></Col>
                            </Row>
                        </Col>
                        </Row>
                    </Jumbotron>
                    <h4>ขายดีประจำสัปดาห์</h4>
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
                                        <CardImg top width="100%" src={data.profile_picture} alt="Card image cap" />
                                        <CardBody>
                                            <CardTitle>{data.name_product}</CardTitle>
                                            มีสินค้าทั้งหมด 27715 ชิ้น
                                            <CardText>฿{data.price_product} </CardText>
                                            <Row>
                                                <Col className="col-padding"><Button size="sm" className="btn-solid-secondary" onClick={this.handleAddCart.bind(this,id)}>เพิ่มไปยังตะกร้า</Button></Col>
                                                <Col className="col-padding"><Button size="sm" className="btn-solid-primary">ซื้อสินค้า</Button></Col>
                                            </Row>  
                                        </CardBody>
                                    </Card>
                                )
                            })}
                        </Masonry>

                    {/* footer */}
                    <br/>
                    <hr/>
                    <Jumbotron>
                        <h1 className="display-3">ติดต่อได้ที่</h1>
                        <p className="lead">50 หมุ่ 18 ต.สำราญใต้ อ.สามชัย จ.กาฬสินธุ์ 46180 เบอร์โทรติดต่อ 090 9931 282</p>
                        <hr className="my-2" />
                        <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
                        <p className="lead">
            
                        </p>
                    </Jumbotron>
                    <ToastContainer
                        position="bottom-right"
                        autoClose={5000}
                        hideProgressBar={false}
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
            </div>
        )
    }
}