import React, { Component } from 'react';
import './App.css';
import Map from './Map'
import Search from './Search';
import { render } from '@testing-library/react';

class App extends Component  {

  constructor(props){
    super(props);
    this.state = {
      pos: {
        coords: { //south korea korail metro line 1 yongsan stn
          latitude: 37.5298911,
          longitude: 126.9642278
        }
      }
    };
  }



  render(){
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        pos : position
      });
    });

    return (
      <div className ='App'>
        <Search></Search>
        <Map position = {this.state.pos}></Map>
      </div>
    );
  }
}

export default App;
