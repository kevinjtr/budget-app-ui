import { Dialog, DialogActions, DialogContent, DialogTitle, Typography,Select,MenuItem,TextField,IconButton,Grid,FormControl,InputLabel } from '@mui/material'
import {LoadingButton} from '@mui/lab';
import {useState, useEffect} from 'react'
import {Close as CloseIcon, Save as SaveIcon} from '@mui/icons-material';
import { green, grey } from '@mui/material/colors';
import find from 'lodash/find'
import {isUndefined, keys, get, entries, has, isEqual,isObjectLike} from 'lodash'
import { connect } from "redux-bundler-react";

function deepDiff(fromObject, toObject) {
  const changes = {};

  const buildPath = (path, obj, key) =>
      isUndefined(path) ? key : `${path}.${key}`;

  const walk = (fromObject, toObject, path) => {
      for (const key of keys(fromObject)) {
          const currentPath = buildPath(path, fromObject, key);
          if (!has(toObject, key)) {
              changes[currentPath] = {oldVal: get(fromObject, key)};
          }
      }

      for (const [key, newVal] of entries(toObject)) {
          const currentPath = buildPath(path, toObject, key);
          if (!has(fromObject, key)) {
              changes[currentPath] = {newVal};
          } else {
              const oldVal = get(fromObject, key);
              if (!isEqual(oldVal, newVal)) {
                  if (isObjectLike(newVal) && isObjectLike(oldVal)) {
                      walk(oldVal, newVal, currentPath);
                  } else {
                      changes[currentPath] = {oldVal, newVal, id:fromObject.id, field: currentPath, changeHistoryId: fromObject.change_history_id, table:'OrgFiscalYearSettings'};
                  }
              }
          }
      }
  };

  walk(fromObject, toObject);

  return changes;
}

const buttonClasses = {
    fab: {
      margin: 2,
    },
    absolute: {
      position: 'absolute',
      right: 3,
    },
    fabGreen: {
      color: "common.white",
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[600],
      },
      width:'20%',
    },
    fabGrey: {
      color: "common.white",
      backgroundColor: grey[500],
      '&:hover': {
        backgroundColor: grey[600],
      },
      width:'20%',
    },
}

const CellUpdateDialog = (props) => {
    const {doFySettingsBulkSave, fySettingsItems, fySettingsIsEditingId, fySettingsIsSaving, doFySettingsCancelEditing} = props
    const [submitButton, setSubmitButton] = useState(false);
    const data = find(fySettingsItems,{id: fySettingsIsEditingId})
    const [dataCopy, setDataCopy] = useState({...data})

    useEffect(() => {
      if(dataCopy.locked != data.locked){
        setSubmitButton(true)
      }else if(submitButton){
        setSubmitButton(false) 
      }

    },[dataCopy])

    const handleSubmit = async () => {
      const dif = deepDiff(data, dataCopy);
      doFySettingsBulkSave({table:'OrgFiscalYearSettings',changes:[dif]})
      setSubmitButton(false)
    }

    const handleChange = (event) => {
      setDataCopy(prev => ({...prev,[event.target.name]: event.target.value}))
    }

    return(
            <Dialog open onClose={() => doFySettingsCancelEditing()}>
                <DialogTitle>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <Typography variant="h6" component="div" style={{flexGrow:1,alignSelf:'center',fontSize:'1rem'}}>Fiscal Year</Typography>
                        <IconButton
          onClick={()=>doFySettingsCancelEditing()}
            sx={{
                alignSelf:'center',
              display: {
                '&:focus': {
                  outline: 'none',
                }
              }
            }}
          >
            <CloseIcon/>
          </IconButton>
   
                    </div>
                </DialogTitle>
                <DialogContent dividers>
                    <form style={{width:'100%'}} name="updateForm">
                    <Grid container spacing={3} sx={{flexGrow:1, flexDirection:"row"}}>
                      <Grid item sx={{width: 180}}>
                        <TextField disabled name="year" label="Year" variant="outlined" value={dataCopy.year} helperText="Not editable."/>
                      </Grid>
                      <Grid item sx={{width: 180}}>
                        <TextField disabled name="org_slug" label="Organization" variant="outlined" value={dataCopy.org_slug} helperText="Not editable."/>
                      </Grid>
                      <Grid item sx={{width: 180}}>

                      {(fySettingsIsEditingId && Object.keys(dataCopy).length > 0) && <FormControl fullWidth>
                        <InputLabel id="select-label">Status</InputLabel>
                        <Select
                        sx={{width:155}}
                        name="locked"
                        id="locked"
                        label="Status"
                        value={dataCopy.locked}
                        onChange={handleChange}
                        >
                          <MenuItem defaultValue value={0}>Open</MenuItem>
                          <MenuItem value={1}>Locked</MenuItem>
                        </Select>
                      </FormControl>}
                      </Grid>
                    </Grid>
                    <br/>
                    </form> 
                </DialogContent>
                <DialogActions>
                    <LoadingButton loading={fySettingsIsSaving} startIcon={<SaveIcon />} loadingPosition="start" onClick={handleSubmit} sx={ submitButton ? buttonClasses.fabGreen : buttonClasses.fabGrey} {...((!submitButton || fySettingsIsSaving) && {disabled:true})}> 
                    Save
                    </LoadingButton>
                </DialogActions>   
            </Dialog>
    )
}

export default connect(
  "doFySettingsBulkSave",
  "selectFySettingsIsSaving",
  "selectFySettingsIsLoading",
  "selectFySettingsIsLoading",
  "doFySettingsCancelEditing",
  "selectFySettingsItems",
  "selectFySettingsIsEditingId",
  CellUpdateDialog)