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
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const { doProfileSave, doLogin } = this.props;
    if (this.form.isValid()) {
      const data = this.form.serialize();
      doProfileSave({data:data, register: true});
      //doLogin()
    }
  }
  
  render() {
    return (
      <Grid item >
        <Paper sx={{ minWidth: 500, margin:'1em'}}  >
          <div style={{ margin:'1em'}}>
            <Typography variant="h1" color="primary.main" gutterBottom>
            Register
          </Typography>
          <Typography variant="h6" color="text.main" gutterBottom>
            Create your account
          </Typography>
          <SchemaForm
            ref={el => {
              this.form = el;
            }}
            inline={true}
            displayOnly={false}
            schema={profile}
            data={this.state}
          />
          <div style={{marginTop:'0.5em', alignItems:'center',display: 'flex', alignContent: 'center',justifyContent:'flex-end'}}>
          <Button onClick={this.handleSubmit} >
              Create Account
          </Button>
          </div>
          
           </div>
          
        
         
        
      </Paper>
      </Grid>
      
    
    );
  }
}

export default connect(
  "doProfileSave",
  "selectTokenEdipi",
  "doLogin",
  Register
);
