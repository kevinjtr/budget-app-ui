import React from "react";
import TextInput from "./text-input";
import EmailInput from "./text-email-input";
import PhoneInput from "./text-phone-input";
import TextArea from "./text-area";
import NumberInput from "./number-input";
import DateInput from "./date-input";
import SelectInputEnum from "./select-input-enum";
import SelectInputDomain from "./select-input-domain";
import CheckboxInput from "./checkbox-input";
import MultiSelectInputDomain from "./multi-select-input-domain";

class SchemaForm extends React.Component {
  constructor(props) {
    super(props);
    const { schema, data } = props;

    const state = {};

    Object.keys(schema.properties).forEach((key) => {
      if (schema.properties[key].type === "number") {
        state[key] = isNaN(Number(data[key])) ? null : data[key];
      } else if (schema.properties[key].type === "boolean") {
        state[key] = data[key] || false;
      } else {
        state[key] = data[key] || null;
      }
    });

    this.state = state;
    this.inputs = {};

    this.renderInputs = this.renderInputs.bind(this);
    this.serialize = this.serialize.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.isValid = this.isValid.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) this.reset(nextProps);
  }

  serialize() {
    return Object.assign({}, this.state);
  }

  isValid() {
    return Object.values(this.inputs).reduce((valid, input) => {
      if (!valid) return false;
      return input.hasOwnProperty("isValid") ? input.isValid() : true;
    }, true);
  }

  reset(nextProps) {
    const { schema, data } = nextProps;
    const state = {};
    this.inputs = {};
    Object.keys(schema.properties).forEach((key) => {
      if (schema.properties[key].type === "number") {
        state[key] = isNaN(Number(data[key])) ? null : data[key];
      } else if (schema.properties[key].type === "boolean") {
        state[key] = data[key] || false;
      } else if (
        schema.properties[key].type === "string" &&
        schema.properties[key].subtype === "domain"
      ) {
        state[key] = this.props.data[key];
      } else {
        state[key] = data[key] || null;
      }
    });
    this.setState(state);
  }

  handleChange(e) {
    this.setState({
      [e.property]: e.value,
    });
  }

  renderInputs() {
    const {
      schema,
      inline,
      displayOnly,
    } = this.props;
    const data = this.state;
    const { properties } = schema;

    const inputs = Object.keys(properties).map((key) => {
      const prop = properties[key];
      
      /**
       * Super hackity hack to make a control not show up unless another control
       * has a particular value
       *
       * Stringified function stored in prop.hidden has access to any variable in
       * this scope and should return true or false
       */

      if (prop.hidden && typeof prop.hidden === "string") {
        // eslint-disable-next-line
        const hide = eval(prop.hidden);
        if (hide) return null;
      }
      let filteredVal
      if(prop.filterKey) {
        const filterKey=prop.filterKey;
        const filterFrom =prop.filterFrom;
        filteredVal = data[filterFrom] ? data[filterFrom].value : null;
      }
      
      
      if (prop.hidden === true) return null;
      switch (prop.type) {
        case "string":
          switch (prop.subtype) {
            case "date":
              return (
                <DateInput
                  ref={(el) => {
                    this.inputs[key] = el;
                  }}
                  displayOnly={displayOnly}
                  inline={inline}
                  key={key}
                  property={key}
                  schema={prop}
                  value={data[key]}
                  required={schema.required.indexOf(key) !== -1}
                  onChange={this.handleChange}
                />
              );
            case "enum":
              return (
                <SelectInputEnum
                  ref={(el) => {
                    this.inputs[key] = el;
                  }}
                  displayOnly={displayOnly}
                  inline={inline}
                  key={key}
                  property={key}
                  schema={prop}
                  value={data[key]}
                  required={schema.required.indexOf(key) !== -1}
                  onChange={this.handleChange}
                />
              );
            case "domain":
              return (
                <SelectInputDomain
                  ref={(el) => {
                    this.inputs[key] = el;
                  }}
                  displayOnly={displayOnly}
                  inline={inline}
                  key={key}
                  property={key}
                  schema={prop}
                  filterKey={prop.filterKey}
                  filterValue={filteredVal}                  
                  value={data[key]}
                  required={schema.required.indexOf(key) !== -1}
                  onChange={this.handleChange}
                />
              );
            case "multi-domain":
              return (
                <MultiSelectInputDomain
                  ref={(el) => {
                    this.inputs[key] = el;
                  }}
                  displayOnly={displayOnly}
                  inline={inline}
                  key={key}
                  property={key}
                  schema={prop}
                  value={data[key]}
                  required={schema.required.indexOf(key) !== -1}
                  onChange={this.handleChange}
                />
              );
            case "long-string":
              return (
                <TextArea
                  ref={(el) => {
                    this.inputs[key] = el;
                  }}
                  displayOnly={displayOnly}
                  inline={inline}
                  key={key}
                  property={key}
                  schema={prop}
                  value={data[key]}
                  required={schema.required.indexOf(key) !== -1}
                  onChange={this.handleChange}
                />
              );
            case "email":
              return (
                <EmailInput
                  ref={(el) => {
                    this.inputs[key] = el;
                  }}
                  displayOnly={displayOnly}
                  inline={inline}
                  key={key}
                  property={key}
                  schema={prop}
                  value={data[key]}
                  required={schema.required.indexOf(key) !== -1}
                  onChange={this.handleChange}
                />
              );
            case "phone":
              return (
                <PhoneInput
                  ref={(el) => {
                    this.inputs[key] = el;
                  }}
                  displayOnly={displayOnly}
                  inline={inline}
                  key={key}
                  property={key}
                  schema={prop}
                  value={data[key]}
                  required={schema.required.indexOf(key) !== -1}
                  onChange={this.handleChange}
                />
              );
            default:
              return (
                <TextInput
                  ref={(el) => {
                    this.inputs[key] = el;
                  }}
                  displayOnly={displayOnly}
                  inline={inline}
                  key={key}
                  property={key}
                  schema={prop}
                  value={data[key]}
                  required={schema.required.indexOf(key) !== -1}
                  onChange={this.handleChange}
                />
              );
          }
        case "number":
          return (
            <NumberInput
              ref={(el) => {
                this.inputs[key] = el;
              }}
              displayOnly={displayOnly}
              inline={inline}
              key={key}
              property={key}
              schema={prop}
              value={data[key]}
              required={schema.required.indexOf(key) !== -1}
              onChange={this.handleChange}
            />
          );
        case "boolean":
          return (
            <CheckboxInput
              ref={(el) => {
                this.inputs[key] = el;
              }}
              displayOnly={displayOnly}
              inline={inline}
              key={key}
              property={key}
              schema={prop}
              value={data[key]}
              required={false}
              onChange={this.handleChange}
            />
          );
        default:
          return null;
      }
    });

    return inputs;
  }

  render() {
    return (
      <form>
        <fieldset style={{display:'flex', flexDirection:'column'}}>{this.renderInputs()}</fieldset>
      </form>
    );
  }
}

export default SchemaForm;
