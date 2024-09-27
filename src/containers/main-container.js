import React from "react";
import { connect } from "redux-bundler-react";
import About from "./about/about-dialog";
import Navbar from "./navbar/navbar";
import Banner from "./banner";
import ModalContainer from "./modal-container/container";
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

// const mdTheme = createTheme({
//   palette: {
//     //mode: 'dark',
//   },
// });

class Main extends React.Component {
  componentDidMount() {
    const { aboutDontshow, doDialogOpen} = this.props;
    if (!aboutDontshow)
      doDialogOpen({ content: About, props: { scrollable: true }, size: "xl" });
  }
  render() {
    const { children, userDarkMode } = this.props;
   
    const mdTheme = createTheme({
      palette: {
        mode: userDarkMode ? 'dark' : 'light',
      },
    });

    return (
      <ThemeProvider theme={mdTheme}>
        
      <Box sx={{ display: 'flex', overflow:'hidden' }}>
        <Banner />
        <CssBaseline />
        <Navbar />        
        <Offset />
       
          <Toolbar />
          {children}
       
        <ModalContainer />
      </Box>
    </ThemeProvider>
      
    );
  }
}

export default connect(
  "doUpdateUrlWithHomepage",
  "doOrgsShouldLoadDetails",
  "selectIsLoggedIn",
  "selectUiSidebarShow",
  "selectUiSidebarMinimized",
  "selectUiBreakpoint",
  "doDialogOpen",
  "selectAboutDontshow",
  "selectUserDarkMode",
  Main
);

