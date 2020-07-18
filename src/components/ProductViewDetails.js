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
import { Badge } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';

export default class ProductViewDetails extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          id: "",
          name_product: "",
          price_product: 0,
          amount_product: 0,
          details_product: "",
          img_product: "",
          file: [],
          isShow:0,
          images:[],
          img_index:0,
          dataCart: [],
          clickAddCart: false,
          keyProduct: ""
       };
       this.goBack = this.goBack.bind(this);
    }

    goBack(){
      this.props.history.goBack();
    }

    componentDidMount() {
        const { key } = this.props.match.params
        console.log(key)
        const Products = firebase.database().ref('productsweb/'+key);
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
            this.setState({
                keyProduct: snapshot.key,
                name_product: data.name_product,
                price_product: data.price_product,
                amount_product: data.amount_product,
                details_product: data.details_product,
                img_product: data.picture,
                isShow: data.status,
                images: img
            })
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
    this.setState({clickAddCart: true})
    const dataRef = firebase.database()
    const context = this
    var data = {
      amount_product: this.state.amount_product,
      details_product: this.state.details_product,
      keyid: this.state.keyProduct,
      name_product: this.state.name_product,
      picture: this.state.img_product,
      price_product: this.state.price_product
    }
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
                          <Col sm="6"><Button width="100%" className="btn-solid-secondary" disabled={this.state.amount_product <= 0 || this.state.clickAddCart} onClick={this.handleAddCart.bind(this)}>เพิ่มไปยังตะกร้า</Button></Col>
                           <Col sm="6"><Button width="100%" className="btn-solid-primary">ซื้อสินค้า</Button></Col>
                        </Row>
                    </Col>
                </Row>
                
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
  