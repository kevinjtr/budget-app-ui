import React from "react";
import { connect } from "redux-bundler-react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin() {
    const { doLogin } = this.props;
    doLogin();
  }

  render() {
    return (
      <Grid item style={{caretColor: 'transparent'}}>
        <Card sx={{ minWidth: 500}}  style={{ backgroundColor: "rgba(255,255,255,0.8)" }}>
        <CardContent>
          <Typography variant="h1" color="primary.main" gutterBottom>
            EBA
          </Typography>
          
          <Typography variant="subtitle1">
            Engineering Budget Application
           
          </Typography>
        </CardContent>
        <CardActions disableSpacing style={{justifyContent:'end'}}>
          <Button style={{float:'right'}} onClick={this.handleLogin} size="small">Sign In to your account</Button>
        </CardActions>
      </Card>
      </Grid>
    );
  }
}

export default connect(
  "doLogin",
  Login
);
