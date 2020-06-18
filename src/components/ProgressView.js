import React from 'react';
import * as firebase from 'firebase';
import './ProgressView.css';
import { Progress } from 'reactstrap';

export default class ProgressView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          scrolled: 0
        };
    }

    componentDidMount() {
      window.addEventListener("scroll", this.scrollProgress);
    }
  
    componentWillUnmount() {
      window.removeEventListener("scroll", this.scrollProgress);
    }
  
    scrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = `${scrollPx / winHeightPx * 100}`;
  
      // console.log(scrolled);
  
      this.setState({
        scrolled: scrolled
      });
    };

    render() {
      return (
        <div className="progress">
           <Progress animated color="info" value={this.state.scrolled} />
        </div>
      );
    }
  }