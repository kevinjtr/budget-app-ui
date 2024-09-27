import React, {useEffect} from 'react'
import {Box} from '@mui/material';
import {connect} from 'redux-bundler-react';
import {Skeleton} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid/DataGrid'
import moment from "moment"

function DatabaseLoadHistory({ databaseLoadHistoryItems, doDatabaseLoadHistoryFetch, databaseLoadHistoryItemsIsLoading, databaseLoadHistoryItemsIsSaving }) {

    const columns = [
        // {
        //     field: 'id',
        //     headerName: 'ID',
        //     minWidth:100,
        //     editable:false,
        // }, 
        {
            field: 'dateLoaded',
            headerName: 'Date Loaded',
            minWidth:200,
            editable:false,
            valueFormatter: (params) => {
                if (params.value == null) {
                  return '';
                }
                const valueFormatted = moment(new Date(params.value)).format("DD/MM/YYYY HH:mm:ss").toString()
                return valueFormatted;
              },
        }, 
        {
            field: 'fiscalYear',
            headerName: 'Fiscal Year',
            editable:false,
            minWidth:200,
        },
        {
            field: 'loadTypeName',
            headerName: 'Load Name',
            editable:false,
            minWidth:200,
        },
        {
            field: 'firstName',
            headerName: 'First Name',
            editable:false,
            minWidth:200,
        },
        {
            field: 'lastName',
            headerName: 'Last Name',
            editable:false,
            minWidth:200,
        }, 
        {
            field: 'orgAlias',
            headerName: 'Org Alias',
            editable:false,
            minWidth:200,
        }, 
      ]
   
    useEffect(() => {
        if(databaseLoadHistoryItems?.length === 0){
            doDatabaseLoadHistoryFetch()
        }
    },[])

    return(
        <Box>
            {databaseLoadHistoryItemsIsLoading || databaseLoadHistoryItemsIsSaving ? (
            <Skeleton variant="text" />
            ) : 
            <DataGrid
                autoHeight
                initialState={{
                    sorting: {
                      sortModel: [{ field: 'dateLoaded', sort: 'desc' }],
                    },
                }}
                disableSelectionOnClick={ true }
                onCellDoubleClick={(params, event) => {
                if (!event.ctrlKey) {
                    event.defaultMuiPrevented = true;
                }
                }}
                rows={databaseLoadHistoryItems} 
                columns={columns}
            />
            }
        </Box>
    )
}

export default connect(
    'selectDatabaseLoadHistoryItems',
    'doDatabaseLoadHistoryFetch',
    'selectDatabaseLoadHistoryIsLoading',
    'selectDatabaseLoadHistoryIsSaving',
DatabaseLoadHistory);