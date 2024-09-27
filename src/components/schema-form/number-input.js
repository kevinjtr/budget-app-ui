import React from "react";
import classnames from "classnames";

class NumberInput extends React.Component {
  constructor(props) {
    super(props);
    const val = Number(props.value);
    this.state = {
      property: props.property,
      value: isNaN(val) ? "" : val,
      valid: true,
      msg: ""
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
        value: newProps.value || ""
      });
    }
  }

  handleChange(e) {
    const val = e.currentTarget.value;
    this.setState(
      {
        value: val
      },
      this.validate
    );
  }

  isValid() {
    return this.state.valid;
  }

  validate() {
    const { required, schema, onChange } = this.props;
    const { title, maxLength, minimum, maximum } = schema;
    const { value } = this.state;

    let valid = true;
    let msg = "";

    const len = value.length || 0;

    if (required && !value) {
      valid = false;
      msg += `${title} is required`;
    }

    if (minimum && value && value < minimum) {
      valid = false;
      msg += `Value must be more than ${minimum}`;
    }

    if (maximum && value && value > maximum) {
      valid = false;
      msg += `Valuse must be less than ${maximum}`;
    }

    if (len > maxLength) {
      valid = false;
      msg += `Length of ${title} is limited to ${maxLength} characters`;
    }

    this.setState(
      {
        valid: valid,
        msg: msg
      },
      () => {
        if (onChange) onChange(this.state);
      }
    );
  }

  renderHelper() {
    const { msg } = this.state;
    const { schema } = this.props;
    const { description } = schema;
    if (msg) return <small className="invalid-feedback">{msg}</small>;
    if (!description) return null;
    return <small className="form-text text-muted">{description}</small>;
  }

  render() {
    const { valid, value } = this.state;
    const { schema, inline, displayOnly } = this.props;
    let { title, readOnly, minimum, maximum } = schema;

    if (displayOnly) readOnly = displayOnly;

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

    const validClass = classnames({
      "form-control": true,
      "is-invalid": !valid
    });

    return (
      <div className={groupClass}>
        <label className={labelClass}>{title}</label>
        <div className={inputWrapperClass}>
          <input
            value={value}
            onChange={this.handleChange}
            readOnly={readOnly}
            type="number"
            min={minimum}
            max={maximum}
            className={validClass}
            placeholder={!readOnly ? `Enter ${title}...` : ""}
          />
          {this.renderHelper()}
        </div>
      </div>
    );
  }
}

export default NumberInput;
