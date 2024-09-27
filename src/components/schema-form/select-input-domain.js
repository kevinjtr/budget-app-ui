import React from "react";
import { connect } from "redux-bundler-react";
import Select from "./select-input";
import memoize from "memoize-one";

class SelectInputDomain extends React.Component {
  constructor(props) {
    super(props);
    this.isValid = this.isValid.bind(this);
    
  }
  // static getDerivedStateFromProps(newProps, state) {
  //   // Any time the current user changes,
  //   // Reset any parts of state that are tied to that user.
  //   // In this simple example, that's just the email.
  //   if (newProps.filterValue && newProps.filterValue  !== state.filterValue) {
  //     return {
  //       property: newProps.property,
  //       value: newProps.value || null
  //     };
      
  //   }
  //   return null;
  // }
  isValid() {
    return this.select.isValid();
  }

  render() {
    const { schema, domainsItems: domains, filterKey, filterValue, value:val } = this.props;
    
    const domainGroup = schema.domain;
    
    const options = domains
      .filter(d => {
        return d.GRP === domainGroup;
      })
      .filter(d => {
        if(filterKey && filterValue) {
          return d[filterKey] === filterValue;
        }else{
          return true;
        }        
      })
      .map(d => {
        return {
          value: d.ID,
          label: d.ALIAS ? `${d.NAME} (${d.ALIAS})` : d.ALIAS
        };
      });
    options.sort((a, b) => {
      let s = 0;
      if (a.label === b.label) return s;
      s = a.label > b.label ? 1 : -1;
      return s;
    });
    let objVal=val
    if(val && typeof val === 'object') {
      objVal=val;
    }else if(val) {
      const objNew= options.filter(d => {
          return d.value === val;     
      })
      if(objNew && objNew.length>0) {
        objVal=objNew[0]
      }else{
        objVal=null;
      }
    }
    return (
      <Select
        ref={el => {
          this.select = el;
        }}
        {...this.props}
        value={objVal}
        options={options}
      />
    );
  }
}

export default connect("selectDomainsItems", SelectInputDomain);
