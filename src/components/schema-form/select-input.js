import React from "react";
import classnames from "classnames";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import { find } from "lodash";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';

class SelectInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      property: props.property,
      valid: true,
      value: props.value,
      filterValue: props.filterValue,
      msg: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.isValid = this.isValid.bind(this);
    this.validate = this.validate.bind(this);
    this.renderHelper = this.renderHelper.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value && newProps.value !== this.state.value) {
      this.setState(
        {
          property: newProps.property,
          value: newProps.value || null
        },
        this.validate
      );
    
    }
    if (newProps.filterValue && newProps.filterValue !== this.state.filterValue) {
      this.setState(
        {
          property: newProps.property,
          value: newProps.value || null,
          filterValue:newProps.filterValue || null,
        },
        this.validate
      );
    }
  }
  // static getDerivedStateFromProps(newProps, state) {
  //   // Any time the current user changes,
  //   // Reset any parts of state that are tied to that user.
  //   // In this simple example, that's just the email.
  //   if (newProps.value && newProps.value  !== state.value) {
  //     return {
  //       property: newProps.property,
  //       value: newProps.value || null
  //     };
      
  //   }
  //   return null;
  // }
  componentDidMount() {
    this.validate();
  }

  handleChange (event, newValue){
    const val = newValue;
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
    const { title } = schema;
    const { value } = this.state;
    let valid = true;
    let msg = "";


    if (required && !value) {
      valid = false;
      msg += `${title} is required`;
    }

    this.setState(
      {
        valid: valid,
        msg: msg
      },
      () => {
        let updatedState = Object.assign({}, this.state);
        if (updatedState.value === "") {
          updatedState.value = null;
        }
        if (onChange) onChange(updatedState);
      }
    );
  }

  renderHelper() {
    const { msg } = this.state;
    const { schema } = this.props;
    const { description } = schema;
    return (
      <>
        {msg ? (
          <FormHelperText id="component-error-text">{msg}</FormHelperText>
        ) : null}
        {description ? (
          <FormHelperText id="component-error-text">{description}</FormHelperText>
        ) : null}
      </>
    );
  }

  render() {
    const { valid, value } = this.state;
    const { schema, inline, displayOnly, options } = this.props;
    let { title, readOnly } = schema;
    if (displayOnly) readOnly = displayOnly;
    // const option = find(options, { value: value });
    
    // const readOnlyValue = option ? option.label : "";

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
    const defaultProps = {
      options:options,
      getOptionLabel: (option) => (option ? option.label:""), 
      isOptionEqualToValue:(option, value) => {
        if(value) {
          return option.value === value.value; 
        }else{
          return false
        }                     
      },  
      disabled:readOnly,
      
    };
    return (
      <FormControl error={!valid} disabled={readOnly} variant="standard">
        <Autocomplete
          {...defaultProps}
          id="auto-complete"
          onChange={this.handleChange}
          value={value}
          sx={(theme) => ({
            ...theme.typography.body,
            color: !valid ? theme.palette.error.main:theme.palette.primary.main,
          })}
          autoComplete        
          renderInput={(params) => (
            <TextField error={!valid} {...params} label={title} variant="standard" />
          )}
        />
        {this.renderHelper()}
      </FormControl>
     
    );
  }
}

export default SelectInput;
