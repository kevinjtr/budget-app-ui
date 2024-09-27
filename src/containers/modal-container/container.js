import React from "react";
import { connect } from "redux-bundler-react";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

class Container extends React.Component {
  render() {
    const {
      dialogContent,
      doDialogClose,
      dialogProps,
      dialogSize
    } = this.props;
    if (!dialogContent) return null;
    const Content = dialogContent;
    
    return (
      
      <Dialog
        open={dialogContent ? true : false}
        onClose={doDialogClose}
        fullWidth={dialogSize==='lg'}
        maxWidth={dialogSize}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        
        <DialogContent>
          
          <Content {...dialogProps} />
          
        </DialogContent>        
      </Dialog>
    );
  }
}

export default connect(
  "doDialogClose",
  "selectDialogContent",
  "selectDialogProps",
  "selectDialogSize",
  Container
);
