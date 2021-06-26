import React from 'react';
import './Webview.css';

export default class Webview extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
      return (
       <div>
           <marquee>ขออนุญาตเปลี่ยนแปลงเว็บไซต์ หากมีสินค้าหรือมีความสนใจขายหรือแลกเปลี่ยนสินค้าสามารถลงทะเบียนที่เว็บไซต์นี้ได้</marquee>
           <iframe className="view" src="https://duckfollow.github.io/kaset/#/"></iframe>
       </div>
      );
    }
  }