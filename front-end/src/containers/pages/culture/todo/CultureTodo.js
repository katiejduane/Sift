import React, { Component } from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';

import AddForm from '../../../Forms/AddForm';
import PlaceCards from '../../../../components/Lists/PlaceCards/PlaceCards';
import Button from '../../../../components/utility/button/Button';
import Filter from '../../../../components/utility/filterDropDown/Filter';
import '../../todo.css';


class CultureToDo extends Component {
    constructor() {
        super()
        this.state = {
            list: [],
            types: ['Music', 'Art', 'Theater', 'Learning'],
            msg: "",
            showAlert: false,
            swTitle: "Added to Faves!"
        }
    }

    componentDidMount() {
        axios({
            method: 'POST',
            url: `${window.apiHost}/culture/getCultureList`,
            data: {
                email: this.props.login.email
            }
        }).then((cultureListFromDB) => {
            this.setState({
                list: cultureListFromDB
            })
        })
    }

    addNewPlace = (place, type, text) => {
        axios({
            method: 'POST',
            url: `${window.apiHost}/culture/addCulture`,
            data: {
                placename: place,
                type: type,
                note: text,
                email: this.props.login.email
            }
        }).then((backEndResponse) => {
            if (backEndResponse.data.length === 0) {
                this.setState({
                    showAlert: true,
                    swTitle: "Whoops!",
                    msg: "This is already in one of your lists!"
                })
            } else {
                this.setState({
                    list: backEndResponse,
                })
            }
        })
    }

    addToFavorites = (placename) => {
        axios({
            method: "POST",
            url: `${window.apiHost}/culture/addFave/${placename}`,
            data: {
                email: this.props.login.email
            }
        }).then((backEndResponse) => {
            this.setState({
                list: backEndResponse,
                msg: "Success! Added to favorites",
                showAlert: true
            })
        })
    }

    removePlace = (placename) => {
        axios({
            method: "POST",
            url: `${window.apiHost}/culture/deletePlace/${placename}`,
            data: {
                email: this.props.login.email
            }
        }).then((backEndResponse) => {
            this.setState({
                list: backEndResponse
            })
        })
    }

    filterResults = (filter) => {
        axios({
            method: 'POST',
            url: `${window.apiHost}/culture/filter/${filter}`,
            data: {
                type: filter,
                email: this.props.login.email
            }
        }).then((backEndResponse) => {
            this.setState({
                list: backEndResponse
            })
        })
    }

    clearFilter = () => {
        axios({
            method: 'POST',
            url: `${window.apiHost}/culture/getCultureList`,
            data: {
                email: this.props.login.email
            }
        }).then((cultureListFromDB) => {
            this.setState({
                list: cultureListFromDB
            })
        })
    }

    render() {
        let category = "culture";
        let section = "todo";
        if (this.state.list.data !== undefined) {
            document.querySelector(".placeCards").style.backgroundColor = "#ffa094";
            var cultureToDo = this.state.list.data.map((culture, i) => {
                return (
                    <div key={i} className="placeCard">
                        <div className="cardLeft">
                            <h4>{culture.placename}</h4>
                            <div>
                                <p>{culture.note}</p>
                            </div>
                        </div>
                        <div className="buttonContainer">
                            <Button clicked={() => this.addToFavorites(culture.placename)} className="faveButton">Fave</Button>
                            <Button className="editButton"><Link to={"/userHome/"+ category + "/edit/" + section + "/" + culture.placename} >Edit</Link></Button>
                            <Button clicked={() => this.removePlace(culture.placename)} className="deleteButton">Remove</Button>
                        </div>
                    </div>
                )
            })
        }

        const typeArray = this.state.types.map((type, i)=>{
            return (<option key={i} value={type}>{type}</option>)
        })

        const filterArray = this.state.types.map((filter, i)=>{
            return(<option key={i} value={filter}>{filter}</option>)
        })
        

        if (this.props.login.length === 0) {
            return (
                <Redirect to="/login" />
            )
        } else {
            return (
                <div className="ToDo">
                    <h2>Expanding horizons...</h2>
                    <SweetAlert
                        show={this.state.showAlert}
                        title={this.state.swTitle}
                        text={this.state.msg}
                        onConfirm={() => this.setState({ showAlert: false })}
                    />
                    <div className="todoBody">
                        <div className="todoLeft">
                            <AddForm
                                title="Add to your list!"
                                addNewPlace={this.addNewPlace}
                                placeholder="Add new place to visit..."
                                textType="Add note..."
                                defaultType="Choose type!" 
                                types={typeArray}
                            />
                        </div>
                        <div className="todoRight">
                            <Filter 
                                defaultFilter="Filter by type"
                                defaultValue={this.state.types[0]}
                                filters={filterArray}
                                filterResults={this.filterResults}
                                clearFilter={this.clearFilter}
                            />
                            <PlaceCards cards={cultureToDo}/>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        login: state.login
    }
}

export default connect(mapStateToProps, null)(CultureToDo);