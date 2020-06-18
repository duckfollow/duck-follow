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
import { Jumbotron, Button } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import {UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
import {
    Card, CardImg, CardText, CardBody, CardLink,
    CardTitle, CardSubtitle
  } from 'reactstrap';
import { Masonry } from './Masonry';
import { Link } from "react-router-dom";
import './Shop.css';
import img_cart from '../assets/img/basket.svg'
import img_arrow from '../assets/img/arrow.svg'
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';

import * as firebase from 'firebase';

export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataCart:[]
        };
        
    }

    componentDidMount(){
        const dataCart = firebase.database().ref('cartweb/id');
    
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
              profile_picture:data.profile_picture,
              });
        });

          this.setState({
            dataCart: dataStorageCart
          });
        });

        
      }


    render() {
        return (
            <div>
                Dashboard
            </div>

        )
    }
}