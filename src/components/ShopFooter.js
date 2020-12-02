import React from "react";
import { Jumbotron, Button } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import './Shop.css';
import './ShopFooter.css';
import ic_facebook from '../assets/img/icon-facebook.svg';
import ic_twitter from '../assets/img/icon-twitter.svg'
import ic_instagram from '../assets/img/icon-instagram.svg'
import ic_youtube from '../assets/img/icon-youtube.svg'
import ic_line from '../assets/img/icon-line.svg'
import classnames from 'classnames';
import {Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import * as firebase from 'firebase';
import googleplay from '../assets/img/googleplay.svg';
import qr_code_box from '../assets/img/qr-code-box.png';
import { Link } from "react-router-dom";

export default class ShopFooter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowContact: false,
            emailContact: "",
            textHead: "",
            textSub: ""
        }
    }

    componentDidMount(){

    }

    webContact() {
        if (this.state.emailContact !== "") {
            const dataRef = firebase.database()
            const context = this
            var today = (new Date()).toISOString()
            var data = {
                email: this.state.emailContact,
                date: today
            }
            dataRef.ref("webcontact/").push(data).then(function () {
                context.setState({emailContact:"",isShowContact:true,textHead:"สำเร็จแล้ว",textSub:"เราจะกำลังจะติดต่อกลับในภายหลัง"})
                }, function () {
                console.log('rejected promise')
            }).catch((e) => console.log(e))
        } else {
            this.setState({emailContact:"",isShowContact:true,textHead:"ลองใหม่อีกครั้ง",textSub:"กรุณากรอก ข้อมูลที่ถูกต้อง ใหม่อีกครั้ง"})
        }
        
    }

    onSetEmailContact (event) {
        console.log(event.target.value)
        this.setState({
            emailContact:event.target.value
          })
    }

    onHide() {
        this.setState({isShowContact:false})
    }

    clickStore() {
        this.props.history.push('/dashboard')
    }

    render() {
        return (
            <Jumbotron className="footer-custom">
                 <Row>
                    <Col xs={12} sm={6} md={3} className="header-margin">
                        <h6 className="text-bold">ติดต่อได้ที่</h6>
                        <p>50 หมุ่ 18 ต.สำราญใต้ อ.สามชัย จ.กาฬสินธุ์ 46180 เบอร์โทรติดต่อ 090-993-1282</p>
                    </Col>
                    <Col xs={12} sm={6} md={3} className="header-margin">
                        <h6 className="text-bold">ติดตามเรา</h6>
                        <Row>
                            <Col xs={1}>
                                <a href="https://www.facebook.com/boxhubservice"><img src={ic_facebook}/></a>
                            </Col>
                            <Col xs={1}>
                                <img src={ic_twitter}/>
                            </Col>
                            <Col xs={1}>
                                <img src={ic_instagram}/>
                            </Col>
                            <Col xs={1}>
                                <img src={ic_youtube}/>
                            </Col>
                            <Col xs={1}>
                                <img src={ic_line}/>
                            </Col>
                        </Row>
                        <br/>
                        <br/>
                        <h6 className="text-bold">สมัครเป็นพาร์ทเนอร์กับเรา</h6>
                        <Row className="form-sub">
                            <Col xs={8} className="form-sub-padding">
                                <Input value={this.state.emailContact} className="form-input-sub" type="email" placeholder="ใส่อีเมลของคุณ" onChange={this.onSetEmailContact.bind(this)}/>  
                            </Col>
                            <Col xs={4} className="form-sub-padding">
                                <Button onClick={this.webContact.bind(this)} className="btn-form-sub">เข้าร่วม</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12} sm={6} md={3} className="header-margin">
                    <h6 className="text-bold">บริการ/อื่นๆ</h6>
                    <ul>
                        <li>ซื้อสินค้าออนไลน์</li>
                        <li><Link to={`/shop-store-register`} className="link-footer">บริการร้านออนไลน์</Link></li>
                    </ul>
                    </Col>
                    <Col xs={12} sm={6} md={3} className="header-margin">
                    <h6 className="text-bold">ดาวน์โหลดแอป The box shop เปิดร้านออนไลน์</h6>
                    <Row>
                        <Col xs={6}>
                        <img width="100%" src={qr_code_box}/>
                        </Col>
                        <Col xs={6}>
                        <a href="https://play.google.com/store/apps/details?id=com.prasit.theboxshop">
                            <img width="100%" src={googleplay}/>
                        </a>
                        </Col>
                    </Row>
                    </Col>
                </Row>
                    <hr className="my-2" />
                    <p>@copy right duckfollow 2020</p>

                <Modal id="login-error" isOpen={this.state.isShowContact} toggle={this.onHide.bind(this)} fade={false} centered>
                    <ModalBody>
                      <center>
                        <h3 className="txt-header-sub">{this.state.textHead}</h3>
                        <p>{this.state.textSub}</p>
                        <Button outline color="success" onClick={this.onHide.bind(this)}>ปิด</Button>
                      </center>
                    </ModalBody>
                </Modal>
            </Jumbotron>
        )
    }
}