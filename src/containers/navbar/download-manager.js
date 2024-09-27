import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import DownloadItem from './download-item';

export default function DownLoadManger(props) {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [viewed, setViewed] = React.useState(false);
  

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setViewed(true)
  };
  React.useEffect(
    () => {
      setViewed(false)      
    },
    [props.items],
  );
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
        <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
            onClick={handleClick}
            >
            <Badge badgeContent={viewed ? 0 : props.items.length} color="error">
                <FileDownloadIcon />
            </Badge>
        </IconButton>
      
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >   
          {props.items && props.items.length>0 ? (
              props.items.map((file)=>{
                  return(<DownloadItem key={`downloaditem-${file.id}`} file={file} token={props.token} remove={props.remove}/>)
              })
          ):<Typography key={`file`} sx={{ p: 2 }}>No Reports Available</Typography>}
        
      </Popover>
    </div>
  );
}
