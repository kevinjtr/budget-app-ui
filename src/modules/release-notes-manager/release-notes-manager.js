import React, { useState } from "react";
import { connect } from "redux-bundler-react";
import VersionList from "./version-list";
import Editor from "./editor";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

export default connect(
  "selectReleaseNotesItems",
  ({ releaseNotesItems: notes }) => {
    const [active, setActive] = useState(null);
    return (
      <div style={{position:"absolute", top:"70px", right:0, left:0, bottom:0}}>
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
            
        <div style={{display:'flex', flexDirection:"row"}}>
          <VersionList notes={notes} active={active} setActive={setActive} />
         
          <div className="col-9">
            {active ? (
              <Editor active={active} setActive={setActive} />
            ) : (
              <div>Choose a version to edit</div>
            )}
          </div>
        
          
        </div>
        </Box>
       
       
        
        
      </div>
      
    );
  }
);
