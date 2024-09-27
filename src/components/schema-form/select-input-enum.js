import React from "react";
import Select from "./select-input";

class SelectInputEnum extends React.Component {
  constructor(props) {
    super(props);
    this.isValid = this.isValid.bind(this);
  }
  isValid() {
    return this.select.isValid();
  }
  render() {
    const { schema } = this.props;
    const options = schema.enum.map(opt => {
      return {
        value: opt,
        label: opt
      };
    });
    return (
      <Select
        ref={el => {
          this.select = el;
        }}
        {...this.props}
        options={options}
      />
    );
  }
}

export default SelectInputEnum;
