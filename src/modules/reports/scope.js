
import * as React from "react";
import { connect } from "redux-bundler-react";
import Paper from '@mui/material/Paper';
import Typography from "@mui/material/Typography";
import { styled } from '@mui/material/styles';
import DataGrid from '../../components/data-grid/grid';
import {cellExpander, customToolbar} from '../../components/data-grid/options'
import orderBy from 'lodash/orderBy';
import Skeleton from '@mui/material/Skeleton';
import Button from "@mui/material/Button";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.primary.main,  
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.primary.contrastText,
  marginBottom:theme.spacing(4)
}));


class Scope extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.renderGrid = this.renderGrid.bind(this);
    
  }
  componentDidMount() {
    const { doReportScopeFetch, reportScopeItems} = this.props;
    if(!reportScopeItems?.length>0) {
      doReportScopeFetch()
      }
      
  }
  
  renderGrid() {
    const {reportScopeItems} =this.props;
    let view=null;
    if(reportScopeItems.length>0) {
      const rowsOrdered = orderBy(reportScopeItems,["project_name"]);
      const data ={
          idField:'project_id',
          hiddenColumns:{
          },
          rows: rowsOrdered,          
          columns:[
            
          {
            field: 'project_name',
            headerName: 'Project Name',
            type: 'string',
            width: 300,
            editable:false,
            hidden: false,
            renderCell: cellExpander
          }, 
          {
            field: 'scope',
            headerName: 'Scope',
            type: 'string',
            width: 600,
            editable:false,
            hidden: false,
            renderCell: cellExpander
          },
          {
            field: 'total_labor',
            headerName: 'Total Labor',
            type: 'number',
            width: 300,
            editable:false,
            hidden: false,
            renderCell: cellExpander
          }    
        ]
      }
      
      view=(
        <DataGrid customToolbar={{Toolbar: customToolbar}} type={ data.type} idField={data.idField} hiddenColumns={ data.hiddenColumns} columns={ data.columns} rows={ data.rows}/>
      )
    }else{
      view=(<Skeleton variant="text" />)
    }
    return view
  }
  
  render() {
    const {reportScopeDownloadActive, doStartScopeExport} = this.props
   
    return (
     
      <div>
         <Paper style={{padding:'2em', minWidth:'960px'}}>
        <Item >
          <Typography variant="h4"component="div">Scope Report</Typography>
            </Item>
            
            {this.renderGrid()}
          </Paper>
        </div>
    );
  }
}

export default connect( 
  'doStartScopeExport',
  'doReportScopeFetch',
  'selectReportScopeItems',
  'selectReportScopeDownloadActive',    
    Scope
);
