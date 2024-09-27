import React from "react";

class MultiSelectInputCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const { option, value, onSelect } = this.props;
    const checked = e.currentTarget.checked;
    onSelect({
      checked: checked,
      inValue: value,
      optionValue: option.value
    });
  }

  render() {
    const { schema, displayOnly, option, value } = this.props;
    const checked = value ? value.indexOf(option.value) !== -1 : false;

    let { readOnly } = schema;

    if (displayOnly) readOnly = displayOnly;

    return (
      <div className="form-check checkbox col-sm-4">
        <label className="form-check-label" title={option.tooltip}>
          <input
            checked={checked}
            onChange={this.handleChange}
            readOnly={readOnly}
            disabled={readOnly}
            type="checkbox"
            className="form-check-input"
          />
          {option.label}
          {option.tooltip ? (
            <i className="mdi mdi-information-outline text-info ml-1"></i>
          ) : null}
        </label>
      </div>
    );
  }
}

export default MultiSelectInputCheckbox;
