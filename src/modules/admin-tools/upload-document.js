import React, {useState, useMemo} from 'react'
import {Box, Typography, TextField, Stack} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import {Select} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import clsx from 'clsx'
import { blue, grey } from '@mui/material/colors';
import LoadingButton from '@mui/lab/LoadingButton';
import {useDropzone} from 'react-dropzone';
import DeleteIcon from '@mui/icons-material/Delete';
import debounce from 'lodash/debounce'
import { connect } from 'redux-bundler-react';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  };
  
const activeStyle = {
borderColor: '#2196f3'
};

const acceptStyle = {
borderColor: '#00e676'
};

const rejectStyle = {
borderColor: '#ff1744'
};

const thumbsContainer = {
display: 'flex',
flexDirection: 'row',
flexWrap: 'wrap',
marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

const plusButtonClasses = {
    fabBlue: {
      color: 'common.white',
      backgroundColor: blue[500],
      '&:hover': {
        backgroundColor: blue[600],
      },
      height:'50px',
      width:'50%',
      marginTop: '20px',
      marginBottom:'20px',
    },
    fabGrey: {
      color: 'common.white',
      backgroundColor: grey[500],
      '&:hover': {
        backgroundColor: grey[600],
      },
      height:'50px',
      width:'50%',
      marginTop: '20px',
      marginBottom:'20px'
    },
}

function UploadDocumentModal({userUploadingDoc, doAdminDocUpload, userUploadingComplete, fyItems, orgsItems}) {
    
    //hooks declaration
    const [files, setFiles] = React.useState([])
    const [select1, setSelect1] = useState(''); 
    const [select2, setSelect2] = useState(''); 
    const [select3, setSelect3] = useState(''); 
    const [year, setYear] = useState(''); 

    //Functions declaration
    const formUpload = () => {
        doAdminDocUpload(files,{select1: select1, select2:select2, select3:select3, year: year})
    }

    //Events declaration
    const UploadModal = () => {

        const returnUploadDropZone = () => {

            const thumbs = files.map(file => (
                <Box style={thumb} key={'thumb-' + file.name}>
                    <Box style={thumbInner}>
                    <FileCopyIcon style={img}/>
                    </Box>
                </Box>
                ));

            const description = files.map((file) => <li key={file.path}>{file.path}
              <IconButton style={{color:'#e04436'}} size="small" title="Remove Attachment" aria-label="delete" disabled={userUploadingDoc} onClick={() => remove(file)}>
                <DeleteIcon />
            </IconButton>
              </li>);
            
            return(
                <Box className="container">
                    <Box {...getRootProps({className: 'dropzone',style})}>
                        <input {...getInputProps()} />
                        <Typography>Drag 'n' drop a file here, or click to select a file</Typography>
                        <Typography>(Only *.xlsx files are accepted)</Typography>
                    </Box>
                    <aside style={thumbsContainer}>
                        {thumbs}
                    </aside>
                    <aside style={thumbsContainer}>
                        <ul>
                        {description}
                        </ul>
                    </aside>
                </Box>
            )
        }

        const {getRootProps, getInputProps, isDragActive} = useDropzone({
            accept: {'application/vnd.ms-excel': ['.xlsx']},
            onDrop: acceptedFiles => {
                setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
                })));
            },
            maxFiles: 1,
        });

        const remove = file => {
            const newFiles = [...files];     // make a var for the new array
            newFiles.splice(file, 1);        // remove the file from the array
            setFiles(newFiles);              // update the state
        };
            
        const style = useMemo(() => ({
            ...baseStyle,
            ...(isDragActive ? activeStyle : {}),
            // ...(isDragAccept ? acceptStyle : {}),
            // ...(isDragReject ? rejectStyle : {})
            }), [
            isDragActive,
            // isDragReject,
            // isDragAccept
        ]);

        const checkSelection1 = () => {
            return select1 == -1 ? year : select1
        }

        return(
            <Box sx={{py: 2}}>
                {returnUploadDropZone()}
                <div style={{textAlign:'center'}}>
                    <LoadingButton 
                    title="upload"
                    loadingPosition="start"
                    startIcon={<FileUploadIcon />} 
                    variant="outlined"
                    onClick={() => formUpload()} 
                    styles={ userUploadingDoc ? clsx(plusButtonClasses.fabBlue) : clsx(plusButtonClasses.fabGrey)} 
                    disabled={!(files?.length > 0 && checkSelection1() && select2 && select3) || userUploadingDoc}
                    loading={userUploadingDoc}
                    >
                    Upload
                    </LoadingButton>
                </div>
                </Box>
        )
    }

    const handleSelect1Change = (e) => {
        setSelect2('')
        setSelect1(e.target.value)
    }

    const fyMenuItems = fyItems.map((item) => 
        <MenuItem id={`fy-item-${item.id}`} key={`fy-item-${item.id}`} value={item.year}>{item.year}</MenuItem>
    )

    const orgsMenuItems = orgsItems.map((item) => 
        <MenuItem id={`org-item-${item.id}`} key={`org-item-${item.id}`} value={item.id}>{item.alias}</MenuItem>
    )

    return(
        userUploadingComplete ? <Typography>Upload Complete</Typography> :
         <Box>
             <Stack justifyContent="center" alignItems="center">
            <FormControl sx={{width: 500, mb: 2}}>
                <InputLabel id="demo-simple-select-label-0">Fiscal Year</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select-0"
                    value={select1}
                    label="Fiscal Year"
                    onChange={handleSelect1Change}
                >
                    <MenuItem value={-1}>NEW</MenuItem>
                    {fyMenuItems} 
                </Select>
                </FormControl>

                {select1 === -1 && <TextField
                    sx={{ mb: 2, width: 500 }}
                    id="outlined-number"
                    label="Number"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                />}

            
                <FormControl sx={{width: 500, mb: 2}}>
                <InputLabel id="demo-simple-select-label-1">Upload Type</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select-1"
                    value={select2}
                    label="Upload Type"
                    onChange={(e) => setSelect2(e.target.value)}
                >
                    <MenuItem value={'INITIAL'}>{select1 === -1 ? 'INITIAL' : 'ADD NEW PROJECTS/ACTIVITIES'}</MenuItem>
                    {select1 != -1 && <MenuItem value={'R1B'}>R1B</MenuItem>}
                </Select>
                </FormControl>

                <FormControl sx={{width: 500, mb: 2}}>
                <InputLabel id="demo-simple-select-label-2">Organization</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select-2"
                    value={select3}
                    label="Upload Type"
                    onChange={(e) => setSelect3(e.target.value)}
                >
                    {orgsMenuItems}
                </Select>
                </FormControl>
            </Stack>
            <UploadModal/>
        </Box>
    )
}

export default connect(
    'selectFyItems',
    'selectUserUploadingDoc',
    'doAdminDocUpload',
    'selectUserUploadingComplete',
    'selectOrgsItems',
UploadDocumentModal);  