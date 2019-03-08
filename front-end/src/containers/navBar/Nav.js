import React, {Component} from "react";
import "./Nav.css";
import {Link} from "react-router-dom";
import {connect} from "react-redux";

class Nav extends Component{
    // need logic to see if logged in, change route on left to user home
    // and on right, display categories and hamburger with profile/logout

    navRightToggle = (event)=>{
        event.preventDefault();
        if(document.querySelector(".nav-right-dropdown").style.display === "none"){
            document.querySelector(".nav-right-dropdown").style.display = "inline";
        } else {
            document.querySelector(".nav-right-dropdown").style.display = "none";
        }
    }
    
    render(){
        let navLeft;
        let navRight;
        if(this.props.login.length === 0){
            navLeft = <div className="logo"><Link to="/">Logo Placeholder</Link></div>;
            navRight = <div className="nav-right-login">
                            <div className="nav-right-login-links">
                                <div className="login-link"><Link to="/login">Login</Link></div>
                                <div className="register-link"><Link to="/register">Register</Link></div>
                            </div>
                            <div className="nav-toggle-icon-login" onClick={this.navRightToggle}>
                                <i className="fas fa-bars"></i>
                            </div>
                            <div className="nav-right-dropdown">
                                <div className="nav-right-dropdown-link">Account</div>
                                <div className="nav-right-dropdown-link">Log Out</div>
                            </div>
                        </div>;
            
        } else {
            navLeft = <div className="logo"><Link to="/userHome">Logo Placeholder</Link></div>;
            navRight = <div className="nav-right">
                            <div className="category-link"><Link to="/userHome/food">Food</Link></div>
                            <div className="category-link"><Link to="/">Active</Link></div>
                            <div className="category-link"><Link to="/userHome/culture">Culture</Link></div>
                            <div className="category-link"><Link to="/">Outdoor</Link></div>
                            <div className="nav-toggle-icon" onClick={this.navRightToggle}>
                                <i className="fas fa-bars"></i>
                            </div>
                            <div className="nav-right-dropdown">
                                <div className="nav-right-dropdown-link">Account</div>
                                <div className="nav-right-dropdown-link">Log Out</div>
                            </div>
                        </div>;
        }
        return(
            <div className="nav">
                {navLeft}
                {navRight}
            </div>
        )
    }
}

// mapstate to props to find out login status

function mapStateToProps(state){
    return{
        login : state.login
    }
}

export default connect(mapStateToProps, null)(Nav);