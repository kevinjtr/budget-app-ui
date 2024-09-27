import React from "react";
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

const DrawerItemsOpen = function(props) {
    
    return (
            <ListItem disablePadding> 
                <ListItemButton title={props.title} disableRipple selected={props.selected} component="a" href={props.url}>
                    <ListItemIcon>
                        {props.icon}
                    </ListItemIcon>

                    <ListItemText
                        primary={props.title}
                    />
                </ListItemButton >
            </ListItem>
    );
  }
  
  export default DrawerItemsOpen