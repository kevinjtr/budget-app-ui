import React from "react";
import { connect } from "redux-bundler-react";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import HistoryButton from '../history';
import { styled } from '@mui/material/styles';

// const StyledTextField = styled(TextField)(({ theme }) => ({
//     '.MuiFormHelperText-root': {
//         color: `${theme.palette.warning.main} !important`
//     }
// }));
  

class TextFieldComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        forceShow: false
      };

      this.handleDoubleClick = this.handleDoubleClick.bind(this);
    }

    handleDoubleClick() {
        this.setState({forceShow: true})
    }

    
    render() {
        const {editing, onChange, value, label, name, componentName, table, attr, changeHistoryId, hide, type} = this.props;
        if(!this.state.forceShow && !editing && (value?.length > 500)){
            return (
                <div style={{display: "flex", justifyContent: "start",  alignItems:"flex-end"}}>
                    
                    <HistoryButton label={label} table={table} type={type} attr={attr} componentName={componentName} changeHistoryId={changeHistoryId} />      
                    <InputLabel htmlFor={`text-field-${componentName}-${name}`} style={{fontWeight:"500"}}>{label} </InputLabel>
                    <TextField helperText={`Double click '${label.replace(':','').trim()}' text to expand`} onDoubleClick={this.handleDoubleClick} id={`text-field-${componentName}-${name}`} multiline onChange={onChange} name={name} disabled={!editing} label="" variant="standard" style={{marginLeft:'1em', flexGrow:2}} value={ `${value.substring(0,100).trim()}...`||""} />                
                </div> 
            )
        }

        // <Accordion elevation={0} key={'all_notes_accordion'} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        //     <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
        //         <Typography>{hide ? 'Click to ' : 'Click to hide notes'}</Typography>
        //     </AccordionSummary>
        //     <AccordionDetails>
                
        //     </AccordionDetails>
        // </Accordion>
        return (
            <div style={{display: "flex", justifyContent: "start",  alignItems:"flex-end"}}>
                
                 <HistoryButton table={table} attr={attr} componentName={componentName} changeHistoryId={changeHistoryId} />      
                <InputLabel htmlFor={`text-field-${componentName}-${name}`} style={{fontWeight:"500"}}>{label} </InputLabel>
                <TextField id={`text-field-${componentName}-${name}`} multiline onChange={onChange} name={name} disabled={!editing} label="" variant="standard" style={{marginLeft:'1em', flexGrow:2}} value={value ||""} />                
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

