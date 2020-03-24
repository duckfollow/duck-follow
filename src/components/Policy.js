import React from 'react';
import './Policy.css';
import { Badge } from 'reactstrap';

export default class Policy extends React.Component {
    render() {
        return (
            <div className="App">
                <div className="App-content">
                    <h1>Policy <Badge color="secondary">privacy</Badge></h1>
                </div>
                <div className="App-content">
                    <h3>เมื่อคุณใช้บริการของเรา คุณไว้วางใจให้เรารักษาข้อมูลของคุณ <br/> เราเข้าใจว่านี่คือความรับผิดชอบที่ยิ่งใหญ่<br/>และพยายามอย่างยิ่งที่จะปกป้องข้อมูลของคุณ <br/> รวมถึงมอบอำนาจในการควบคุมข้อมูลให้แก่คุณ</h3>
                </div>
            </div>
        );
      }
}