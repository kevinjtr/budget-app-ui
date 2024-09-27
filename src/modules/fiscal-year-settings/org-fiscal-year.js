import { connect } from "redux-bundler-react";
import {IconButton, Stack, Skeleton, FormControl, InputLabel, NativeSelect, Tooltip} from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import EditIcon from '@mui/icons-material/Edit';
import CellUpdateDialog from './CellUpdateDialog'
import {StatusLockedOperators} from '../../tools/data-grid-column-filters'
import HistoryButton from '../../components/history';

function OrgFiscalYear(props) {
  const {fySettingsItems,fySettingsIsLoading, fySettingsIsSaving, fySettingsIsUpdateModalOpen, doFySettingsStartEditing} = props

  const handleCellEdit = (params) => {
    doFySettingsStartEditing(params.row)
  }

  const ViewChangeHistoryAction = ({params}) => {
    const {row} = params
    return(
      <HistoryButton label={"Status"} type={"status_locked"} table={"OrgFiscalYearSettings"} attr={"locked"} componentName={`fiscal-year-settings-${row.id}`} changeHistoryId={row.change_history_id} />
    )
  }

  const EditAction = ({params}) => (
      <IconButton onClick={() => handleCellEdit(params)} title="Edit Row">
        <EditIcon />
      </IconButton>
  )

  const columns = [
    {
      field: 'Change History',
      type: 'actions',
      renderCell: (params) => <ViewChangeHistoryAction {...{params}}/>,
      sortable: false,
      filterable: false,
    },  
    {
      field: 'year',
      headerName: 'Fiscal Year',
      flex:1,
      editable:false,
    },
    {
      field: 'org_slug',
      headerName: 'Organization',
      flex:1,
      editable:false,
    },
    {
      field: 'locked',
      headerName: 'Status',
      flex:1,
      editable:true,
      filterOperators: StatusLockedOperators,
      renderCell: (obj) => (
        <Stack direction="row" alignItems="left" gap={1}>
        {obj.value ? <><LockIcon/>Locked</> : <><LockOpenIcon/>Open</>}
        </Stack>
      )
    }, 
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      renderCell: (params) => <EditAction {...{params}}/>,
      sortable: false,
      filterable: false,
    },    
  ]

  return (
    <div style={{ display: 'flex'}}>
    <div style={{ flexGrow: 1 }}>
    {fySettingsIsUpdateModalOpen && <CellUpdateDialog columns={columns}/>}
    <div style={{ flexGrow: 1,paddingTop: 5 }}>
      {fySettingsIsLoading || fySettingsIsSaving ? (
      <Skeleton variant="text" />
      ) : 
      <DataGrid
      initialState={{
        filter: {
          filterModel: {
            items: [{ columnField: 'locked', operatorValue: 'is' }],
          },
        }}}
        autoHeight
        density='compact'
        disableSelectionOnClick={ true }
        onCellDoubleClick={(params, event) => {
          if (!event.ctrlKey) {
            event.defaultMuiPrevented = true;
          }
        }}
        rows={fySettingsItems} 
        columns= {columns}
        hideFooter={true}
      />
      }
    </div>
    </div>     
  </div>
  );
}

export default connect(
  "selectFySettingsItems",
  "selectFySettingsIsLoading",
  "selectFySettingsIsSaving",
  "selectFySettingsIsUpdateModalOpen",
  "doFySettingsStartEditing",
  OrgFiscalYear
);
