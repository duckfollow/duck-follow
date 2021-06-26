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
import { Container, Row, Col } from 'reactstrap';
import {Modal, ModalBody, PopoverBody } from 'reactstrap';
import {
    Card, CardImg, CardText, CardBody, CardLink,
    CardTitle, CardSubtitle
  } from 'reactstrap';
import { Masonry } from './Masonry';
import { Link } from "react-router-dom";
import './Shop.css';
import './ShopUser.css';
import './ShopStoreDashboard.css';
import logo from '../assets/img/theboxapp.png'
import img_arrow from '../assets/img/arrow.svg'
import img_err from '../assets/img/error.svg'
import img_login from '../assets/img/web-login.png'
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import Lottie from 'react-lottie';
import animationData from '../assets/img/freelancers-life.json'
import animationError from '../assets/img/connection-error.json'
import { Form, FormGroup, Label } from 'reactstrap';

import * as firebase from 'firebase';
import img_fab from '../assets/img/fab-shop.svg'

import dataJson from '../api/raw_database.json'
import ShopFooter from './ShopFooter'
import duck_logo from '../assets/img/duck-blue-style.json';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
// import Button from '@material-ui/core/Button';
import {Button} from 'reactstrap';
import img_user from '../assets/img/user.svg'
import {TabContent, TabPane} from 'reactstrap';
import classnames from 'classnames';
import textData from '../api/TextData.json';
import img_camera from '../assets/img/ar-camera.svg';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import profile from '../assets/img/user.png';
import idcarddesign from '../assets/img/idcarddesign.png';
import idcarddesignback from '../assets/img/idcarddesignback.png';
import idcarddesignuser from '../assets/img/idcarddesignuser.png';
import bookbank from '../assets/img/bookbank.png';



export default class ShopStoreDashboard extends React.Component {

    constructor(props) {
        super(props);
        let store_id = localStorage.getItem('store_id');
        var pageactive = localStorage.getItem('pageactive');
        if (pageactive !== 'null' && pageactive !== null) {
          console.log(pageactive)
        } else {
          var pageactive = "1"
        }

        console.log(pageactive)

        var province = []
        dataJson.forEach(function(element) {
          province.push(element.province)
        });

        var _province = localStorage.getItem('store_province')
        var _amphoe = localStorage.getItem('store_amphoe')
        var _district = localStorage.getItem('store_district')

        province = province.filter((v, i, a) => a.indexOf(v) === i);        
        var amphoe = []
        let dataAmphoe = dataJson.filter(a => a.province === _province)
        dataAmphoe.forEach(function(element) {
          amphoe.push(element.amphoe)
        });
        amphoe = amphoe.filter((v, i, a) => a.indexOf(v) === i);
        console.log(amphoe)

        var district = []
        let dataDistrict = dataJson.filter(a => a.province === _province && a.amphoe === _amphoe)
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

        this.state = {
           store_id: store_id,
           activeTab: pageactive,
            dataOrder: [],
            dataProducts: [],
            dataUser: [],
            isShowPromotion: false,
            isPage:false,
            imgPromotion: '',
            isShowReceipt: false,
            urlImgReceipt: '',
            orderId: '',
            userId: '',
            delivery_code: '',
            textlogin: '',
            imageProfile: profile,
            isUpload:false,
            image_idcardfront: idcarddesign,
            isUpload_idcardfront:false,
            image_idcardback: idcarddesignback,
            isUpload_idcardback:false,
            image_idcard: idcarddesignuser,
            isUpload_idcard:false,
            image_idcard_bank: bookbank,
            isUpload_idcard_bank:false,
            firstname:'',
            lastname: '',
            phone: '',
            email: '',
            address: '',
            dataProvince:province,
            province: '',
            dataAmphoe:amphoe,
            amphoe: '',
            dataDistrict: district,
            district: '',
            dataZipcode: zipcode,
            zipcode: '',
            message: '',
            rule: 'store',
            status_register: 0,
            isShowUpdateSuccess: false,
            citizen_firstname: '',
            citizen_lastname: '',
            citizen_id: '',
            citizen_address: '',
            citizen_exp: '',
            bank_name: '',
            bank_type: '',
            bank_number: '',
            shop_details: '',
            status_add_product: 0,
            isShowNotAdd: false
        };
        
        this.goBack = this.goBack.bind(this)
    }

    goBack(){
      this.props.history.goBack();
    }

