import React from "react";
import { connect } from "redux-bundler-react";
import MultiSelectInputDomainCheckbox from "./multi-select-input-checkbox";
import classnames from "classnames";
import { sortBy } from "lodash";

class MultiSelectInputDomain extends React.Component {
  constructor(props) {
    super(props);
    this.isValid = this.isValid.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.renderHelper = this.renderHelper.bind(this);
  }

  isValid() {
    return true;
  }

  onSelect(e) {
    const { onChange, property } = this.props;
    let newVal, valArray;
    if (e.checked) {
      // add the optionValue to the value string
      valArray = [e.inValue];
      valArray.push(e.optionValue);
      newVal = valArray.join(".");
    } else {
      // remove optionValue from the value string
      valArray = e.inValue.split(".");
      const idx = valArray.indexOf(e.optionValue);
      valArray.splice(idx, 1);
      newVal = valArray.join(".");
    }
    onChange({
      property: property,
      value: newVal
    });
  }

  renderHelper() {
    const { schema } = this.props;
    const { description } = schema;
    if (!description) return null;
    return <small className="form-text text-muted">{description}</small>;
  }

  render() {
    const { schema, domainsItems: domains, inline } = this.props;
    const domainGroup = schema.domain;
    const title = schema.title;

    const options = domains
      .filter(d => {
        return d.grp === domainGroup;
      })
      .map(d => {
        return {
          display_order: d.display_order,
          value: d.id,
          label: d.val,
          tooltip: d.tooltip || ""
        };
      });

    const groupClass = classnames({
      "form-group": true,
      row: inline
    });

    const labelClass = classnames({
      "col-sm-3": inline,
      "col-form-label": inline,
      "text-right": inline
    });

    const inputWrapperClass = classnames({
      "col-sm-9": inline
    });

    const sorted = sortBy(options, ["display_order"]);

    return (
      <div className={groupClass}>
        <label className={labelClass}>{title}</label>
        <div className={inputWrapperClass}>
          <div className="row ml-2">
            {sorted.map((option, i) => {
              return (
                <MultiSelectInputDomainCheckbox
                  key={i}
                  onSelect={this.onSelect}
                  {...this.props}
                  option={option}
                />
              );
            })}
          </div>
          {this.renderHelper()}
        </div>
      </div>
    );
  }
}

export default connect("selectDomainsItems", MultiSelectInputDomain);
