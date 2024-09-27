import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Stack, Typography } from '@mui/material'
import DataGrid from '../../components/data-grid';
import {StatusLockedOperators} from '../../tools/data-grid-column-filters'

const columns = [
    { field: 'pocName', headerName: 'POC', minWidth: 200 },   
    {
      field: 'oldValue',
      headerName: 'Old Value',
      minWidth: 170,
      maxWidth: 270,
      //align: 'right',
      sortable: false,
      filterOperators: StatusLockedOperators,
      renderCell: (obj) => <Typography>{obj.value ? 'Locked' : 'Open'}</Typography>
    },
    {
        field: 'newValue',
        headerName: 'New Value',
        minWidth: 170,
        maxWidth: 270,
        //align: 'right',
        sortable: false,
        filterOperators: StatusLockedOperators,
        renderCell: (obj) => <Typography>{obj.value ? 'Locked' : 'Open'}</Typography>
      },
    {
      field: 'dateModified',
      headerName: 'Date Modified',
      minWidth: 220,
      align: 'right',
      type: 'dateTime',
      sortable: false,
      valueGetter: ({ value }) => value && new Date(value),
    },
  ];

export default function BasicTable(props) {
  return (
      <>
      {
      (props.fetching) ? (<div> Fetching History </div>) : (
          (props.fetched && props.history && props.history.length>0) ? (
            <Box sx={{ height: 400, minWidth: 800 }}>
              <DataGrid
              GridColDef={false}
                rows={props.history}
                columns={columns}
              />
            </Box>
        // <TableContainer component={Paper}>
        //     <Table sx={{ minWidth: 650 }} aria-label="simple table">
        //         <TableHead>
        //         <TableRow>
        //             {columns.map((column) => (
        //             <TableCell
        //                 key={`column_${column.label}_${column.id}`}
        //                 align={column.align}
        //                 style={{ minWidth: column.minWidth }}
        //                 >
        //                 {column.label}
        //             </TableCell>
        //             ))}
        //         </TableRow>
        //         </TableHead>
        //         <TableBody>
        //         {props.history.map((row) => {
        //         return (
        //           <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
        //             {columns.map((column) => {
        //               const value = row[column.id];
        //               return (
        //                 <TableCell  key={`row_${column.label}_${column.id}`} align={column.align}>
        //                   {column.format && typeof value === 'number'
        //                     ? column.format(value)
        //                     : value}
        //                 </TableCell>
        //               );
        //             })}
        //           </TableRow>
        //         );
        //       })}
        //         </TableBody>
        //     </Table>
        //     </TableContainer>
        ) : (<div> No History</div>))
        }
      </>
    
  );
}