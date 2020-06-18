import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './lamp.css';

export default class lamp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModal: false
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if (!this.state.isModal) {
            this.setState({isModal:true})
        }else {
            this.setState({isModal:false})
        }
    }

    render() {
        return (
            <div className="lamp-content">
                <marquee className="text-size">Text</marquee>
                <Button color="danger" onClick={this.handleClick}>click</Button>
                <Modal isOpen={this.state.isModal} toggle={this.handleClick} className="modal-dialog-centered" size="lg">
                    <ModalHeader toggle={this.handleClick}>Modal title</ModalHeader>
                    <ModalBody>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </ModalBody>
                    <ModalFooter>
                    <Button color="primary" onClick={this.handleClick}>Do Something</Button>{' '}
                    <Button color="secondary" onClick={this.handleClick}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}