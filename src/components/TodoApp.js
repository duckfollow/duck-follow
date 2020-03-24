import { Button, Form, FormGroup, Label, Input, Fade } from 'reactstrap';
import React, { useState } from 'react';


export default class TodoApp extends React.Component {
    
    constructor(props) {
      super(props);
      this.state = { 
          items: [], 
          text: '' };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    render() {
      return (
        <div>
            <h1>TO DO</h1>
            <Form inline onSubmit={this.handleSubmit}>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Input id="new-todo"
                        onChange={this.handleChange}
                        value={this.state.text} placeholder="What needs to be done?"/>
                </FormGroup>
                <Button>Add #{this.state.items.length + 1}</Button>
            </Form>
            <TodoList items={this.state.items} />
        </div>
      );
    }
  
    handleChange(e) {
      this.setState({ text: e.target.value });
    }
  
    handleSubmit(e) {
      e.preventDefault();
      if (this.state.text.length === 0) {
        return;
      }
      const newItem = {
        text: this.state.text,
        id: Date.now()
      };
      this.setState(state => ({
        items: state.items.concat(newItem),
        text: ''
      }));
    }
  }

  class TodoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            fadeIn: true};
        this.handleRemove = this.handleRemove.bind(this);
    }

    handleRemove(e) {
        e.preventDefault();
        this.setState({
            fadeIn: false
        })
    }
    render() {
      return (
        <ul>
          {this.props.items.map(item => (
             <Fade in={this.state.fadeIn} tag="h5" className="mt-3"><li  onClick={this.handleRemove} key={item.id}><Input type="checkbox" />{' '}{item.text}</li></Fade>
          ))}
        </ul>
      );
    }
  }
  