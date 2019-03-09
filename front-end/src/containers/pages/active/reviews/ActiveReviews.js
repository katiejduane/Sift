import React, { Component } from 'react';
import axios from "axios";
import AddReviewForm from '../../../Forms/AddReviewForm';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import { connect } from "react-redux";
import "./ActiveReviews.css";
import PlaceCards from '../../../../components/Lists/PlaceCards/PlaceCards';
import Button from "../../../../components/utility/button/Button";

class ActiveReviews extends Component {
    constructor() {
        super()
        this.state = {
            list: [],
            types: ['Outdoors', 'Fitness', 'Sports', 'Trips'],
            msg: "",
            showAlert: false,
        }
    }

    componentDidMount() {
        axios({
            method: "POST",
            url: `${window.apiHost}/active/getActiveReviews`,
            data: {
                email: this.props.login.email
            }
        }).then((reviewListFromDB) => {
            this.setState(({
                list: reviewListFromDB
            }))
        })
    }

    addReview = (activity, review, type, stars) =>{
        axios({
            method : "POST",
            url : `${window.apiHost}/active/addActiveReview/${activity}`,
            data : {
                email : this.props.login.email,
                activity,
                review,
                type,
                stars
            }
        }).then((responseFromDB)=>{
            // console.log(responseFromDB)
            this.setState({
                list : responseFromDB,
                msg : `Congrats! You've added a review for ${activity}!`,
                showAlert: true,
            })
        })
    }

    editReview = (dong) => {

    }

    removeReview = (activity)=>{
        axios({
            method : "POST",
            url: `${window.apiHost}/active/deleteActiveReview/${activity}`,
            data :{
                email : this.props.login.email
            }
        }).then((backEndResponse)=>{
            this.setState({
                list : backEndResponse
            })
        })
    }

    render() {

        const typeArray = this.state.types.map((type, i) => {
            return (<option key={i} value={type}>{type}</option>)
        })

        if (this.state.list.data !== undefined) {
            var activeReviews = this.state.list.data.map((review, i) => {
                return (
                    <div key={i} className="placeCard">
                        <div className="cardLeft">
                            <h4>{review.placename} – {review.stars} Stars</h4>
                            <div>
                                <p>{review.review}</p>
                            </div>
                        </div>
                        <div className="buttonContainer">
                            <Button className="shareButton">Share</Button>
                            <Button clicked={() => this.editReview(review.placename)} className="editButton">Edit</Button>
                            <Button clicked={() => this.removeReview(review.placename)} className="deleteButton">Remove</Button>
                        </div>

                    </div>
                )
            })
        }
        return (
            <div className="ActiveReviews">
                <h2>Reviews</h2>
                <div className="activeBody">
                    <div className="activeReviewsLeft">
                        <AddReviewForm
                            placeholder="Add your review here!"
                            addReview={this.addReview}
                            defaultType={"Choose a type!"}
                            types={typeArray}
                        />
                    </div>
                    <div className="activeReviewsRight">
                        <PlaceCards cards={activeReviews} />
                    </div>
                </div>
                <SweetAlert
                    show={this.state.showAlert}
                    title="Added to Faves"
                    text={this.state.msg}
                    onConfirm={() => this.setState({ showAlert: false })}
                />
                <AddReviewForm
                    placeholder="Add your active review here!"
                    defaultType= "Choose type!"
                    defaultStars = "How many stars?"
                    types={typeArray}
                    addReview={this.addReview}
                />
                <PlaceCards cards={activeReviews} />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        login: state.login
    }
}

export default connect(mapStateToProps, null)(ActiveReviews);