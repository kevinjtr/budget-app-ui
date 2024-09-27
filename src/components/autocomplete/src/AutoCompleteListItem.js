import React from 'react';

class AutoCompleteItem extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      defaultListItemStyle: {
        backgroundColor: '#ffffff',
        width: '100%'
      }
    }
  }

  onMouseOver = () => {
    const { idx, setFocus } = this.props;
    setFocus(idx); 
  }

  onSelect = () => {
    const { item } = this.props;
    this.props.onSelect(item);
  }

  render(){
    const { displayTxt, focused, itemClass, itemStyle } = this.props;
    const { defaultListItemStyle } = this.state;
    const updatedListItemStyle = { ...defaultListItemStyle, ...itemStyle };
    if(focused) updatedListItemStyle.backgroundColor = '#eaeaea';
    return (
      <li className={ itemClass } title={ displayTxt } style={ updatedListItemStyle } onClick={ this.onSelect } onMouseOver={ this.onMouseOver }>
        { displayTxt }
      </li>
    )
  }
}

export default AutoCompleteItem;