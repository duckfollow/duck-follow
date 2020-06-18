import React, { useState } from 'react';
import * as firebase from 'firebase';
import './ListArticle.css';
import Swiper from 'react-id-swiper';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button
  } from 'reactstrap';
  import img_p from '../assets/img/318x180.svg'

export default class ListArticle extends React.Component {
    
    constructor(props) {
        super(props)
    }

    render() {
        const params = {
            slidesPerView: 4,
            grabCursor: true,
            loop: false,
            direction: 'horizontal',
            watchOverflow: true,
            autoplay: false,
            /*pagination: {
              el: '.swiper-pagination',
              type: 'bullets',
              clickable: true
            },*/
            breakpoints: {
                250: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                // when window width is <= 1024px
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 30
                }
            },
            spaceBetween: 20
          }

      return (
        <Swiper {...params}>
            <div className="padding-left">
                <Card>
                    <CardImg top  width="100%" src={img_p} alt="Card image cap" />
                    <CardBody>
                    <CardTitle>Card title</CardTitle>
                    <CardSubtitle>Card subtitle</CardSubtitle>
                    <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
                    <Button>Button</Button>
                    </CardBody>
                </Card>
            </div>
            {/* <div>
                <Card>
                    <CardImg top width="100%" src={img_p} alt="Card image cap" />
                    <CardBody>
                    <CardTitle>Card title</CardTitle>
                    <CardSubtitle>Card subtitle</CardSubtitle>
                    <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
                    <Button>Button</Button>
                    </CardBody>
                </Card>
            </div>
            <div>
                <Card>
                    <CardImg top width="100%" src={img_p} alt="Card image cap" />
                    <CardBody>
                    <CardTitle>Card title</CardTitle>
                    <CardSubtitle>Card subtitle</CardSubtitle>
                    <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
                    <Button>Button</Button>
                    </CardBody>
                </Card>
            </div>
            <div>
                <Card>
                    <CardImg top width="100%" src={img_p} alt="Card image cap" />
                    <CardBody>
                    <CardTitle>Card title</CardTitle>
                    <CardSubtitle>Card subtitle</CardSubtitle>
                    <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
                    <Button>Button</Button>
                    </CardBody>
                </Card>
            </div>
            <div>
                <Card>
                    <CardImg top width="100%" src={img_p} alt="Card image cap" />
                    <CardBody>
                    <CardTitle>Card title</CardTitle>
                    <CardSubtitle>Card subtitle</CardSubtitle>
                    <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
                    <Button>Button</Button>
                    </CardBody>
                </Card>
            </div>
            <div>
                <Card>
                    <CardImg top width="100%" src={img_p} alt="Card image cap" />
                    <CardBody>
                    <CardTitle>Card title</CardTitle>
                    <CardSubtitle>Card subtitle</CardSubtitle>
                    <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
                    <Button>Button</Button>
                    </CardBody>
                </Card>
            </div>
            <div>
                <Card>
                    <CardImg top width="100%" src={img_p} alt="Card image cap" />
                    <CardBody>
                    <CardTitle>Card title</CardTitle>
                    <CardSubtitle>Card subtitle</CardSubtitle>
                    <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
                    <Button>Button</Button>
                    </CardBody>
                </Card>
            </div>
            <div className="padding-right">
                <Card>
                    <CardImg top width="100%" src={img_p} alt="Card image cap" />
                    <CardBody>
                    <CardTitle>Card title</CardTitle>
                    <CardSubtitle>Card subtitle</CardSubtitle>
                    <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
                    <Button>Button</Button>
                    </CardBody>
                </Card>
            </div> */}
        </Swiper>
      );
    }
  }