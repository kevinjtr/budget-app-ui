import React from "react";
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

export default ({ notes, active, setActive }) => {
  const handleNew = () => {
    setActive({
      id: null,
      version: "",
      note: ""
    });
  };

  const handleSelect = note => {
    setActive(note);
  };

  notes.sort((a, b) => {
    if (a.version > b.version) return -1;
    if (a.version < b.version) return 1;
    return 0;
  });

  return (
    <div>
      <div className="clearfix mb-3">
        
          <Button className="btn btn-primary" onClick={handleNew}>
            <i className="mdi mdi-note-plus pr-1"></i>New
          </Button>
        
      </div>
      <List >
        {notes.map((note, i) => {
          return (
            <ListItemButton
              onClick={() => {
                handleSelect(note);
              }}
              key={note.version + i}
              className={`list-group-item ${note === active ? "active" : ""}`}
            >
              <ListItemText primary={note.version} />
            </ListItemButton>
          );
        })}
      </List>
    </div>
  );
};
