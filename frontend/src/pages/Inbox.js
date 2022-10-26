import React, { Component } from 'react'
import { renderMatches } from 'react-router-dom'
import "./inbox.css";

export default class Inbox extends Component {
    render() {
        return (
        
        <div className="container">
            <form>
                {/*Start*/}
                <div className="singleItem">
                    <label htmlFor="name">Firstname</label>
                    <input type="text"
                     name="name"
                     className="name"
                     placeholder="Firstame..."></input>
                </div>
                {/*end*/}

                {/*Start*/}
                <div className="singleItem">
                    <label htmlFor="lastname">Lastname</label>
                    <input type="text"
                     name="lastname"
                     className="lastname"
                     placeholder="Lastname..."></input>
                </div>
                {/*end*/}

                {/*Start*/}
                <div className="singleItem">
                    <label htmlFor="email">Email</label>
                    <input type="text"
                     name="email"
                     className="name"
                     placeholder="Email..."></input>
                </div>
                {/*end*/}

                {/*Start*/}
                <div className="teaxtAreasingleItem">
                <label htmlFor="message">Message</label>
                    <textarea name ="" 
                    id="" 
                    cols="30" 
                    rows = "5"
                    placeholder="Message..."></textarea>
                </div>
                {/*end*/}
                <div className="msg"></div>
                <div className="btn">
                    <button type="submit" >Submit</button>
                </div>
            </form>
    
        </div>
        )
    }
}