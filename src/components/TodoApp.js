import { Button, Form, FormGroup, Label, Input, Fade } from 'reactstrap';
import React from 'react';
import * as firebase from 'firebase';
import './TodoApp.css';
import TodoList from './TodoList'

export default class TodoApp extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
          text: '' };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    render() {
      return (
        <div>
            <h1>TO DO</h1>
            <Form inline>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Input id="new-todo"
                        onChange={this.handleChange}
                        value={this.state.text} placeholder="What needs to be done?"/>
                </FormGroup>
                <Button onClick={this.handleSubmit}>Add</Button>
            </Form>
            <TodoList/>
        </div>
      );
    }
  
    handleChange(e) {
      this.setState({ text: e.target.value });
    }
  
    handleSubmit(e) {
      e.preventDefault();
      const dataRef = firebase.database()
      const context = this
      if (this.state.text.length === 0) {
        return;
      }

      dataRef.ref("todo").push({
          text: this.state.text,
          status: false,
          date: Date.now()
        }).then(function () {
          console.log("success")
          context.setState({text:''})
          }, function () {
          console.log('rejected promise')
      }).catch((e) => console.log(e))
    }
  }
  