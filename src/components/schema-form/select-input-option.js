import React from "react";
import MenuItem from '@mui/material/MenuItem';

class SelectOption extends React.Component {
  render() {
    const { opt } = this.props;
    const { value, label } = opt;
    return <MenuItem value={value}>{label}</MenuItem>;
  }
}

export default SelectOption;
