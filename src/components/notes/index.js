import React, { useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import RoleFilter from '../../containers/context-providers/role-filter';
import LoadingButton from '@mui/lab/LoadingButton';

import { Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ConfirmDialog = ({value, openDeleteDialog, handleDeleteDialogClose, handleDelete, isSaving}) => {
  return (
    <Dialog onClose={handleDeleteDialogClose} open={openDeleteDialog} maxWidth="sm" fullWidth>
      <DialogTitle>Confirm the action</DialogTitle>
      <Box position="absolute" top={0} right={0}>
        <IconButton onClick={handleDeleteDialogClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent>
        <Typography>The selected Note will be deleted. This action cannot be Undo.</Typography>
      </DialogContent>
      <DialogActions>
        <Button disabled={isSaving} onClick={handleDeleteDialogClose} color={"error"} variant="outlined">
          Cancel
        </Button>
        <LoadingButton
          onClick={()=>handleDelete(value)}
          color="error"
          variant="contained"
          loading={isSaving}
          loadingPosition="start"
          startIcon={<SaveIcon />}
        >
          Confirm
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};


// notes={projectNotesItems}
// submit={doProjectNotesSave}
// isUpdateModalOpen={projectNotesIsUpdateModalOpen}
// isSaving={projectNotesIsSaving}
// startEditing={doProjectNotesStartEditing}
// editingId={projectNotesIsEditingId}
// cancelEditing={doProjectNotesCancelEditing}
// delete={doProjectNotesDelete}
// commentListId={projectByRoute?.commentListId}
// poc={profileActive}

export default function Notes(props) {
  const {notes, submit, notesDelete, commentListId, poc, startEditing, cancelEditing, isSaving, isUpdateModalOpen, editingId} = props;
  const [title, setTitle] = React.useState('');
  const [note, setNote] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  const handleDeleteDialogClickOpen = (value) => {
    startEditing(value)
  };

  const handleDeleteDialogClose = () => {
    cancelEditing()
  };

  const handleChange = (panel) => (event, isExpanded) => {
      setExpanded(isExpanded);
  };

  const handleClickOpen = () => {
    setOpen(true);
    setExpanded(true);
  };
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };
  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };
  const handleClose = () => {
    setTitle('')
    setNote('')
    setOpen(false);
  };
  const handleSubmit = () => {
    submit({'title':title, 'commentValue': note, 'commentListId': commentListId, 'dateAdded':new Date().toISOString().split('T')[0], 'pocName':`${poc.lastName}, ${poc.firstName}`, 'pocId':poc.id});
    handleClose();
  };

  const handleDelete = (id) => {
    notesDelete({'id':id})  
  };
  
  
  return (
    <>
    <div>
    <Typography variant="h6" sx={{py:1}} >
        Notes
    </Typography>
    {/* <RoleFilter allowRoles={[`APP.ADMIN`, `:ORG.ADMIN`,`:ORG.TECH_LEAD`,`:ORG.MEMBER`]}> */}
      <Button onClick={handleClickOpen} sx={{mb:1}}>
        Create Note
      </Button>
    {/* </RoleFilter> */}
    </div>
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Note</DialogTitle>
        <DialogContent>
          
          <TextField
            error={title===''}
            autoFocus
            margin="dense"
            id="name"
            label="Title (short description)"
            fullWidth
            value={title}
            onChange={handleTitleChange}
            variant="standard"
            inputProps={{ maxLength: 128 }}
          />
          <TextField
            error={note===''}
            multiline
            margin="dense"
            id="note"
            label="Note"
            value={note}
            onChange={handleNoteChange}
            fullWidth
            variant="standard"
            inputProps={{ maxLength: 2000 }}
            helperText={`${note.length} of 2000 maximum characters.`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} >Cancel</Button>
          <Button onClick={handleSubmit} disabled={title==='' || note ==='' }>Submit</Button>
        </DialogActions>
    </Dialog>
    <ConfirmDialog value={editingId} openDeleteDialog={isUpdateModalOpen} handleDeleteDialogClose={handleDeleteDialogClose} handleDelete={handleDelete} isSaving={isSaving}/>
      <Accordion key={'all_notes_accordion'} expanded={expanded} onChange={handleChange('panel1')}>
        <AccordionSummary  sx={{flexDirection: 'row-reverse'}} aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ExpandMoreIcon />}>
            <Typography>{!expanded ? 'Click to view notes' : 'Click to hide notes'}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {notes?.length ? notes.map((value, idx)=> {
              return(
                  <Accordion key={`notes_${idx}`}>        
                      <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      >
                      
                      <div style={{display:'flex', flexDirection:'row',  gap: "0px 20px"}}>
                          <Typography>{`Title: ${value.title}`}</Typography>
                          <Typography>{`Date Added: ${value.dateAdded}`}</Typography>
                          <Typography>{`Added By: ${value.pocName}`}</Typography>
                      </div>
                      
                      </AccordionSummary>
                      <AccordionDetails>
                      
                        <div style={{display:'flex', flexDirection:'row',  gap: "0px 20px"}}>
                            {(value.pocId===poc.id) ? (<IconButton title="Delete Note" aria-label="delete" size="small" onClick={()=>handleDeleteDialogClickOpen(value)}><DeleteIcon /></IconButton>): null}
                            <Typography>
                            {value.commentValue}
                            </Typography>
                            
                        </div>
                      </AccordionDetails>
                  </Accordion>
              )
          }) : <Typography>No notes were found.</Typography>}
        </AccordionDetails>
      </Accordion>
    </>
  );
}
