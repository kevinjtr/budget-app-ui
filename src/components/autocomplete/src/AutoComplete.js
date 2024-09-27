import React from "react";
import ReactDOM from "react-dom";
import AutoCompleteList from "./AutoCompleteList";
import AutoCompleteListItem from "./AutoCompleteListItem";
import PropTypes from "prop-types";
import xhr from "xhr";
import _ from "lodash";

class AutoComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultInputStyle: {
        width: "100%"
      },
      defaultListStyle: {
        margin: 0,
        padding: 0,
        listStyle: "none",
        position: "absolute",
        maxHeight: "400px",
        width: "100%",
        zIndex: 9999
      },
      defaultWrapperStyle: {
        position: "relative"
      },
      displayItems: [],
      isOpen: true,
      focusedItem: 0,
      txt: "",
      value: null
    };
    this.throttledUpdate = _.throttle(this.updateList, 300, {
      leading: false,
      trailing: true
    });
    this.listRoot = null;
  }

  clear = () => {
    this.setState({ txt: "", displayItems: [], value: null });
  };

  componentDidUpdate(prevProps, prevState) {
    const { listTargetEl } = this.props;
    if (listTargetEl) this.renderListSomewhereElse();
  }

  formatItemText = item => {
    const { displayKey } = this.props;
    let displayTxt = item.toString();
    if (displayKey) {
      const displayKeyItems = displayKey.split(".");
      let val = item[displayKeyItems[0]];
      for (var i = 1; i < displayKeyItems.length; i++) {
        val = val[displayKeyItems[i]];
      }
      displayTxt = val.toString();
    }
    return displayTxt;
  };

  getDisplayItems = () => {
    const { url } = this.props;
    if (url) {
      this.getItemsFromUrl();
      return [];
    } else {
      return this.getItemsFromFilter();
    }
  };

  getItemsFromFilter = () => {
    const { caseSensitive, displayKey, items } = this.props;
    const { txt } = this.state;
    const flags = caseSensitive ? "gu" : "igu";
    return items.filter(item => {
      let testString = displayKey ? item[displayKey] : item;
      const tester = new RegExp(escape(txt), flags);
      return tester.exec(testString);
    });
  };

  getItemsFromUrl = () => {
    const { apiParser, url } = this.props;
    const { txt } = this.state;
    const formattedUrl = url.replace(/{query}/gi, txt);
    this.remoteRequest = xhr.get(
      {
        url: formattedUrl
      },
      (err, response, body) => {
        // test for error and do something
        if (err || response.statusCode !== 200) {
        } else {
          const data = JSON.parse(body);
          this.setState({
            displayItems: apiParser(data)
          });
        }
      }
    );
  };

  handleKeyUp = e => {
    const { displayItems, focusedItem } = this.state;
    e.preventDefault();
    const { keyCode } = e;
    if (keyCode === 40) return this.moveFocusDown();
    if (keyCode === 38) return this.moveFocusUp();
    if (keyCode === 13 && focusedItem >= 0)
      return this.onItemSelect(displayItems[focusedItem]);
  };

  moveFocusDown = () => {
    const { displayItems, focusedItem } = this.state;
    let newfocusedItem = focusedItem;
    if (focusedItem < displayItems.length - 1) {
      this.setState({
        focusedItem: ++newfocusedItem
      });
    }
  };

  moveFocusUp = () => {
    const { focusedItem } = this.state;
    let newfocusedItem = focusedItem;
    if (focusedItem > 0) {
      this.setState({
        focusedItem: --newfocusedItem
      });
    }
  };

  onItemSelect = item => {
    const { onSelect } = this.props;
    this.setState(
      {
        txt: this.formatItemText(item),
        displayItems: [],
        value: item
      },
      () => {
        onSelect(item);
      }
    );
  };

  setFocusedItem = idx => {
    this.setState({
      focusedItem: idx
    });
  };

  updateList = () => {
    if (this.remoteRequest) this.remoteRequest.abort();
    const { minCharCount } = this.props;
    const { txt } = this.state;
    if (txt.length >= minCharCount) {
      this.setState({
        displayItems: this.getDisplayItems(),
        focusedItem: 0,
        value: null
      });
    } else {
      this.setState({
        displayItems: [],
        focusedItem: 0,
        value: null
      });
    }
  };

  updateTxt = e => {
    const val = e.target.value;
    this.setState(
      {
        txt: val,
        displayItems: []
      },
      this.throttledUpdate
    );
  };

  // set up the normal input read api here
  value = () => {
    return this.state.value;
  };

  renderListSomewhereElse = () => {
    const { listTargetEl } = this.props;
    ReactDOM.render(
      <AutoCompleteList
        formatItemText={this.formatItemText}
        onItemSelect={this.onItemSelect}
        setFocusedItem={this.setFocusedItem}
        {...this.props}
        {...this.state}
      />,
      listTargetEl
    );
  };

  renderList = () => {
    return (
      <AutoCompleteList
        formatItemText={this.formatItemText}
        onItemSelect={this.onItemSelect}
        setFocusedItem={this.setFocusedItem}
        {...this.props}
        {...this.state}
      />
    );
  };

  render() {
    const {
      inputClass,
      inputStyle,
      listTargetEl,
      placeholder,
      wrapperClass,
      wrapperStyle
    } = this.props;
    const { txt, defaultInputStyle, defaultWrapperStyle } = this.state;
    const List = !listTargetEl ? this.renderList() : null;
    return (
      <div
        className={wrapperClass}
        style={{ ...defaultWrapperStyle, ...wrapperStyle }}
        onKeyUp={this.handleKeyUp}
      >
        <input
          type="text"
          value={txt}
          onChange={this.updateTxt}
          className={inputClass}
          style={{ ...defaultInputStyle, ...inputStyle }}
          placeholder={placeholder}
        />
        {List}
      </div>
    );
  }
}

AutoComplete.propTypes = {
  apiParser: PropTypes.func,
  caseSensitive: PropTypes.bool,
  displayKey: PropTypes.string,
  inputClass: PropTypes.string,
  inputStyle: PropTypes.object,
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.object, PropTypes.string])
  ),
  itemClass: PropTypes.string,
  itemComponent: PropTypes.func,
  itemProps: PropTypes.object,
  itemStyle: PropTypes.object,
  listClass: PropTypes.string,
  listStyle: PropTypes.object,
  listTargetEl: PropTypes.any,
  minCharCount: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  url: PropTypes.string,
  wrapperClass: PropTypes.string,
  wrapperStyle: PropTypes.object
};

AutoComplete.defaultProps = {
  caseSensitive: false,
  displayKey: null,
  inputClass: "form-control",
  inputStyle: null,
  itemComponent: AutoCompleteListItem,
  itemClass: "list-group-item",
  listClass: "list-group",
  minCharCount: 3,
  placeholder: "Search...",
  url: ""
};

export { AutoComplete, AutoCompleteList, AutoCompleteListItem };
export default AutoComplete;
