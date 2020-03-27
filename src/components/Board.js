import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Container, Row, Col } from 'reactstrap';
import './Board.css';
import * as firebase from 'firebase';

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
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    borderRadius: 5,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
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
        console.log(this.state.items)
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

            if (source.droppableId === 'droppable') {
                const dataRef = firebase.database()
                dataRef.ref("todo/"+key_value).update({
                    status: true
                }).then(function () {
                    console.log("success")
                    }, function () {
                    console.log('rejected promise')
                }).catch((e) => console.log(e))
            } else {
                const dataRef = firebase.database()
                dataRef.ref("todo/"+key_value).update({
                    status: false
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
        return (
        <div className="Board-content">
            <br/>
            <br/>
           <DragDropContext onDragEnd={this.onDragEnd}>
                    <div className="after-box">
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
                                                    {item.text}
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
                        <h1>Complete</h1>
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
                                                    {item.text}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        </div>
                        </div>
       </DragDropContext>
       </div>
        );
      }
}