    componentDidMount(){
      document.title = "duck shop - ร้านค้าออนไลน์"
      let favicon = document.getElementById("favicon");
      favicon.href = img_fab;

      const dataUserStore = firebase.database().ref('userwebstore/'+this.state.store_id);
    
      dataUserStore.on('value', (snapshot) => {
        let data = snapshot.val();
        console.log(data)
        if (data !== null) {
          this.setState({
            firstname: data.firstname,
            lastname: data.lastname,
            phone: data.phone,
            email: data.email,
            address: data.address,
            province: data.province,
            amphoe: data.amphoe,
            district: data.district,
            zipcode: data.zipcode,
            message: data.message,
            rule: data.rule,
            status_register: data.status_register,
            status_add_product: data.status_add_product
          })

          localStorage.setItem('store_province', data.province);
          localStorage.setItem('store_amphoe', data.amphoe);
          localStorage.setItem('store_district', data.district);

          try {
            if (typeof(data.citizen_firstname) !== 'undefined') { 
              this.setState({
                citizen_firstname: data.citizen_firstname,
                citizen_lastname: data.citizen_lastname,
                citizen_id: data.citizen_id,
                citizen_address: data.citizen_address,
                citizen_exp: data.citizen_exp,
                bank_name: data.bank_name,
                bank_type: data.bank_type,
                bank_number: data.bank_number,
                shop_details: data.shop_details
              })
            }
          }catch(e) {

          }

          try {
            console.log(data.imageProfile)
            if (typeof(data.imageProfile) !== 'undefined') {
              this.setState({
                imageProfile: data.imageProfile
              })
            } else {
              this.setState({
                imageProfile: profile
              }) 
            }

            if (typeof(data.idcardfront) !== 'undefined') {
              this.setState({
                image_idcardfront: data.idcardfront
              })
            } else {
              this.setState({
                image_idcardfront: idcarddesign
              }) 
            }

            if (typeof(data.idcardback) !== 'undefined') {
              this.setState({
                image_idcardback: data.idcardback
              })
            } else {
              this.setState({
                image_idcardback: idcarddesignback
              }) 
            }

            if (typeof(data.idcard) !== 'undefined') {
              this.setState({
                image_idcard: data.idcard
              })
            } else {
              this.setState({
                image_idcard: idcarddesignuser
              }) 
            }

            if (typeof(data.idcardbank) !== 'undefined') {
              this.setState({
                image_idcard_bank: data.idcardbank
              })
            } else {
              this.setState({
                image_idcard_bank: bookbank
              }) 
            }
          }catch(e) {
           
          }
        } else {
          this.props.history.push('/shop-store-register')
        }
      });

      const dataOrder = firebase.database().ref('orderweb/');
      dataOrder.on('value', (snapshot) => {
        let freBaseData = snapshot.val();
        let dataListOrder = [];    
        snapshot.forEach(dataOrder => {
          let data = dataOrder.val();
          dataOrder.forEach(s => {
            let order = s.val()
            console.log(s.val())
              // status 0=> create order 1=> upload receipt // 2 => success 3=> cancle
              let date_data = new Date(order.date_order)
              let date_order = date_data.toLocaleString('th-TH') +" น."
              if (order.status !== 2 /*&& order.status !== 3*/) {
                dataListOrder.push({
                  key:dataOrder.key,
                  keyorder:s.key,
                  img: order.product[0].picture,
                  product: order.product,
                  date_order: date_order,
                  price:order.price,
                  img_receipt: order.img_receipt,
                  status:order.status,
                  status_receipt: order.status_receipt,
                  shopKey: order.shopKey
                });
              }
            })
      });

        this.setState({
          dataOrder: dataListOrder.filter(o => o.shopKey === this.state.store_id)
        });
      });

      const Products = firebase.database().ref('productsweb/'+this.state.store_id);
      Products.on('value', (snapshot) => {
        let freBaseData = snapshot.val();
        let dataListProduct = [];
        
        snapshot.forEach(dataProduct => {
          let data = dataProduct.val();
          console.log('data: ', dataProduct.key);
          console.log(data);
          dataListProduct.push({
            keyid:dataProduct.key,
            name_product:data.name_product,
            details_product:data.details_product,
            price_product:data.price_product,
            picture:data.picture,
            amount_product: data.amount_product,
            status_active: data.status_active
          });
        })

        this.setState({
          dataProducts: dataListProduct
        });
      });

      const dataUser = firebase.database().ref('userweb');
      dataUser.on('value', (snapshot) => {
        let freBaseData = snapshot.val();
        let dataListUser = [];
        snapshot.forEach(user => {
          let data = user.val()
          try {
            var img = data.profile_picture
          }catch(err) {
            var img = ''
          }
          dataListUser.push({
            key: user.key,
            firstname: data.firstname,
            lastname: data.lastname,
            picture: img,
            phone: data.phone,
            email: data.email,
            address: data.address,
            province: data.province,
            amphoe: data.amphoe,
            district: data.district,
            zipcode: data.zipcode
          })
        })

        this.setState({
          dataUser: dataListUser
        });
      });

      const dataSetting = firebase.database().ref('web_setting/promotion/');
      dataSetting.on('value', (snapshot) => {
          var dataSetting = snapshot.val()
          this.setState({
            imgPromotion: dataSetting.img,
            isShowPromotion : dataSetting.isShow
          })
          console.log(dataSetting)
      });

      const dataSettingError = firebase.database().ref('web_setting/error/');
      dataSettingError.on('value', (snapshot) => {
          var dataSetting = snapshot.val()
          this.setState({
            isPage: dataSetting.page
          })
          console.log(dataSetting)
      });
    }

    toggle(i) {
      localStorage.setItem('pageactive', i);
      this.setState({activeTab:i})
    }

    addPeroduct() {
      if (this.state.status_add_product === 1) {
        this.props.history.push('/product-add')
      } else {
        this.setState({
          isShowNotAdd: true
        })
      }
    }

    handleViewProduct(key) {
      this.props.history.push('/product-view/'+key)
    }

    onChangePromotion (event) {
      const dataRef = firebase.database()
      dataRef.ref("web_setting/promotion/").update({
        isShow: event.target.value
          }).then(function () {
              console.log("success")
              alert("success")
          }, function () {
          console.log('rejected promise')
      }).catch((e) => console.log(e))
    }

