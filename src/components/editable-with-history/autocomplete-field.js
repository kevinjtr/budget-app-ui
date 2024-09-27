import React from "react";
import { connect } from "redux-bundler-react";

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';

import CircularProgress from '@mui/material/CircularProgress';


import HistoryButton from '../history';


class TextFieldComponent extends React.Component {
    constructor(props) {
      super(props);
      
     
      
    }

    render() {
    
        const {editing, handleChange, value, label, name, componentName, options,table, attr, changeHistoryId, loading, useHistory} = this.props; 
        
        const defaultProps = {      
            getOptionLabel: (option) => (option ? option.label:""), 
            isOptionEqualToValue:(option, value) => {
              if(value) {
                return option.value === value.value; 
              }else{
                return false
              }                     
            }      
          };
        
        return (
            <div style={{display: "flex", justifyContent: "start",  alignItems:"flex-end"}}>
                {useHistory !== false ? <HistoryButton label={label} table={table} attr={attr} componentName={componentName} changeHistoryId={changeHistoryId} />: null} 
                <InputLabel htmlFor={`auto-complete-${componentName}-${name}`} sx={{fontWeight:"500"}}>{label} </InputLabel>
                <Autocomplete
                      {...defaultProps}
                      id={`auto-complete-${componentName}-${name}`}
                      onChange={handleChange}
                      options={options}
                      value={value}
                      sx={(theme) => ({
                        ...theme.typography.body,
                        width: 300,
                        color: theme.palette.primary.main,
                        padding:".5em 1em .5em 0",
                        marginLeft:'6em', 
                        flex:2
                      })}
                      autoComplete
                      disabled={!editing}      
                      renderInput={(params) => (
                        <TextField {
                            ...params                            
                        } InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                     {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                      {params.InputProps.endAdornment}
                                      </React.Fragment>
                            )
                        }} label={''} variant="standard" />
                      )}
                    />             
            </div> 
        )
    }
}

export default connect(
    "selectTokenRaw",
    "selectApiRoot",
    "selectOrgsByRoute",
    TextFieldComponent
);

