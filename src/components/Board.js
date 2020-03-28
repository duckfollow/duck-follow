import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button, Form, FormGroup, Label, Input, Fade } from 'reactstrap';
import './Board.css';
import * as firebase from 'firebase';
import {
    Card, CardImg, CardText, CardBody, CardLink,
    CardTitle, CardSubtitle
  } from 'reactstrap';
import binicon from '../assets/img/bin.svg'
import Lottie from 'react-lottie';
import animationData from '../assets/img/success.json'
import success from '../assets/img/success.svg'
// fake data generator
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`
    }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    // padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    borderRadius: 5,
    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getItemCardStyle = (isDragging, draggableStyle) => ({

    // change background colour if dragging
    // backgroundColor: isDragging ? '#17a2b8' : '#fffff',
    borderColor: isDragging ? '#28a745' : '#fffff',

    // styles we need to apply on draggables
    // ...draggableStyle
});

const getItemCard2Style = (isDragging, draggableStyle) => ({

    // change background colour if dragging
    // backgroundColor: isDragging ? '#17a2b8' : '#fffff',
    borderColor: isDragging ? '#ffc107' : '#fffff',

    // styles we need to apply on draggables
    // ...draggableStyle
});

const getItemCardTextStyle = (isDragging, draggableStyle) => ({

    // change background colour if dragging
    color: isDragging ? '#000000' : '#000000',

    // styles we need to apply on draggables
    // ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250,
    borderRadius: 10,
    minHeight: 300,
});

export default class Broard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            selected: []/*,
            complete: getItems(7, 10)*/
        };
        this.handleRemove = this.handleRemove.bind(this);
        this.handleChange = this.handleChange.bind(this);
      }

      handleRemove(event) {
        console.log(event.target.value)
        const dataRef = firebase.database()
        const key_value = event.target.value
        dataRef.ref("todo").child(key_value).remove();
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

      componentDidMount(){
        const dataList = firebase.database().ref('todo');
        dataList.on('value', (snapshot) => {
          let dataTodo = [];
          let dataCompete = []; 
          snapshot.forEach(productSnapshot => {
            let data = productSnapshot.val();
            if (!data.status) {
              dataTodo.push({
                  id:productSnapshot.key,
                  text:data.text,
                  status:data.status,
                  date:data.date
              });
            } else {
                dataCompete.push({
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
          this.setState({
            selected: dataCompete
          });
        });
      }

    /**
     * A semi-generic way to handle multiple lists. Matches
     * the IDs of the droppable container to the names of the
     * source arrays stored in the state.
     */
    id2List = {
        droppable: 'items',
        droppable2: 'selected'/*
        droppable3: 'complete'*/
    };

    getList = id => this.state[this.id2List[id]];

    onDragEnd = result => {
        const { source, destination } = result;
        

        let key_value = result.draggableId
        console.log('result')
        console.log(key_value)
        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                this.getList(source.droppableId),
                source.index,
                destination.index
            );

            let state = { items };

            if (source.droppableId === 'droppable2') {
                state = { selected: items };
            } 

            this.setState(state);
        } else {
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );
            var d = new Date()
            var date = d.toISOString().slice(0,10)
            if (source.droppableId === 'droppable') {
                const dataRef = firebase.database()
                dataRef.ref("todo/"+key_value).update({
                    status: true,
                    date: date
                }).then(function () {
                    console.log("success")
                    }, function () {
                    console.log('rejected promise')
                }).catch((e) => console.log(e))
            } else {
                const dataRef = firebase.database()
                dataRef.ref("todo/"+key_value).update({
                    status: false,
                    date: date
                }).then(function () {
                    console.log("success")
                    }, function () {
                    console.log('rejected promise')
                }).catch((e) => console.log(e)) 
            }

            this.setState({
                items: result.droppable,
                selected: result.droppable2/*,
                complete: result.droppable3*/
            });
        }
    };
    render() {
        const defaultOptions = {
            loop: true,
            autoplay: true, 
            animationData: animationData,
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice'
            }
        };
        return (
        <div className="Board-content">
           <DragDropContext onDragEnd={this.onDragEnd}>
                    {/* <div className="after-box"> */}
                        <div className="box">
                        <h1>TODO</h1>
                        <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}>
                                    {this.state.items.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}>
                                                    <Card style={getItemCardStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}>
                                                        <div>
                                                            <label className="container-checkbox">{item.date}
                                                                <input type="checkbox" value={item.id} defaultChecked={false} onChange={this.handleChange}/>
                                                                <span className="checkmark"></span>
                                                                <button className="btn-float-right btn-custom" value={item.id} onClick={this.handleRemove}>
                                                                    X
                                                                </button>
                                                            </label>
                                                        </div>
                                                       
                                                        <CardBody className="card-body">
                                                            <CardText style={getItemCardTextStyle(
                                                                snapshot.isDragging,
                                                                provided.draggableProps.style
                                                            )}>{item.text}</CardText>
                                                        </CardBody>
                                                    </Card>
                                                </div>

                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        </div>
                        <div className="box">
                        <h1>DONE</h1>
                        <Droppable droppableId="droppable2">
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}>
                                    {this.state.selected.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}>
                                                    <Card
                                                        style={getItemCard2Style(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}>
                                                        <div>
                                                            {/* <Lottie options={defaultOptions}
                                                            height={50}
                                                            width={50}
                                                            isStopped={this.state.isStopped}
                                                            isPaused={this.state.isPaused}/> */}
                                                            <label className="container-checkbox">{item.date}
                                                                <input type="checkbox" checked="checked" value={item.id} defaultChecked={true} onChange={this.handleChange}/>
                                                                <span className="checkmark"></span>
                                                            </label>
                                                        </div>
                                                        <CardBody className="card-body">
                                                            <CardText
                                                            style={getItemCardTextStyle(
                                                                snapshot.isDragging,
                                                                provided.draggableProps.style
                                                            )}>{item.text}</CardText>
                                                        </CardBody>
                                                    </Card>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        </div>
                        {/* </div> */}
       </DragDropContext>
       </div>
        );
      }
}