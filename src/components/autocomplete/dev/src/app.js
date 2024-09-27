import React from 'react';
import ReactDOM from 'react-dom';
import AutoComplete from '../../src/AutoComplete';
import states from './states.json';

const testUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=ecc56266919940168c8a358d56ce3068&q={query}';

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      rightCol: null
    }
  }

  onSelect = (item) => {
    console.log(item)
    //window.open(item.web_url, '_blank');
  }

  onSelectState = (item) => {
    console.log(item);
  }

  openAlert = (val) => {
    let txt = val;
    if(typeof txt !== 'string'){
      txt = JSON.stringify(txt, null, 2);
    }
    window.alert(txt);
  }

  clearAutocomplete = (e) => {
    const which = e.target.dataset.which;
    if(which === 'remote') this.remoteAutocomplete.clear();
    if(which === 'remote2') this.remoteAutocomplete2.clear();
    if(which === 'local') this.localAutocomplete.clear();
    if(which === 'localString') this.localStringAutocomplete.clear();
  }

  showValue = (e) => {
    const which = e.target.dataset.which;
    if(which === 'remote') this.openAlert(this.remoteAutocomplete.value());
    if(which === 'remote2') this.openAlert(this.remoteAutocomplete2.value());
    if(which === 'local') this.openAlert(this.localAutocomplete.value());
    if(which === 'localString') this.openAlert(this.localStringAutocomplete.value());
  }
  
  parser = (data) => {
    console.log(data)
    if(data.response && data.response.docs){
      return data.response.docs;
    }else{
      return [];
    }
  }

  componentDidMount(){
    this.setState({
      rightCol: this.rightCol
    })
  }

  render(){
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6">

            <h2>Column class="col-md-6"></h2>
          
            <h3>Autocomplete wired into a remote search service</h3>
            <div className="btn-group">
              <button onClick={ this.clearAutocomplete } data-which="remote" className="btn btn-primary">Clear</button>
              <button onClick={ this.showValue } data-which="remote" className="btn btn-warning">Show me the input value</button>
            </div>
            <AutoComplete 
              ref = { (el) => { this.remoteAutocomplete = el } }
              apiParser={ this.parser }
              caseSensitive={ false }
              displayKey={ 'headline.main' }
              onSelect={ this.onSelect }
              placeholder={ 'find articles here' }
              url={ testUrl }
            />

            <h3>Autocomplete wired into a remote search service, rendering to a different place</h3>
            <div className="btn-group">
              <button onClick={ this.clearAutocomplete } data-which="remote2" className="btn btn-primary">Clear</button>
              <button onClick={ this.showValue } data-which="remote2" className="btn btn-warning">Show me the input value</button>
            </div>
            <AutoComplete 
              ref = { (el) => { this.remoteAutocomplete2 = el } }
              apiParser={ this.parser }
              caseSensitive={ false }
              displayKey={ 'headline.main' }
              listTargetEl={ this.state.rightCol }
              onSelect={ this.onSelect }
              placeholder={ 'find articles here' }
              url={ testUrl }
            />

            <h3>Autocomplete using local object data</h3>
            <div className="btn-group">
              <button onClick={ this.clearAutocomplete } data-which="local" className="btn btn-primary">Clear</button>
              <button onClick={ this.showValue } data-which="local" className="btn btn-warning">Show me the input value</button>
            </div>
            <AutoComplete 
              ref = { (el) => { this.localAutocomplete = el } }
              caseSensitive={ false }
              displayKey={ 'name' }
              items={ states }
              onSelect={ this.onSelectState }
              placeholder={ 'search for state name' }
            />

            <h3>Autocomplete using local list of strings</h3>
            <div className="btn-group">
              <button onClick={ this.clearAutocomplete } data-which="localString" className="btn btn-primary">Clear</button>
              <button onClick={ this.showValue } data-which="localString" className="btn btn-warning">Show me the input value</button>
            </div>
            <AutoComplete 
              ref = { (el) => { this.localStringAutocomplete = el } }
              caseSensitive={ false }
              items={ states.map((state) => { return state.name }) }
              onSelect={ this.onSelectState }
              placeholder={ 'search for state name' }
            />

          </div>

          <div className="col-md-6">
            <h2>Column class="col-md-6"></h2>
            <div ref={(el) => {this.rightCol = el}}></div>
          </div>

        </div>
        <div style={{position:'absolute',bottom:0}}>
          <p>Testing page { new Date().toLocaleTimeString() }</p>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));