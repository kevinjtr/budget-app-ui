import React from 'react';

class AutoCompleteList extends React.Component {
  render(){
    const {
      defaultListStyle,
      displayItems,
      displayKey,
      focusedItem,
      formatItemText,
      itemComponent,
      itemClass,
      itemStyle,
      listClass,
      listStyle,
      onItemSelect,
      setFocusedItem
    } = this.props;
    const Comp = itemComponent;

    return (
      <ul className={listClass} style={{ ...defaultListStyle, ...listStyle }}>
        {displayItems.map((item, i) => {
          return (
            <Comp
              key={i}
              idx={i}
              displayKey={displayKey}
              displayTxt={formatItemText(item)}
              focused={i === focusedItem}
              item={item}
              itemClass={itemClass}
              itemStyle={itemStyle}
              onSelect={onItemSelect}
              setFocus={setFocusedItem}
            />
          );
        })}
      </ul>
    );
  }
}

export default AutoCompleteList;