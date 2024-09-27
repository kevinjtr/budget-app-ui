import React from "react";
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

const DrawerItemsClosed = function(props) {
  const { title, sx, idx } = props;

  return (
    <ListItem disablePadding >
      <ListItemButton key={`list-item-button-${idx}`} sx={{ flexDirection: 'column', ...sx}} disableRipple title={title} selected={props.selected} component="a" href={props.url}>
        <ListItemIcon sx={{justifyContent:'center'}}>
          {props.icon}
        </ListItemIcon>

        <ListItemText primaryTypographyProps={{fontSize: '9px'}}
          primary={title}
        />
      </ListItemButton>
    </ListItem>
  );
}

export default DrawerItemsClosed;
