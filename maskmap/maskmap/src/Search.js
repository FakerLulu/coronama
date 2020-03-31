import React, { Component } from 'react'
import './Search.css'

class Search extends Component  {
    
    render(){
        return(
        <div className="search">
            <input id="address" type="text" placeholder="검색할 주소" />
            <input id="submit" type="button" value="주소 검색" />
            <div id="result">

            </div>
        </div>
        );
    };
}

export default Search 