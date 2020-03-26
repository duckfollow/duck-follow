import React from 'react';
import * as firebase from 'firebase';
import './Timeline.css';
import Swiper from 'react-id-swiper';

export default class Timeline extends React.Component {
    render() {
        const params = {
            slidesPerView: 4,
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
                480: {
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
        <Swiper {...params}>
            <div className="swiper-slide">
                <div className="timestamp">
                    <span className="date">29 April 1996</span>
                </div>
                <div className="status">
                    <span>Birth's Day</span>
                </div>
            </div>
            <div className="swiper-slide">
                <div className="timestamp">
                    <span className="date">asas</span>
                </div>
                <div className="status">
                    <span>asas</span>
                </div>
            </div>
            <div className="swiper-slide">
                <div className="timestamp">
                    <span className="date">edweew</span>
                </div>
                <div className="status">
                    <span>wererer</span>
                </div>
            </div>
            <div className="swiper-slide">
                <div className="timestamp">
                    <span className="date">edweew</span>
                </div>
                <div className="status">
                    <span>wererer</span>
                </div>
            </div>
            <div className="swiper-slide">
                <div className="timestamp">
                    <span className="date">edweew</span>
                </div>
                <div className="status">
                    <span>wererer</span>
                </div>
            </div>
            <div className="swiper-slide">
                <div className="timestamp">
                    <span className="date">edweew</span>
                </div>
                <div className="status">
                    <span>wererer</span>
                </div>
            </div>
        </Swiper>
      );
    }
  }