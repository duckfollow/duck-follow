import React from 'react';
import '../App.css';
import { Badge } from 'reactstrap';

export default class Policy extends React.Component {
    render() {
        return (
            <div className="App">
                <div className="App-content">
                    <h1>Policy <Badge color="secondary">privacy</Badge></h1>
                </div>
             </div>
        );
      }
}