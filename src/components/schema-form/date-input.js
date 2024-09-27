import React from "react";
import classnames from "classnames";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

class DateInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      property: props.property,
      value: props.value || "",
      valid: true,
      msg: "",
    };
    this.renderHelper = this.renderHelper.bind(this);
    this.validate = this.validate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.isValid = this.isValid.bind(this);
  }

  componentDidMount() {
    this.validate();
  }

  componentWillReceiveProps(newProps) {
    const { value, property } = this.state;
    if (newProps.value !== value || newProps.property !== property) {
      this.setState({
        property: newProps.property,
        value: newProps.value || "",
      });
    }
  }

  handleChange(e) {
    const val = e.toJSON();
    this.setState(
      {
        value: val,
      },
      this.validate
    );
  }

  isValid() {
    return this.state.valid;
  }

  validate() {
    const { required, schema, onChange } = this.props;
    const { title } = schema;
    const { value } = this.state;

    let valid = true;
    let msg = "";

    const len = value.length || 0;

    if (required && len < 1) {
      valid = false;
      msg += `${title} is required`;
    }

    this.setState(
      {
        valid: valid,
        msg: msg,
      },
      () => {
        if (onChange) onChange(this.state);
      }
    );
  }

  renderHelper() {
    const { msg } = this.state;
    if (!msg) return null;
    return <small className="invalid-feedback">{msg}</small>;
  }

  render() {
    const { valid, value } = this.state;
    const { schema, inline, displayOnly } = this.props;
    let { title, readOnly } = schema;

    if (displayOnly) readOnly = displayOnly;

    const groupClass = classnames({
      "form-group": true,
      row: inline,
    });

    const labelClass = classnames({
      "col-sm-3": inline,
      "col-form-label": inline,
      "text-right": inline,
    });

    const inputWrapperClass = classnames({
      "col-sm-9": inline,
    });

    const validClass = classnames({
      "form-control": true,
      "is-invalid": !valid,
    });

    const selectedDate = value ? new Date(value) : null;

    return (
      <div className={groupClass}>
        <label className={labelClass}>{title}</label>
        <div className={inputWrapperClass}>
          <DatePicker
            onChange={this.handleChange}
            selected={selectedDate}
            placeholderText={!readOnly ? `Enter ${title}...` : ""}
            className={validClass}
            readOnly={readOnly}
          />
          {this.renderHelper()}
        </div>
      </div>
    );
  }
}

export default DateInput;