    onChangePage (event) {
      const dataRef = firebase.database()
      dataRef.ref("web_setting/error/").update({
        page: event.target.value
          }).then(function () {
              console.log("success")
              alert("success")
          }, function () {
          console.log('rejected promise')
      }).catch((e) => console.log(e))
    }

    viewDetailsOrder(id,key) {
      localStorage.setItem('id', id);
      localStorage.setItem('page', 'shop');
      this.props.history.push('/invoice/'+key)
    }

    onHide() {
      this.setState({isShowReceipt: false})
    }

    onClickReceipt(url,userId,orderId) {
      this.setState({
        isShowReceipt:true,
        urlImgReceipt:url,
        userId: userId,
        orderId:orderId
      })
    }

    confirmReceipt() {
      const dataRef = firebase.database()
      var today = (new Date()).toISOString()
      var context = this
      var data = {
        date: today,
        text: textData.confirm_receipt_success,
        detail: textData.confirm_receipt_success_detail
      }
      let id = this.state.userId
      let orderid = this.state.orderId
      dataRef.ref("orderweb/"+id+"/"+orderid+"/statusDetails").push(data).then(function () {
        context.setState({
            isShowReceipt: false
        })
        var data_sub_status = {
          status_receipt: 1
        }
        dataRef.ref("orderweb/"+id+"/"+orderid).update(data_sub_status)
    }, function () {
      console.log('rejected promise')
    }).catch((e) => console.log(e))
  }

  onSetDeliveryCode(event) {
    this.setState({
      delivery_code: event.target.value
    })
  }

  onSenderID(userId,orderId) {
    const dataRef = firebase.database()
    var data = {
      delivery_code: this.state.delivery_code
    }
    let id = userId
    let orderid = orderId
    dataRef.ref("orderweb/"+id+"/"+orderid).update(data).then(function () {
      
  }, function () {
    console.log('rejected promise')
  }).catch((e) => console.log(e))
  }

  onChangeLogin(event) {
    this.setState({textlogin:event.target.value})
  }

  onClickLogin () {
    if(this.state.textlogin === 'admin') {
      localStorage.setItem('admin', this.state.textlogin);
      this.setState({isShowLogin: false})
    } else {
      localStorage.setItem('admin', this.state.textlogin);
    }
  }

  clickLogOut() {
    localStorage.setItem('store_id', null);
    this.props.history.push('/shop-store-register')
  }

