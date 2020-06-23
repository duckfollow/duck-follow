import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import imgp2 from "../assets/img/imgp2.png";
import * as firebase from 'firebase';

export default class ProductViewDetails extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          name_product: "",
          price_product: 0,
          amount_product: 0,
          details_product: "",
          img_product: "",
          file: [],
          isShow:0,
          images:[]
       };
    }

    componentDidMount(){
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
                name_product: data.name_product,
                price_product: data.price_product,
                amount_product: data.amount_product,
                details_product: data.details_product,
                img_product: data.picture,
                isShow: data.status,
                images: img
            })
        })
    }

  clickCancel() {
    this.props.history.push('/shop')
  }

  clickImage(index) {
    this.setState({
      img_product: this.state.images[index].img
    })
  }

    render() {
      return (
        <div>
            <Container>
                <Row>
                    <Col xs={{ size: 12}} md={{ size: 5}}>
                        <img src={this.state.img_product} width="100%"/>
                        <div>
                          {this.state.images.map((item,index) => (
                              <img src={item.img} className="img-view-product" onClick={this.clickImage.bind(this,index)} />
                          ))}
                        </div>
                    </Col>
                    <Col xs={{ size: 12}} md={{ size: 7}}>
                        <h1>{this.state.name_product}</h1>
                        <p>ราคา {this.state.price_product}</p>
                        <p>{this.state.details_product}</p>
                        <Row className="btn-position-bottom">
                          <Col sm="6"><Button width="100%" className="btn-solid-secondary">เพิ่มไปยังตะกร้า</Button></Col>
                           <Col sm="6"><Button width="100%" className="btn-solid-primary">ซื้อสินค้า</Button></Col>
                        </Row>
                    </Col>
                </Row>
                
            </Container>
        </div>
      );
    }
  }
  