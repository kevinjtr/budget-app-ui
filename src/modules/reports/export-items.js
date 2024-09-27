import React from 'react';
import Typography from '@mui/material/Typography';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import IconButton from '@mui/material/IconButton';
import streamSaver from 'streamsaver'
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios'
export default function ExportItem(props) {

  const [downloading, setDownloading] = React.useState(false);

  let onDownload = (item) =>{
    setDownloading(true)
    const fileEnding = item.type === 'org-report' ? '.pdf' : '.xlsx'
    const fileName = `${item.type}${fileEnding}`;
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
    <div  key={`file-${file?.id}`} style={{display:'flex', flexDirection:'row', justifyContent: "start",  alignItems:"center"}}>
                      
                      
                     
                         
                          <IconButton size="small" disabled={downloading} aria-label="Download Data" color="primary" onClick={()=>onDownload(file)}>
                          <FileDownloadIcon />
                        </IconButton>
                        <IconButton size="small" disabled={downloading} aria-label="Download Data" color="primary" onClick={()=>props.remove(file)}>
                          <ClearIcon />
                        </IconButton>
                        <Typography>{`Completed On ${file?.finishedOn}` }</Typography>
                          
                      
    </div>
  );
}
