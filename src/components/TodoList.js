import { Button, Form, FormGroup, Label, Input, Fade } from 'reactstrap';
import React from 'react';
import * as firebase from 'firebase';
import './TodoApp.css';

export default class TodoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
          items: []};
        this.handleChange = this.handleChange.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    componentDidMount(){
      const dataList = firebase.database().ref('todo');
      dataList.on('value', (snapshot) => {
        let dataTodo = [];  
        snapshot.forEach(productSnapshot => {
          let data = productSnapshot.val();
          if (!data.status) {
            dataTodo.push({
                id:productSnapshot.key,
                text:data.text,
                status:data.status,
                date:data.date
            });
          }
      });
        this.setState({
          items: dataTodo
        });
      });
    }

    handleChange(event) {
      const dataRef = firebase.database()
      console.log(event.target.value)
      const key_value = event.target.value
      const isChecked = event.target.checked;

      dataRef.ref("todo/"+key_value).update({
        status: isChecked
      }).then(function () {
        console.log("success")
        }, function () {
        console.log('rejected promise')
      }).catch((e) => console.log(e))
    }

    handleRemove(event) {
      console.log(event.target.value)
      const dataRef = firebase.database()
      const key_value = event.target.value
      dataRef.ref("todo").child(key_value).remove();
    }
  
    render() {
      return (
        <div className="align-left">
          <ul>
            {this.state.items.map(item => (
              <Fade in={!item.status} tag="h5" className="mt-3"><li><Input type="checkbox" value={item.id} defaultChecked={item.status} onChange={this.handleChange}/>{item.text} <Button value={item.id} onClick={this.handleRemove} outline color="danger" size="sm">ลบ</Button></li></Fade>
            ))}
          </ul>
        </div>
      );
    }
  }