import AutoComplete from './AutoComplete';
import React from 'react';
import ReactDOM from 'react-dom';

class TestPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      arrayOfStrings:[],
      arrayOfObjects:[]
    }
  }
  render(){
    return (
      <div>
        <AutoComplete 
          
        />
      </div>
    )
  }
}

ReactDOM.render()
