import React from 'react';
import './Shop.css';
import page_error from '../assets/img/page_error.png'

export default class ShopError extends React.Component {
    render() {
        return (
            <div>
                <section>
                    <div className="App-content">
                        <img width={300} height={300} src={page_error}/>
                        <h1>ปิดปรุ่งชั่วคราว !</h1>
                        <p style={{padding:'15px'}}>ขออภัยในความไม่สะดวกตอนนี้เว็บไซต์ของปิดปรับปรุงชั่วคราว</p>
                    </div>
                </section>
            </div>
        );
      }
}