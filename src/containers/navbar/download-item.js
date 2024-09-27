import React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import streamSaver from 'streamsaver'
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios'

export default function DownLoadManager(props) {

  const [downloading, setDownloading] = React.useState(false);

  let onDownload = (item) => {
    setDownloading(true)
    const fileName = `${item.type}.xlsx`;
  axios({
      method: 'get',
      url: `${process.env.REACT_APP_API_ROOT}/downloads/${item.id}`,
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${props.token}`,
      },
      })
      .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          setDownloading(false)
      })
      .catch((error) => {
        setDownloading(false)
          //alert(error);
      })
  }

const file =props.file;
  return (
    <div  key={`file-${file.id}`} style={{display:'flex', flexDirection:'row'}}>
                      <Typography key={`file-${file.id}-name`} sx={{ p: 2 }}>{file.type}</Typography>
                      
                      {file.status==='complete' ? (
                          <>
                          <IconButton size="small" disabled={downloading} aria-label="Download Data" color="primary" onClick={()=>onDownload(file)}>
                          <FileDownloadIcon />
                        </IconButton>
                        <IconButton size="small" disabled={downloading} aria-label="Download Data" color="primary" onClick={()=>props.remove(file)}>
                          <ClearIcon />
                        </IconButton>
                          </>
                      ) : <Typography key={`file-${file.id}-status`} sx={{ p: 2 }}>{file.status}</Typography>}
    </div>
  );
}
