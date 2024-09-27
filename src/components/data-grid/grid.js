import React, { useState, useCallback, useEffect} from 'react';
import { Button, Stack } from '@mui/material';
import omit from 'lodash/omit';
import { DataGrid } from "@mui/x-data-grid";
import SaveIcon from '@mui/icons-material/Save';

export default function BasicEditingGrid(props) {
  const [pageSize, setPageSize] = React.useState(100);
  const [hasChanges, setHasChanges] = useState(false);
  const [checkChanges, addChanges] = useState({})
  const [cellActive, setCellActive] = useState(false);
  const [editing, toggleEditing] = React.useState(false);
  const [editedValues, addValues] = React.useState({});
  
  const handleBtn = action => e => {
    e.preventDefault();
    toggleEditing(!editing,props[action](props.type, editedValues));
    addValues({})
  };

  const handleAddValues =(newRow, oldRow, fieldChanged)=> {
    let obj={};
    let keyName = `${fieldChanged}_${newRow[props.idField]}`;
    if(props.internalId) {
      keyName = `${fieldChanged}_${newRow[props.internalId]}`;
    }
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
      if(props.tableField) {
        obj.table_name = newRow[props.tableField];
      }
      if(props.internalId) {
        obj.internalId = newRow[props.internalId];
      }
      obj.field = fieldChanged
      obj.oldValue = oldRow[fieldChanged];
      obj.newValue = val;
      obj.changeHistoryId=newRow.changeHistoryId;
    }
    if(Object.keys(obj).length>0) {
      addValues(state => ({
        ...state,
        [keyName]: obj
      }));
          
      setHasChanges(true)
    }else{
      if(Object.keys(editedValues).length>0) {
        setHasChanges(true)
      }else{
        setHasChanges(false)
      }
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
        if(rowChanged) {          
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
  return (
    <div style={{ display: 'flex'}}>
                  <div style={{ flexGrow: 1 }}>
      <Stack sx={{py: 1.5}} direction="row" spacing={1.5}>
        {props.editableFields ? (editing ? (<>
        <Button color="success" variant="outlined" onClick={handleBtn('cancelEditing')}>Cancel</Button>
        <Button startIcon={<SaveIcon />} color="success" variant="contained" disabled={cellActive || !hasChanges } onClick={handleBtn('stopEditing')}>Save</Button>
      </>) : (
        <>
        <Button variant="contained" onClick={handleBtn('startEditing')}>Edit</Button>
      </>
      ) ): null}
      </Stack>
      <div style={{ width: '100%' }}>
        <DataGrid
          autoHeight
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          pagination
          density='compact'
          disableSelectionOnClick={ true }
          getRowId={(row) => `${row[props.internalId ? props.internalId : props.idField]}`}
          columnVisibilityModel={props.hiddenColumns}
          rows={props.rows}
          columns={props.columns}
          onCellEditStart={handleCellEditStart}
          processRowUpdate={processRowUpdate}
          experimentalFeatures={{ newEditingApi: true }}
          hideFooter={false}
          components={
            {...props.customToolbar}
          }
        />
      </div>
      </div>
      </div>
  );
}
