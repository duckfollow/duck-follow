import React, { PureComponent } from 'react';
import './Masonry.css';
import { Col, Card, Row } from 'reactstrap';

/**
 * Modified from codepen  'https://codepen.io/anon/pen/XPdEpM' 
 * A component to render Masonry layout
 * @example
 * <XMasonry loadingComponent = {()=>{return '***********Loading***********'}}
 *           brakePoints={[350, 500, 750]}
 *          loadNext={({columns,totalItems}) => {  {columns,totalItems} - use this to construct url}}
 *  >{ this.state.photos.map((image, id) =>( <img key={id}  src={image}/> ) )} </XMasonry>
 */
export class Masonry extends PureComponent {
    state = {
        columns: 1,
        prevY: 0,
        loading: false
    };
    constructor(props) { super(props) }
    /**
     * a funntion used to calculate columns when resized
     */
    onResize = () => {
        try{
            const columns = this.getColumns(this.refs.Masonry.offsetWidth);
            console.log("text_columns"+columns+"//"+this.refs.Masonry.offsetWidth)
            if (columns !== this.state.columns) this.setState({ columns: columns });
        }catch(e){
            
        }
        
        // const columns = 4;
       
    }
    /**
     * a function used to calculate columns from this.props.brakePoints
     * @param {Number} width - width of the masonry component
     */
    getColumns = width => {
        return this.props.brakePoints.reduceRight((p, c, i) => {
            return c < width ? p : i;
        }, this.props.brakePoints.length) + 1;
    }
    /**
     * a function used to calculate children according to column size
     */
    mapChildren = () => {
        let col = [];
        const numC = this.state.columns;
        for (let i = 0; i < numC; i++) {
            col.push([]);
        }
        return this.props.children.reduce((p, c, i) => {
            p[i % numC].push(c);
            return p;
        }, col);
    }
    /**
     * a function used to call loadNext method to make lazyLoading from the rest
     * @param {*} entities 
     * @param {*} observer 
     */
    handleObserver = (entities, observer) => {
        const y = entities[0].boundingClientRect.y;
        if (this.state.prevY > y) {
            this.props.loadNext && this.setState({ loading: true });
            this.props.loadNext && this.props.loadNext({
                columns: this.mapChildren().length,
                totalItems: this.props.children.reduce((tot, ch) => tot + 1, 0)
            });
        }
        this.setState({ prevY: y });
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.children.length < this.props.children.length && this.props.loadNext) { this.setState({ loading: false }) }
        return true;
    }
    componentDidMount() {
        //initial resize
        this.onResize();
        // add listener for window object
        window.addEventListener('resize', this.onResize);
        if (this.props.loadNext) {
            // Create an observer
            this.observer = new IntersectionObserver(
                this.handleObserver.bind(this), //callback
                {
                    root: null, // Page as root
                    rootMargin: "0px",
                    threshold: 0.01
                }
            );
            //Observ the `loadingRef`
            this.observer.observe(this.refs.loadingRef);
        }
    }
    render() {
        const masonryStyle = {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'stretch',
            width: '100%',
            margin: 'auto',
            ...this.props.masonryStyle
        };
        return (
            <Row style={{ overflowY: 'hidden',overflowX: 'hidden', margin: '5px', height: this.props.height || '100%' }}>
                <div style={masonryStyle} ref="Masonry">
                    {this.mapChildren().map((col, ci) => {
                        return (
                            <Col className='pr-2-custom pl-2-custom' style={this.props.columnStyle} key={ci} >
                                {col.map((child, i) => {
                                    return <Card key={i} className='mt-2 mb-2 card-view'>{child}</Card>
                                })}
                            </Col>
                        )
                    })}
                </div >
                <div ref="loadingRef" style={{ height: "10%", width: '100%', margin: "0px", display: this.props.loadNext ? "block" : "none" }} >
                    <span style={{ display: this.state.loading ? "block" : "none" }}>
                        {(this.props.loadingComponent) ? this.props.loadingComponent() : 'Loading...'}
                    </span>
                </div>
            </Row>
        )
    }
}