import React from "react";
import { connect } from "redux-bundler-react";
import Loader from "../../components/loader";
import Login from "./login";
import Register from "./register";
import UserNotFound from "./user-not-found";
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

class AuthProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      img: `${props.publicFolder}bg${Math.ceil(Math.random() * 9)}.jfif`
    };
  }

  renderLoader() {
    const { isLoggedIn, profileIsLoading, authIsLoggingIn, authIsLookingForToken } = this.props;
    if ((!profileIsLoading || !isLoggedIn) && !authIsLoggingIn && !authIsLookingForToken) return null;
    return <Loader opt="dissolve-cube" />;
  }

  renderLogin() {
    const { isLoggedIn, authIsLoggingIn, authIsLookingForToken } = this.props;
    if (isLoggedIn || authIsLoggingIn || authIsLookingForToken) return null;
    return <Login />;
  }

  renderRegister() {
    const { profileIsLoading, isLoggedIn, profileFetchCount, profileItems, authIsLoggingIn, authIsLookingForToken, profileUserNotFound, isTokenFound, profileIsRegistered} = this.props;
    if (!isLoggedIn || authIsLoggingIn || authIsLookingForToken) return null; // added authIsLoggingIn to prevent UserNotFound from displaying during browser refresh -JF
    if (profileIsLoading) return null;
    if (profileFetchCount === 1 && !profileItems.length) return <Register />;
    if(profileUserNotFound)
      return (<UserNotFound />);
  }

  renderWithBackground() {
    const { img } = this.state;
    const bgStyle = { backgroundImage: `url(${img})` };
    return (
      <div
        className="app cover bg-image flex-row align-items-center"
        style={bgStyle}
      >
        <Container style={{height:'100%'}}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            style={{height:'100%'}}
            >

              {this.renderLogin()}
              {this.renderRegister()}
              {this.renderLoader()}
            
         </Grid>
          
        </Container>
      </div>
    );
  }

  render() {
    const { isLoggedIn, profileIsLoading, profileItems, children } = this.props;
    if (isLoggedIn) {
      if (profileIsLoading || !profileItems.length) {
        return this.renderWithBackground();
      }
      return <>{children}</>;
    } else {
      return this.renderWithBackground();
    }
  }
}

export default connect(
  "selectIsLoggedIn",
  "selectPublicFolder",
  "selectProfileIsLoading",
  "selectProfileFetchCount",
  "selectProfileItems",
  "selectAuthIsLoggingIn",
  "selectAuthIsLookingForToken",
  "selectIsTokenFound",
  "selectProfileIsRegistered",
  "selectProfileUserNotFound",
  AuthProvider
);
