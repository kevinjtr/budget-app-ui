import React from "react";
import SchemaForm from "../../components/schema-form/schema-form";
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { connect } from "redux-bundler-react";
import { profile } from "../../models";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edipi: props.tokenEdipi
    };
    
  }

 
  
  render() {
    return (
      <Grid item >
        <Paper sx={{ minWidth: 500, margin:'1em'}}  >
          <div style={{ margin:'1em'}}>
            <Typography variant="h1" color="primary.main" gutterBottom>
            User Not Found
          </Typography>
          <Typography variant="h6" cgutterBottom>
            Your user Information Could not be match to any possible accounts. 
            
          </Typography>
          <Typography variant="h6" cgutterBottom>
            Please contact SAJ-Budget-Tool@usace.army.mil in order to sign up.
          </Typography>
          
         
          
           </div>
          
        
         
        
      </Paper>
      </Grid>
      
    
    );
  }
}

export default connect(
  "doProfileSave",
  "selectTokenEdipi",
  Register
);
