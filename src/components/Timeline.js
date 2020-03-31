import React from 'react';
import * as firebase from 'firebase';
import './Timeline.css';
import Swiper from 'react-id-swiper';
import android_logo from '../assets/img/android_logo.svg'
import ku_logo from '../assets/img/KU_Logo.png'

export default class Timeline extends React.Component {
    render() {
        const params = {
            slidesPerView: 3,
            grabCursor: true,
            loop: false,
            direction: 'horizontal',
            watchOverflow: true,
            pagination: {
              el: '.swiper-pagination',
              type: 'bullets',
              clickable: true
            },
            breakpoints: {
                250: {
                    slidesPerView: 1,
                    // spaceBetween: 20
                },
                // when window width is <= 1024px
                1024: {
                    slidesPerView: 2,
                    // spaceBetween: 30
                }
            },
          }

      return (
        <Swiper {...params} activeSlideKey='4'>
            <div key='0' className="swiper-slide">
                <div className="timestamp">
                    <span className="date">
                    <div className="box">
                        <div style={{width:"50px",height:"63.83px"}}></div>
                    </div>
                    <br/>29 Apr 1996</span>
                </div>
                <div className="status">
                    <span>Birth's Day</span>
                </div>
            </div>
            <div key='1' className="swiper-slide">
                <div className="timestamp">
                    <span className="date">
                        <div className="box">
                            <img width={50} src={ku_logo}/>
                        </div>
                        <br/>
                        17 Aug 2013</span>
                </div>
                <div className="status">
                    <span>Birth's my son/Start University's Kasetsart</span>
                </div>
            </div>
            <div key='2' className="swiper-slide">
                <div className="timestamp">
                    <span className="date">
                        <div className="box">
                            <div style={{width:"50px",height:"63.83px"}}></div>
                        </div>
                        <br/>
                        14 May 2017 </span>
                </div>
                <div className="status">
                    <span>First JOB PHP Programmer</span>
                </div>
            </div>
            <div key='3' className="swiper-slide">
                <div className="timestamp">
                    <span className="date">
                    <div className="box">
                        <div style={{width:"50px",height:"63.83px"}}></div>
                    </div>
                    <br/>
                    1 May 2019</span>
                </div>
                <div className="status">
                    <span>
                        <img src={android_logo} />
                        <br/>
                        Android/IOS Developer
                    </span>
                    
                </div>
            </div>
            <div key='4' className="swiper-slide">
                <div className="timestamp">
                    <span className="date">
                    <div className="box">
                        <div style={{width:"50px",height:"63.83px"}}></div>
                    </div>
                    <br/>
                    1 Jan 2020</span>
                </div>
                <div className="status">
                    <span>node.js Developer</span>
                </div>
            </div>
        </Swiper>
      );
    }
  }