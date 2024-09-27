import React from "react";
import { connect } from "redux-bundler-react";
// import Drawer from './drawer/old-drawer';
import Drawer from "./drawer/drawer";
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';




const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

export default connect(
  "selectRoute",
  "selectUiSidebarShow",
  ({ route: Route}) => {
    
    return (
      <div style={{position:"absolute", top:"70px", right:0, left:0, bottom:0}}>
        
        <div style={{display:'flex', flexDirection:"row"}}>
          <Drawer />
          
          
            <Box
              component="main"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
                padding:'2em 2em 6em 2em'
              }}
            >
            <Route />
            </Box>
          
        </div>
        
       
       
        
        
      </div>
    );
  }
);

