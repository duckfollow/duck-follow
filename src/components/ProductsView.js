import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import imgp2 from "../assets/img/imgp2.png";
import * as firebase from 'firebase';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import './Dashboard.css';

export default class ProductsView extends React.Component {
    constructor(props) {
      super(props);
      let store_id = localStorage.getItem('store_id');
      this.state = {
          name_product: "",
          price_product: 0,
          amount_product: 0,
          details_product: "",
          details_product2: "",
          link_url: "",
          img_product: imgp2,
          file: [],
          isShow:0,
          images:[],
          store_id:store_id
       };
    }

    componentDidMount(){
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
            
            console.log(img)
            this.setState({
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
        })
    }

    onChangeNameProduct(event) {
        this.setState({name_product: event.target.value});
    }

    onChangePriceProduct(event) {
        this.setState({price_product: event.target.value});
    }

    onChangeAmountProduct(event) {
        this.setState({amount_product: event.target.value});
    }

    onChangeDetailsProduct(event) {
        this.setState({details_product: event.target.value});
    }

    onChangeDetailsProduct2(event) {
        this.setState({details_product2: event.target.value});
    }

    onChangeLinkUrl(event) {
        this.setState({link_url: event.target.value});
    }

    onChangeStatus(event) {
        this.setState({isShow: Number(event.target.value)});
    }

    handleChange(event) {
        let reader = new FileReader();
        const files = event.target.files[0];
        //this.setState({file:files});
        reader.onloadend = () => {
          this.setState({
            file: files,
            img_product: reader.result,
          });
        }
        reader.readAsDataURL(files)
    }
  
