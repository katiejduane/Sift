import React, { Component } from 'react'

class PlaceCards extends Component {

    render(){
        let styles;
        if(this.props.cards){
            styles = {visibility : "hidden"}
        } else {
            styles = {visibility : "visible"}
        }
        return (
            <div className="placeCards" style={styles}>
                {this.props.cards}
            </div>
        )
    } 
}

export default PlaceCards;

    




