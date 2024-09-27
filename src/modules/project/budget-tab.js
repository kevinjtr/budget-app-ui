import React, { useState, useCallback, useEffect} from 'react';

import {Button, Chip, Box, Typography, Stack} from '@mui/material';
import omit from 'lodash/omit';
import { DataGrid } from "@mui/x-data-grid";
import LockIcon from '@mui/icons-material/Lock';
import RoleFilter from '../../containers/context-providers/role-filter';
import { valuesIn } from 'lodash';
import SaveIcon from '@mui/icons-material/Save';

export default function BasicEditingGrid(props) {
  const [hasChanges, setHasChanges] = useState(false);
  const [cellActive, setCellActive] = useState(false);
  const [editing, toggleEditing] = useState(false);
  const [editedValues, addValues] = useState({});
  const [checkChanges, addChanges] = useState({})

  
  const handleBtn = action => e => {
    e.preventDefault();
    toggleEditing(!editing,props[action](props.type, editedValues));
    addValues({})
  };
 
  const handleAddValues =(newRow, oldRow, fieldChanged)=> {
    let obj={};
    const keyName = `${fieldChanged}_${newRow[props.idField]}`;
    const val =newRow[fieldChanged];
    if(editedValues[keyName]){      
      if(val && val !== editedValues[keyName].oldValue) {
        obj =editedValues[keyName];
        obj.newValue=val;
      }else{
        addValues(omit(editedValues,[keyName]));
      }     
    }else{
      obj.id = newRow[props.idField];
      obj.field = fieldChanged
      obj.oldValue = oldRow[fieldChanged];
      obj.newValue = val;
      obj.changeHistoryId= props.type==='labor' ? newRow.labor_change_history_id: newRow.non_labor_change_history_id;
    }
    if(Object.keys(obj).length>0) {
      addValues(state => ({
        ...state,
        [keyName]: obj
      }));
      setHasChanges(true)
    }else{
      setHasChanges(false)
    }    
    addChanges({})
  }
  const handleCellEditStart = (params, event) => {
    
    if(!editing) {
      event.defaultMuiPrevented = true;
    }else{   
      setCellActive(true)
    }    
  };

  useEffect(
    () => {
      if(checkChanges?.newRow) {
        handleAddValues(checkChanges.newRow, checkChanges.oldRow, checkChanges.fieldChanged)
      }           
    },
    [checkChanges],
  );
  const processRowUpdate = useCallback(
    (newRow, oldRow) =>
      new Promise((resolve, reject) => {
        let rowChanged =false
        let fieldChanged =''
        const editableFields = props.editableFields;
        
        for(let i=0;i<editableFields.length && !rowChanged;i++) {
          const currField =editableFields[i].field;          
          if(newRow[currField] !==oldRow[currField]) {
            fieldChanged =currField;
            rowChanged=true
          }
        }        
        if(rowChanged===true) {          
          addChanges({newRow, oldRow, fieldChanged})
          setCellActive(false)
          resolve(newRow)
        }else{
          setCellActive(false)
          resolve(oldRow)
        }     
      }),
    [],
  );

  // const getRowSpacing = React.useCallback((params) => {

  //   if(params.indexRelativeToCurrentPage != 0){
  //     return {
  //       top: 1,
  //       borderBottom: '1px dashed #3a88ff !important',
  //     };
      

    
  // }, []);


  return (
    <div style={{ display: 'flex'}}>
      <div style={{ flexGrow: 1 }}>
        <div>
            <RoleFilter allowRoles={[`APP.ADMIN`, `:ORG.ADMIN`,`:ORG.TECH_LEAD`,`:ORG.MEMBER`]}>
              {editing ? (
                <Stack direction="row" sx={{alignItems: 'center', py: 1.5}} gap={1.5}>
                  <Button color="success" variant="outlined" onClick={handleBtn('cancelEditing')}>Cancel</Button>
                  <Button color="success" variant="contained" startIcon={<SaveIcon />} disabled={cellActive || !hasChanges } onClick={handleBtn('stopEditing')}>Save</Button>
                  <Typography sx={{px:3, color: 'warning.main', fontSize: '.8rem'}}>Double click the highlited cells to edit the data.</Typography>
                </Stack>
                ) : (
                  <Stack direction="row" sx={{alignItems: 'center', py: 1.5}} gap={1.5}>
                    {!props.disableEdit ? <Button variant="contained" onClick={handleBtn('startEditing')} >Edit</Button> : 
                      <>
                        <RoleFilter allowRoles={[`APP.ADMIN`, `:ORG.ADMIN`]}>
                        <Button variant="contained" onClick={handleBtn('startEditing')}>Edit</Button>
                        </RoleFilter>
                        <Chip icon={<LockIcon />} sx={{ml:1}} label="LOCKED" variant="outlined" />
                      </>
                    }
                  </Stack>
                )}
            </RoleFilter>
          {/* {Boolean(props.disableEdit) && } */}
        </div>       
      <Box sx={{ 
          width: '100%',
          '& .editing': {
            border: '1px dashed #3a88ff',
            borderBottom: '1px dashed #3a88ff !important',
          }
        }}>
        <DataGrid
          autoHeight
          //getRowSpacing={getRowSpacing}
          density='compact'
          disableSelectionOnClick={ true }
          columnVisibilityModel={props.hiddenColumns}
          rows={props.rows}
          columns={props.columns}
          onCellEditStart={handleCellEditStart}
          processRowUpdate={processRowUpdate}
          experimentalFeatures={{ newEditingApi: true }}
          hideFooter={true}
          getCellClassName={(params) => params.isEditable && editing ? 'editing' : ''}
        />
      </Box>
      </div>
      </div>
  );
}