    uploadToFirebase(event) {
        const { key } = this.props.match.params
        const dataRef = firebase.database()
        const storageRef = firebase.storage().ref();
        var context = this
        var name_product = this.state.name_product
        var price_product = this.state.price_product
        var amount_product = this.state.amount_product
        var details_product = this.state.details_product
        var details_product2 = this.state.details_product2
        var link_url = this.state.link_url
        var status = this.state.isShow
        console.log(this.state.file.length)
        if (this.state.file.length !== 0 && this.state.name_product !== "" && this.state.price_product !== 0) {
            console.log(this.state.file)
            storageRef.child(`products/${this.state.store_id}/${this.state.file.name}`).put(this.state.file).then((snapshot) => {
                alert('Uploaded a blob or file!');
                var starsRef = storageRef.child(`products/${this.state.store_id}/${this.state.file.name}`);
                starsRef.getDownloadURL().then(function(url) {
                    console.log(url)
                    dataRef.ref("productsweb/"+this.state.store_id+'/'+key).update({
                            name_product: name_product,
                            price_product: Number(price_product),
                            amount_product: Number(amount_product),
                            details_product: details_product,
                            details_product2: details_product2,
                            link_url: link_url,
                            picture : url,
                            status:Number(status)
                        }).then(function () {
                            console.log("success")
                            alert("success")
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
            
        } else if (this.state.name_product !== "" && this.state.price_product !== 0) {
                dataRef.ref("productsweb/"+this.state.store_id+'/'+key).update({
                    name_product: name_product,
                    price_product: Number(price_product),
                    amount_product: Number(amount_product),
                    details_product: details_product,
                    details_product2: details_product2,
                    link_url: link_url,
                    status:Number(status)
                }).then(function () {
                    console.log("success")
                    alert("success")
                }, function () {
                console.log('rejected promise')
            }).catch((e) => console.log(e))
        }
        event.preventDefault();
  }

  uploadImage (event) {
    const { key } = this.props.match.params
    const dataRef = firebase.database()
    const storageRef = firebase.storage().ref();
    const files = event.target.files[0];
    var context = this
    storageRef.child(`products/${this.state.store_id}/${files.name}`).put(files).then((snapshot) => {
        alert('Uploaded a blob or file!');
        var starsRef = storageRef.child(`products/${this.state.store_id}/${files.name}`);
        starsRef.getDownloadURL().then(function(url) {
            console.log(url)
            dataRef.ref("productsweb/"+this.state.store_id+'/'+key+"/images").push({
                    picture : url
                }).then(function () {
                    console.log("success")
                    alert("success")
                    event.target.value = [];
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

  clickCancel() {
    this.props.history.push('/dashboard')
  }

  handleDeleteImage(keyId) {
    console.log(keyId)
    const { key } = this.props.match.params
    const dataRef = firebase.database()
    dataRef.ref("productsweb/"+this.state.store_id+'/'+key+"/images").child(keyId).remove().then(function() {
      console.log("Remove succeeded.")
    })
    .catch(function(error) {
      console.log("Remove failed: " + error.message)
    });
  }

    render() {
      return (
        <div>
            <Container>
                <h1>สินค้าของคุณ</h1>
                <Row>
                    <Col xs={{ size: 12, order: 2}} md={{ size: 8, order: 1}}>
                        <Form>
                            <FormGroup>
                                <Input type="file" name="file" id="exampleFile" accept="image/*" onChange={this.handleChange.bind(this)} required/>
                                <FormText color="muted">
                                This is some placeholder block-level help text for the above input.
                                It's a bit lighter and easily wraps to a new line.
                                </FormText>
                            </FormGroup>
                            <FormGroup>
                                {/* <Label for="name">ชื่อสินค้า</Label>
                                <Input type="text" name="nameproduct" id="nameproduct" value={this.state.name_product} onChange={this.onChangeNameProduct.bind(this)} required/> */}
                                <TextField fullWidth multiline id="nameproduct" label="ชื่อสินค้า" variant="outlined" value={this.state.name_product} onChange={this.onChangeNameProduct.bind(this)}/>
                            </FormGroup>
                            <FormGroup>
                                {/* <Label for="name">ราคาสินค้า</Label>
                                <Input type="number" name="priceproduct" id="priceproduct" value={this.state.price_product} onChange={this.onChangePriceProduct.bind(this)} required/> */}
                                <TextField
                                    id="filled-number"
                                    label="ราคาสินค้า"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                    fullWidth
                                    value={this.state.price_product}
                                    onChange={this.onChangePriceProduct.bind(this)}
                                />
                            </FormGroup>
                            <FormGroup>
                                {/* <Label for="name">จำนวนสินค้า</Label>
                                <Input type="number" value={this.state.amount_product} onChange={this.onChangeAmountProduct.bind(this)} required/> */}
                                <TextField
                                    id="filled-number"
                                    label="จำนวนสินค้า"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                    fullWidth
                                    value={this.state.amount_product}
                                    onChange={this.onChangeAmountProduct.bind(this)}
                                />
                            </FormGroup>
                            <FormGroup>
                                {/* <Label for="exampleText">รายละเอียด</Label>
                                <Input type="textarea" name="text" id="exampleText" value={this.state.details_product} onChange={this.onChangeDetailsProduct.bind(this)}  required/> */}
                                <TextField fullWidth multiline id="nameproduct" label="รายละเอียด" variant="outlined" value={this.state.details_product} onChange={this.onChangeDetailsProduct.bind(this)}/>
                            </FormGroup>
                            <FormGroup>
                                {/* <Label for="exampleText">รายละเอียดยาว</Label>
                                <Input type="textarea" name="text" id="exampleText" value={this.state.details_product2} onChange={this.onChangeDetailsProduct2.bind(this)}  required/> */}
                                <TextField fullWidth multiline id="nameproduct" label="รายละเอียดยาว" variant="outlined" value={this.state.details_product2} onChange={this.onChangeDetailsProduct2.bind(this)}/>
                            </FormGroup>
                            <FormGroup>
                                {/* <Label for="exampleText">ลิงค์</Label>
                                <Input type="text" name="text" id="exampleText" value={this.state.link_url} onChange={this.onChangeLinkUrl.bind(this)}  required/> */}
                                <TextField fullWidth multiline id="nameproduct" label="ลิงค์" variant="outlined" value={this.state.link_url} onChange={this.onChangeLinkUrl.bind(this)}/>
                            </FormGroup>
                            <FormGroup tag="fieldset">
                                {/* <legend>สินค้าแนะนำ</legend>
                                <FormGroup check>
                                <Label check>
                                    <Input type="radio" name="radio1" value="1" onChange={this.onChangeStatus.bind(this)} checked={this.state.isShow == '1'} />{' '}
                                    ใช่
                                </Label>
                                </FormGroup>
                                <FormGroup check>
                                <Label check>
                                    <Input type="radio" name="radio1" value="0" onChange={this.onChangeStatus.bind(this)} checked={this.state.isShow == '0'}/>{' '}
                                    ไม่ใช่
                                </Label>
                                </FormGroup> */}

                                <FormControl component="fieldset">
                                <FormLabel component="legend">สินค้าแนะนำ</FormLabel>
                                <RadioGroup aria-label="gender" name="gender1" value={this.state.isShow} onChange={this.onChangeStatus.bind(this)}>
                                    <FormControlLabel className="label-m0px" value={1} control={<Radio />} label="ใช่"/>
                                    <FormControlLabel className="label-m0px" value={0} control={<Radio />} label="ไม่ใช่" />
                                </RadioGroup>
                                </FormControl>
                            </FormGroup>
                            <FormGroup inline>
                                <Button onClick={this.clickCancel.bind(this)} outline color="danger" size="lg">ยกเลิก</Button>{' '}
                                <Button onClick={this.uploadToFirebase.bind(this)} color="primary" size="lg">อัพเดทข้อมูล</Button>
                            </FormGroup>       
                         </Form>
                    </Col>
                    <Col xs={{ size: 12, order: 1}} md={{ size: 4, order: 2}}>
                        <img src={this.state.img_product} width="100%"/>
                        <p><center>รูปตัวอย่าง</center></p>
                    </Col>
                </Row>

                <hr/>
                <h3>เพิ่มรูป</h3>
                <Row className="card-add-img">
                    {this.state.images.map((item,index) => (
                        <Col xs={2}>
                            <Button outline color="danger" size="sm" onClick={this.handleDeleteImage.bind(this,item.key)}>ลบ</Button>
                            <br/>
                            <img src={item.img} className="img-view-product" />
                        </Col> 
                    ))}
                </Row>
                <Input type="file" name="file" id="exampleFile" accept="image/*" onChange={this.uploadImage.bind(this)} required/>
                
            </Container>
        </div>
      );
    }
  }
  