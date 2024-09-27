import React from "react";
import { connect } from "redux-bundler-react";

import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';

import HistoryButton from '../history';



class TextFieldComponent extends React.Component {
    constructor(props) {
      super(props);
     
      
     
      
    }

    
    render() {
    
        const {editing, onChange, value, label, name, componentName, table, attr, changeHistoryId, type} = this.props;        
     
        return (
            <div style={{display: "flex", justifyContent: "start",  alignItems:"flex-end"}}>
                
                 <HistoryButton label={label} table={table} type={type} attr={attr} componentName={componentName} changeHistoryId={changeHistoryId} />       
                <InputLabel htmlFor={`checkbox-field-${componentName}-${name}`} style={{fontWeight:"500", flex:2, flexWrap:'wrap'}}>{label} </InputLabel>
                <Checkbox id={`checkbox-field-${componentName}-${name}`}  onChange={onChange} disabled={!editing} checked={value===1 ? true : false} name={name} sx={{marginLeft:'6em'}}/>               
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