  handleChange(event) {
    try {
      let reader = new FileReader();
      const files = event.target.files[0];
      console.log(files)
      console.log(Date.now())
      //this.setState({file:files});
      reader.onloadend = () => {
        this.setState({
          file: files,
          imageProfile: reader.result,
          isUpload:true
        });
      }
      reader.readAsDataURL(files)
    }catch(e) {
      
    }
}

uploadToFirebase(event) {
  const dataRef = firebase.database()
  const storageRef = firebase.storage().ref();
  var context = this
  console.log(this.state.file.name)
  var filename = 'Store_'+this.state.store_id+'_'+Date.now()+'_profile'
  storageRef.child(`usersstore/${filename}`).put(this.state.file).then((snapshot) => {
      alert('Uploaded a blob or file!');
      var starsRef = storageRef.child(`usersstore/${filename}`);
      
      starsRef.getDownloadURL().then(function(url) {
          console.log(url)
          dataRef.ref("userwebstore/"+context.state.store_id).update({
            imageProfile : url
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

handleChangeIdCardFront(event) {
  try {
    let reader = new FileReader();
    const files = event.target.files[0];
    //this.setState({file:files});
    reader.onloadend = () => {
      this.setState({
        file_idcardfront: files,
        image_idcardfront: reader.result,
        isUpload_idcardfront:true
      });
    }
    reader.readAsDataURL(files)
  }catch(e) {
    
  }
}

uploadToFirebaseIdCardFront(event) {
const dataRef = firebase.database()
const storageRef = firebase.storage().ref();
var context = this
var filename = 'Store_'+this.state.store_id+'_'+Date.now()+'_idcardfront'
storageRef.child(`usersstore/${filename}`).put(this.state.file_idcardfront).then((snapshot) => {
    alert('Uploaded a blob or file!');
    var starsRef = storageRef.child(`usersstore/${filename}`);
    
    starsRef.getDownloadURL().then(function(url) {
        console.log(url)
        dataRef.ref("userwebstore/"+context.state.store_id).update({
          idcardfront : url
          }).then(function () {
            console.log("success")
            context.setState({isUpload_idcardfront:false})
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

handleChangeIdCardBack(event) {
  try {
    let reader = new FileReader();
    const files = event.target.files[0];
    //this.setState({file:files});
    reader.onloadend = () => {
      this.setState({
        file_idcardback: files,
        image_idcardback: reader.result,
        isUpload_idcardback:true
      });
    }
    reader.readAsDataURL(files)
  }catch(e) {
    
  }
}

uploadToFirebaseIdCardBack(event) {
const dataRef = firebase.database()
const storageRef = firebase.storage().ref();
var context = this
var filename = 'Store_'+this.state.store_id+'_'+Date.now()+'_idcardback'
storageRef.child(`usersstore/${filename}`).put(this.state.file_idcardback).then((snapshot) => {
    alert('Uploaded a blob or file!');
    var starsRef = storageRef.child(`usersstore/${filename}`);
    
    starsRef.getDownloadURL().then(function(url) {
        console.log(url)
        dataRef.ref("userwebstore/"+context.state.store_id).update({
          idcardback : url
          }).then(function () {
            console.log("success")
            context.setState({isUpload_idcardback:false})
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

handleChangeIdCard(event) {
  try {
    let reader = new FileReader();
    const files = event.target.files[0];
    //this.setState({file:files});
    reader.onloadend = () => {
      this.setState({
        file_idcard: files,
        image_idcard: reader.result,
        isUpload_idcard:true
      });
    }
    reader.readAsDataURL(files)
  }catch(e) {
    
  }
}

uploadToFirebaseIdCard(event) {
const dataRef = firebase.database()
const storageRef = firebase.storage().ref();
var context = this
var filename = 'Store_'+this.state.store_id+'_'+Date.now()+'_idcard'
storageRef.child(`usersstore/${filename}`).put(this.state.file_idcard).then((snapshot) => {
    alert('Uploaded a blob or file!');
    var starsRef = storageRef.child(`usersstore/${filename}`);
    
    starsRef.getDownloadURL().then(function(url) {
        console.log(url)
        dataRef.ref("userwebstore/"+context.state.store_id).update({
          idcard : url
          }).then(function () {
            console.log("success")
            context.setState({isUpload_idcard:false})
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

handleChangeIdCardBank(event) {
  try {
    let reader = new FileReader();
    const files = event.target.files[0];
    //this.setState({file:files});
    reader.onloadend = () => {
      this.setState({
        file_idcard_bank: files,
        image_idcard_bank: reader.result,
        isUpload_idcard_bank:true
      });
    }
    reader.readAsDataURL(files)
  }catch(e) {
    
  }
}

uploadToFirebaseIdCardBank(event) {
const dataRef = firebase.database()
const storageRef = firebase.storage().ref();
var context = this
var filename = 'Store_'+this.state.store_id+'_'+Date.now()+'_idcardbank'
storageRef.child(`usersstore/${filename}`).put(this.state.file_idcard_bank).then((snapshot) => {
    alert('Uploaded a blob or file!');
    var starsRef = storageRef.child(`usersstore/${filename}`);
    
    starsRef.getDownloadURL().then(function(url) {
        console.log(url)
        dataRef.ref("userwebstore/"+context.state.store_id).update({
          idcardbank : url
          }).then(function () {
            console.log("success")
            context.setState({isUpload_idcard_bank:false})
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

    onFirstName(event) {
      this.setState({
        citizen_firstname:event.target.value
      })
    }

    onLastName(event) {
      this.setState({
        citizen_lastname:event.target.value
      })
    }

    onID(event) {
      this.setState({
        citizen_id:event.target.value
      })
    }

    onAddress(event) {
      this.setState({
        citizen_address:event.target.value
      })
    }

    onExpire(event) {
      this.setState({
        citizen_exp:event.target.value
      })
    }

    onBankName(event) {
      this.setState({
        bank_name:event.target.value
      })
    }

    onBankType(event) {
      this.setState({
        bank_type:event.target.value
      })
    }

    onBankNumber(event) {
      this.setState({
        bank_number:event.target.value
      })
    }

    onShopDetails(event) {
      this.setState({
        shop_details:event.target.value
      })
    }

    updateShop() {
      const dataRef = firebase.database()
      var context = this
      let data = {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        phone: this.state.phone,
        email: this.state.email,
        address: this.state.address,
        district: this.state.district,
        amphoe: this.state.amphoe,
        province: this.state.province,
        zipcode: this.state.zipcode
      }

      localStorage.setItem('store_province', data.province);
      localStorage.setItem('store_amphoe', data.amphoe);
      localStorage.setItem('store_district', data.district);
      
      dataRef.ref("userwebstore/"+this.state.store_id).update(data).then(function () {
          console.log("success")
          context.setState({
            isShowUpdateSuccess: true
          })
          }, function () {
          console.log('rejected promise')
      }).catch((e) => console.log(e))
    }

    updateShopData() {
      const dataRef = firebase.database()
      var context = this
      let data = {
        citizen_firstname: this.state.citizen_firstname,
        citizen_lastname: this.state.citizen_lastname,
        citizen_id: this.state.citizen_id,
        citizen_address: this.state.citizen_address,
        citizen_exp: this.state.citizen_exp,
        bank_name: this.state.bank_name,
        bank_type: this.state.bank_type,
        bank_number: this.state.bank_number,
        shop_details: this.state.shop_details
      }

      dataRef.ref("userwebstore/"+this.state.store_id).update(data).then(function () {
        console.log("success")
        context.setState({
          isShowUpdateSuccess: true
        })
        }, function () {
        console.log('rejected promise')
    }).catch((e) => console.log(e))
    }

    onHideUpdateSuccess() {
      this.setState({
        isShowUpdateSuccess: false
      })
    }

    onHideNotAdd() {
      this.setState({
        isShowNotAdd: false,
        activeTab: "4"
      })
    }

    render() {
        
        return (
            <div>
                <Container className="fixed-top">
                    <Navbar style={{backgroundColor: '#008577'}} expand="md" className="nav-bar-border">
                    <NavbarBrand><img src={logo} width={30} height={30} /> Box Shop</NavbarBrand>
                            {/* <NavbarToggler onClick="" /> */}
                            {/* <Collapse isOpen="" navbar> */}
                            <Nav className="mr-auto" navbar>
                            
                            </Nav>
                            <NavbarText> 
                                <img width={25} height={25} src={img_user}/> 
                                <label className="label-line">{this.state.store_id} <br/>
                                <Button outline size="sm" onClick={this.clickLogOut.bind(this)}>
                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-lock-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M2.5 9a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2V9z"/>
                                  <path fill-rule="evenodd" d="M4.5 4a3.5 3.5 0 1 1 7 0v3h-1V4a2.5 2.5 0 0 0-5 0v3h-1V4z"/>
                                </svg> ออกจากระบบ</Button>
                                </label>
                            </NavbarText>
                            {/* </Collapse> */}
                    </Navbar>               
                </Container>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                <Container fluid={true}>
                  {this.state.message !== ''?
                    <marquee>{this.state.message}</marquee>:null
                  }
                {/* <h1>Dashboard</h1> */}
                <Row>
                  <Col xs={12} md={2}>
                    <Row>
                      <Col xs={6} md={12} onClick={this.toggle.bind(this,"1")}>
                        <Card className={classnames({"card-btn-menu":true,"card-btn-menu-border":this.state.activeTab === "1"})}>
                          <CardBody>
                            Order {this.state.dataOrder.length >0? <Badge color="danger">{this.state.dataOrder.length}</Badge> :null}
                          </CardBody>
                        </Card>
                      </Col>
                      <Col xs={6} md={12} onClick={this.toggle.bind(this,"2")}>
                        <Card className={classnames({"card-btn-menu":true,"card-btn-menu-border":this.state.activeTab === "2"})}>
                          <CardBody>
                            {this.state.dataProducts.length} สินค้า
                          </CardBody>
                        </Card>
                      </Col>
                      {this.state.rule === 'admin'?
                        <Col xs={6} md={12} onClick={this.toggle.bind(this,"3")}>
                          <Card className={classnames({"card-btn-menu":true,"card-btn-menu-border":this.state.activeTab === "3"})}>
                            <CardBody>
                              <svg width="25px" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="users" class="svg-inline--fa fa-users fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path></svg> {this.state.dataUser.length} User
                            </CardBody>
                          </Card>
                        </Col>
                      :null
                      }
                      
                      <Col xs={6} md={12} onClick={this.toggle.bind(this,"4")}>
                        <Card className={classnames({"card-btn-menu":true,"card-btn-menu-border":this.state.activeTab === "4"})}>
                          <CardBody>
                            <svg  width="25px" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="cog" class="svg-inline--fa fa-cog fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"></path></svg> ตั้งค่า
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12} md={10}>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                          <h2>Order</h2>
                          {this.state.dataOrder.map(item => (
                              <Card className="card-view-cart" key={item.keyorder}>
                                  <CardBody>
                                    <Row>
                                      <Col xs={2}><img src={item.img} className="img-order"/></Col>
                                      <Col xs={8}>
                                      {item.key} <b>status: {item.status}</b><br/>
                                      {item.keyorder}<br/>
                                      วันที่สั่งสินค้า {item.date_order}<br/>
                                      <Row>
                                        {
                                          item.product.map((p,i) =>(
                                          <Col xs={12} className="item-product">{(i+1)}. {p.name_product}</Col>
                                          ))
                                        }
                                      </Row>
                                      จำนวน {item.product.length} ชิ้น <br/>
                                      {/* <Input type="text" value={this.state.delivery_code} onChange={this.onSetDeliveryCode.bind(this)}/>  */}
                                      <TextField fullWidth multiline id="delivery_code" label="หมายเลขส่งสินค้า" variant="outlined" value={this.state.delivery_code} onChange={this.onSetDeliveryCode.bind(this)}/>
                                      <Button onClick={this.onSenderID.bind(this,item.key,item.keyorder)}>บันทึก</Button>
                                      </Col>
                                      <Col xs={2}>
                                        <img onClick={this.onClickReceipt.bind(this,item.img_receipt,item.key,item.keyorder)} width="100%" src={item.img_receipt} />
                                      </Col>
                                    </Row>
                                    <hr/>
                                    <p className="text-order-price">ราคา ฿{item.price}</p>
                                    <Button outline color="info" size="sm" value={item.key} onClick={this.viewDetailsOrder.bind(this,item.key,item.keyorder)}>รายละเอียด</Button> {' '}
                                    {/* <Button outline color="danger" size="sm" value={item.key} onClick="">cancel</Button> */}
                                  </CardBody>
                              </Card>
                            ))}
                        </TabPane>
                        <TabPane tabId="2">
                          <h2>Products <Button outline onClick={this.addPeroduct.bind(this)}>เพิ่ม</Button></h2>
                          {this.state.dataProducts.map(item => (
                              <Card className="card-view-cart" key={item.keyid}>
                                  <CardBody>
                                    <Row>
                                      <Col xs={12} md={4}>
                                        <img src={item.picture} width="100%"/>
                                      </Col>
                                      <Col xs={12} md={8}>
                                        {item.keyid}<br/>
                                        status: {item.status_active} <br/>
                                        {item.name_product}<br/>
                                        ราคา {item.price_product} .-<br/>
                                        จำนวน {item.amount_product} ชิ้น
                                        <Button outline color="info" size="sm" value={item.keyid} onClick={this.handleViewProduct.bind(this,item.keyid)}>view</Button>
                                        {/* <Button outline color="danger" size="sm" value={item.key} onClick={this.handleCancelOrder.bind(this,item.key)}>cancel</Button> */}
                                      </Col>
                                    </Row>
                                  </CardBody>
                              </Card>
                            ))}
                        </TabPane>
                        <TabPane tabId="3">
                          <h2>User</h2>
                          {this.state.dataUser.map(item => (
                              <Card className="card-view-cart" key={item.key}>
                                  <CardBody>
                                    <Row>
                                      <Col xs={3}>
                                        <img src={item.picture} width="100%"/>
                                      </Col>
                                      <Col>
                                      {item.key}<br/>
                                      {item.firstname} {item.lastname} <br/>
                                      {item.phone} {item.email} <br/>
                                      ที่อยู่ <br/>
                                      {item.address} {item.province} {item.amphoe} {item.district} {item.zipcode}
                                      </Col>
                                    </Row>
                                  </CardBody>
                              </Card>
                            ))}
                        </TabPane>
                        <TabPane tabId="4">
                          <h2>แก้ไขโปรไฟล์</h2>
                          <div>
                            <center>
                              <div className="profile-userpic">
                                  <img className="img" src={this.state.imageProfile} alt=""/>
                                  <div className="img-camera">
                                    <img className="img-responsive" width={10} height={10} src={img_camera}/>
                                  </div> 
                                  <input className="inputfile" type="file" name="file" onChange={this.handleChange.bind(this)} accept="image/*"/> 
                              </div>
                              {this.state.isUpload?
                                <Form onSubmit={this.uploadToFirebase.bind(this)}>
                                  <Button outline color="primary" size="sm">upload</Button>
                                </Form>
                                :null
                              }
                            </center>
                          </div>
                          <br/>
                          <br/>
                          <Row>
                            <Col>
                              <Form>
                              <Row form>
                                <Col xs={6} md={6}>
                                  <FormGroup>
                                    <TextField size="small" fullWidth id="firstname" label="ชื่อ" variant="outlined" value={this.state.firstname} onChange={this.onChangeFirstName.bind(this)} />
                                  </FormGroup>
                                </Col>
                                <Col xs={6} md={6}>
                                  <FormGroup>
                                    <TextField size="small" fullWidth id="lastname" label="นามสกุล" variant="outlined" value={this.state.lastname} onChange={this.onChangeLastName.bind(this)}/>
                                  </FormGroup>
                                </Col>
                              </Row>
                              <FormGroup>
                                <TextField size="small" fullWidth id="phone" label="เบอร์โทรศัพท์" variant="outlined" value={this.state.phone} onChange={this.onChangePhone.bind(this)}/>
                              </FormGroup>
                              <FormGroup>
                                {/* <Label for="exampleAddress">อีเมล</Label>
                                <Input type="text" id="exampleAddress" placeholder="" value={this.state.email} onChange={this.onChangeEmail.bind(this)}/> */}
                                <TextField size="small" fullWidth id="email" label="อีเมล" variant="outlined" value={this.state.email} onChange={this.onChangeEmail.bind(this)}/>
                              </FormGroup>
                              <FormGroup>
                                {/* <Label for="exampleAddress">ที่อยู่</Label>
                                <Input type="text" id="exampleAddress" placeholder="" value={this.state.address} onChange={this.onChangeAddress}/> */}
                                <TextField size="small" fullWidth multiline id="address" label="ที่อยู่" variant="outlined" value={this.state.address} onChange={this.onChangeAddress}/>
                              </FormGroup>
                              <FormGroup>
                                {/* <Label for="exampleAddress">จังหวัด</Label>
                                <Input type="select" name="select" id="exampleSelect" onChange={this.onChangeProvince.bind(this)} value={this.state.province}>
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
                                  size="small"
                                >
                                  {this.state.dataProvince.map((item,index) => (
                                    <MenuItem key={this.state.dataProvince[index]} value={this.state.dataProvince[index]}>
                                      {this.state.dataProvince[index]}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </FormGroup>
                              <FormGroup>
                                    {/* <Label for="exampleCity">อำเภอ</Label>
                                    <Input type="select" name="select" id="exampleSelect" onChange={this.onChangeAmphoe.bind(this)} value={this.state.amphoe}>
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
                                  size="small"
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
                                    {/* <Label for="exampleState">ตำบล</Label>
                                    <Input type="select" name="select" id="exampleSelect" onChange={this.onChangeDistrict.bind(this)} value={this.state.district}>
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
                                      size="small"
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
                                    {/* <Label for="exampleZip">รหัสไปรษณีย์</Label>
                                    <Input type="select" name="select" id="exampleSelect" onChange={this.onChangeZipCode.bind(this)} value={this.state.zipcode}>
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
                                      size="small"
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
                              <Button outline color="primary" onClick={this.updateShop.bind(this)} className="btn-register">บันทึก</Button>
                            </Form>
                            </Col>
                          </Row>
                          <br/>
                          <br/>
                          <h2>หลักฐานการสมัคร(เพิ่มเติม)</h2>
                          <Row>
                            <Col xs={12} md={6}>
                              <p>รูปบัตรประชาชน</p>
                              <Row>
                                <Col xs={12}>
                                  <div>
                                  <center>
                                    <div className="idcard-storepic">
                                        <img className="img" src={this.state.image_idcardfront} alt=""/>
                                        {/* <div className="img-camera">
                                          <img className="img-responsive" width={10} height={10} src={img_camera}/>
                                        </div>  */}
                                        <input disabled={this.state.status_register === 1} className="inputfile" type="file" name="file" onChange={this.handleChangeIdCardFront.bind(this)} accept="image/*"/> 
                                    </div>
                                    {this.state.isUpload_idcardfront?
                                      <Form onSubmit={this.uploadToFirebaseIdCardFront.bind(this)}>
                                        <Button outline color="primary" size="sm">upload</Button>
                                      </Form>
                                      :null
                                    }
                                  </center>
                                  </div>
                                  <br/>
                                </Col>
                                <Col xs={12}>
                                  <div>
                                    <center>
                                      <div className="idcard-storepic">
                                          <img className="img" src={this.state.image_idcardback} alt=""/>
                                          {/* <div className="img-camera">
                                            <img className="img-responsive" width={10} height={10} src={img_camera}/>
                                          </div>  */}
                                          <input disabled={this.state.status_register === 1} className="inputfile" type="file" name="file" onChange={this.handleChangeIdCardBack.bind(this)} accept="image/*"/> 
                                      </div>
                                      {this.state.isUpload_idcardback?
                                        <Form onSubmit={this.uploadToFirebaseIdCardBack.bind(this)}>
                                          <Button outline color="primary" size="sm">upload</Button>
                                        </Form>
                                        :null
                                      }
                                    </center>
                                  </div>
                                  <br/>
                                </Col>
                                <Col xs={12}>
                                  <div>
                                    <center>
                                      <div className="idcard-storepic">
                                          <img className="img" src={this.state.image_idcard} alt=""/>
                                          {/* <div className="img-camera">
                                            <img className="img-responsive" width={10} height={10} src={img_camera}/>
                                          </div>  */}
                                          <input disabled={this.state.status_register === 1} className="inputfile" type="file" name="file" onChange={this.handleChangeIdCard.bind(this)} accept="image/*"/> 
                                      </div>
                                      {this.state.isUpload_idcard?
                                        <Form onSubmit={this.uploadToFirebaseIdCard.bind(this)}>
                                          <Button outline color="primary" size="sm">upload</Button>
                                        </Form>
                                        :null
                                      }
                                    </center>
                                  </div>
                                  <br/>
                                </Col>
                              </Row>
                            </Col>
                            <Col xs={12} md={6}>
                              <p>ข้อมูลบัตรประชาชน</p>
                              <Form>
                                <Row form>
                                  <Col md={6}>
                                    <FormGroup>
                                      <TextField value={this.state.citizen_firstname} onChange={this.onFirstName.bind(this)} disabled={this.state.status_register === 1} size="small" fullWidth id="firstname" label="ชื่อ" variant="outlined"/>
                                    </FormGroup>
                                  </Col>
                                  <Col md={6}>
                                    <FormGroup>
                                      <TextField value={this.state.citizen_lastname} onChange={this.onLastName.bind(this)} disabled={this.state.status_register === 1} size="small" fullWidth id="lastname" label="นามสกุล" variant="outlined"/>
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <FormGroup>
                                  <TextField value={this.state.citizen_id} onChange={this.onID.bind(this)} disabled={this.state.status_register === 1} size="small" fullWidth label="เลขบัตรประชาชน" variant="outlined"/>
                                </FormGroup>
                                <FormGroup>
                                  <TextField value={this.state.citizen_address} onChange={this.onAddress.bind(this)} disabled={this.state.status_register === 1} multiline rows={4} size="small" fullWidth label="ที่อยู่ตามบัตรประชาชน" variant="outlined"/>
                                </FormGroup>
                                <FormGroup>
                                  <TextField value={this.state.citizen_exp} onChange={this.onExpire.bind(this)} disabled={this.state.status_register === 1} size="small" fullWidth label="วันบัตรหมดอายุ" variant="outlined"/>
                                </FormGroup>
                              </Form>
                            </Col>
                            <Col xs={12} md={6}>
                              <p>ช่องทางการชำระ รูปหน้าบัญชีธนาคาร</p>
                              <div>
                                <center>
                                  <div className="idcard-storepic">
                                      <img className="img" src={this.state.image_idcard_bank} alt=""/>
                                      {/* <div className="img-camera">
                                        <img className="img-responsive" width={10} height={10} src={img_camera}/>
                                      </div>  */}
                                      <input disabled={this.state.status_register === 1} className="inputfile" type="file" name="file" onChange={this.handleChangeIdCardBank.bind(this)} accept="image/*"/> 
                                  </div>
                                  {this.state.isUpload_idcard_bank?
                                    <Form onSubmit={this.uploadToFirebaseIdCardBank.bind(this)}>
                                      <Button outline color="primary" size="sm">upload</Button>
                                    </Form>
                                    :null
                                  }
                                </center>
                              </div>
                            </Col>
                            <Col xs={12} md={6}>
                              <p>ข้อมูลบัญชีธนาคาร</p>
                              <Form>
                                <FormGroup>
                                  <TextField value={this.state.bank_name} onChange={this.onBankName.bind(this)} disabled={this.state.status_register === 1} size="small" disabled={this.state.isEditAddress} fullWidth label="ชื่อบัญชี" variant="outlined"/>
                                </FormGroup>
                                <FormGroup>
                                <RadioGroup value={this.state.bank_type} onChange={this.onBankType.bind(this)} aria-label="gender" name="gender1">
                                  <FormControlLabel value="kbank" control={<Radio />} label="กสิกร" disabled={this.state.status_register === 1}/>
                                  <FormControlLabel value="scb" control={<Radio />} label="ไทยพาณิช" disabled={this.state.status_register === 1}/>
                                  <FormControlLabel value="other" control={<Radio />} label="Other" disabled={this.state.status_register === 1}/>
                                </RadioGroup>
                                </FormGroup>
                                <FormGroup>
                                  <TextField value={this.state.bank_number} onChange={this.onBankNumber.bind(this)} disabled={this.state.status_register === 1} size="small" fullWidth label="เลขบัญชี" variant="outlined"/>
                                </FormGroup>
                              </Form>
                            </Col>
                            <Col xs={12}>
                              <p>รายละเอียดร้านค้าของคุณ</p>
                              <TextField value={this.state.shop_details} onChange={this.onShopDetails.bind(this)} disabled={this.state.status_register === 1} multiline rows={4} size="small" fullWidth label="รายละเอียดร้านค้าของคุณ" variant="outlined"/>
                            </Col>
                            <Col xs={12}>
                              <br/>
                              <Button disabled={this.state.status_register === 1} outline color="primary" onClick={this.updateShopData.bind(this)} className="btn-register">บันทึก</Button>
                            </Col>
                          </Row>
                          <br/>
                          <p>*หลักฐานเพื่อใช้ประกอบอนุมัติและยืนยันเพื่อให้เกิดความมั่นใจในการซื้นสินค้าของผู้ใช้งานเท่านั้น</p>
                          <br/>
                          <hr/>
                          {this.state.rule === 'admin'?
                          <div>
                            <h2>Setting</h2>
                            <Row>
                              <Col xs={12} md={6}>
                                <img width="100%" src={this.state.imgPromotion}/>
                              </Col>
                              <Col xs={12} md={6}>
                                <FormGroup>
                                  {/* <Label for="exampleZip">promotion</Label>
                                  <Input type="select" name="select" id="exampleSelect" onChange={this.onChangePromotion.bind(this)} value={this.state.isShowPromotion}>     
                                    <option value="true">เปิด</option>
                                    <option value="false">ปิด</option>
                                  </Input> */}

                                  <TextField
                                    id="filled-select-currency"
                                    select
                                    label="promotion"
                                    value={this.state.isShowPromotion}
                                    onChange={this.onChangePromotion.bind(this)}
                                    helperText=""
                                    variant="outlined"
                                    fullWidth
                                    >
                                      <MenuItem key={true} value={true}>
                                        เปิด
                                      </MenuItem>
                                      <MenuItem key={false} value={false}>
                                        ปิด
                                      </MenuItem>
                                  </TextField>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                              <FormGroup>
                                  {/* <Label for="exampleZip">ปรับปรุงเว็บไซต์</Label>
                                  <Input type="select" name="select" id="exampleSelect" onChange={this.onChangePage.bind(this)} value={this.state.isPage}>     
                                    <option value="true">เปิด</option>
                                    <option value="false">ปิด</option>
                                  </Input> */}
                                  <TextField
                                    id="filled-select-currency"
                                    select
                                    label="ปรับปรุงเว็บไซต์"
                                    value={this.state.isPage}
                                    onChange={this.onChangePage.bind(this)}
                                    helperText=""
                                    variant="outlined"
                                    fullWidth
                                    >
                                      <MenuItem key={true} value={true}>
                                        เปิด
                                      </MenuItem>
                                      <MenuItem key={false} value={false}>
                                        ปิด
                                      </MenuItem>
                                  </TextField>
                                </FormGroup>
                              </Col>
                            </Row>
                          </div>
                          :null
                          }
                        </TabPane>
                    </TabContent>
                  </Col>
                </Row>
              </Container>
              <Modal id="user-alert" isOpen={this.state.isShowReceipt} toggle={this.onHide.bind(this)} fade={false} centered>
                        <ModalBody>
                          <img width="100%" src={this.state.urlImgReceipt} /><br/><br/>
                          <center>
                            <Button color="success" onClick={this.confirmReceipt.bind(this)}>ยืนยันใบเสร็จ</Button> <Button outline color="danger" onClick={this.onHide.bind(this)}>ปิด</Button>
                          </center>
                        </ModalBody>
              </Modal>

              {/* alert update success */}

              <Modal id="login-error" isOpen={this.state.isShowUpdateSuccess} toggle={this.onHideUpdateSuccess.bind(this)} fade={false} centered>
                    <ModalBody>
                      <center>
                        {/* <h3 className="txt-header-sub"></h3> */}
                        <p>อัพเดทข้อมูลสำเร็จแล้ว</p>
                        <Button color="success" onClick={this.onHideUpdateSuccess.bind(this)}>ปิด</Button>
                      </center>
                    </ModalBody>
              </Modal>


              <Modal id="login-error" isOpen={this.state.isShowNotAdd} toggle={this.onHideNotAdd.bind(this)} fade={false} centered>
                    <ModalBody>
                      <center>
                        {/* <h3 className="txt-header-sub"></h3> */}
                        <p>อัพเดทข้อมูลสำเร็จแล้ว</p>
                        <Button color="success" onClick={this.onHideNotAdd.bind(this)}>ตกลง</Button>
                      </center>
                    </ModalBody>
              </Modal>

            </div>
        )
    }
}