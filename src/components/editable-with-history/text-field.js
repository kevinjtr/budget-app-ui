import React from "react";
import { connect } from "redux-bundler-react";

import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import HistoryButton from '../history';

class TextFieldComponent extends React.Component {
    constructor(props) {
      super(props);
   
      
    }
  
   
    render() {
    
        const {editing, onChange, value, label, name, componentName, table, attr, changeHistoryId} = this.props;        
     
        return (
            <div style={{display: "flex", justifyContent: "start",  alignItems:"flex-end"}}>
                
                 <HistoryButton label={label} table={table} attr={attr} componentName={componentName} changeHistoryId={changeHistoryId} />    
                <InputLabel htmlFor={`text-field-${componentName}-${name}`} style={{fontWeight:"500", flex:1, flexWrap:'wrap'}}>{label} </InputLabel>
                <TextField id={`text-field-${componentName}-${name}`} onChange={onChange} name={name} disabled={!editing} label="" variant="standard" style={{marginLeft:'1em', flex:2}} value={value ||""} />                
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

