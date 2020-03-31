import React, { Component } from 'react';
import './App.css';
import Map from './Map'
import Search from './Search';

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

    return (
      <div className ='App'>
        <Search></Search>
        <Map position = {this.state.pos}
        getPos={
          function(position){
            this.setState({
              pos : position
            })
          }.bind(this)
        }
        ></Map>
      </div>
    );
  }
}

export default App;
