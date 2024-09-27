
import * as React from "react";
import { connect } from "redux-bundler-react";
import Paper from '@mui/material/Paper';
import Typography from "@mui/material/Typography";
import { styled } from '@mui/material/styles';
import DataGrid from '../../components/data-grid/grid';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import find from 'lodash/find';
import orderBy from 'lodash/orderBy';
import filter from 'lodash/filter';
import {cellExpander} from '../../components/data-grid/options'
import RoleFilter from '../../containers/context-providers/role-filter';
import Decimal from 'decimal.js';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.primary.main,  
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.primary.contrastText,
  marginBottom:theme.spacing(4)
}));


class Taxes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing:false,
      editedAttrs:{},
    };
    
    this.renderTaxRates = this.renderTaxRates.bind(this);
    this.renderProjectTaxStatus = this.renderProjectTaxStatus.bind(this);
    this.startEditing = this.startEditing.bind(this);
    this.stopEditing = this.stopEditing.bind(this);
    this.cancelEditing = this.cancelEditing.bind(this);
  }
  
  
  componentDidMount() {
    const {doTaxesFetch, taxesItems, doTaxRateFetch, taxRateItems} = this.props; 
      // const {doTaxCalculationFetch, taxCalculationItems} = this.props;
    if(!taxesItems?.length>0) {
      doTaxesFetch()
    }
    if(!taxRateItems?.length>0) {
      doTaxRateFetch()
    }
    // if(!taxCalculationItems?.length>0) {
    //   doTaxCalculationFetch()
    // }
  }
  renderTaxRates() {
    const {taxRateItems, taxRateIsLoading, taxRateIsSaving} =this.props
    
    let view=null
    if(!taxRateIsLoading){
      const items = taxRateItems.length > 0 ? taxRateItems : []
      const rowsOrdered = orderBy(items,["code"]);
      const data ={
          type:'taxRate',
          tableField:'table_name',
          idField:'fiscal_year_tax_id',
          internalId:'code',
          hiddenColumns:{
            // Hide columns
            fiscal_year_tax_id: false,
            table_name:false,
            changeHistoryId:false
          },
          rows: rowsOrdered,          
          columns:[
          {
            field: 'table_name',
            headerName: 'Table Name',
            type: 'string',
            width: 180,
            editable:false,
            hidden: true,
            align:'left',
            headerAlign:'left',
          }, 
          {
            field: 'code',
            headerName: 'Org Code',
            type: 'string',
            width: 180,
            editable:false,
            hidden: false,
            align:'left',
            headerAlign:'left',
          },
          {
            field: 'name',
            headerName: 'Name',
            type: 'string',
            width: 300,
            editable:false,
            hidden: false,
            renderCell: cellExpander,
            align:'left',
            headerAlign:'left',
          },
          {
            field: 'tax_pct',
            headerName: 'Tax Percent',
            type: 'number',
            width: 180,
            align:'left',
            headerAlign:'left',
            valueParser: (value) => {
              Decimal.config({precision: 2, rounding: 2 })
              let newValue = value;
              if (!value || value === null || value < 0) {
                newValue = 0;
              }else if(value > 100) {
                newValue = 100;
              }
              value=Number(new Decimal(newValue).toFixed(2));
              return value
            },
            valueFormatter: (params) => {
              Decimal.config({precision: 2, rounding: 1 })
              let newValue = params.value;
              if (params.value == null || params.value < 0) {
                newValue = 0;
              }

              const valueFormatted = Number(new Decimal(newValue).toFixed(2)).toLocaleString();
              return `${valueFormatted} %`;
            },
            editable:true,
            hidden: false,
          },
          {
            field: 'changeHistoryId',
            headerName: 'Change History Id',
            type: 'number',
            width: 180,
            editable:false,
            hidden: true,
            align:'left',
            headerAlign:'left',
          },     
        ]
      }
      const editableFields = filter(data.columns,{editable: true});
      view=(
        taxRateItems.length > 0 ? 
        <DataGrid type={ data.type} tableField={data.tableField} internalId={data.internalId} idField={ data.idField} hiddenColumns={ data.hiddenColumns} editableFields={editableFields} startEditing={this.startEditing} stopEditing={this.stopEditing} columns={ data.columns} rows={ data.rows} cancelEditing={this.cancelEditing}/>
        : !taxRateIsSaving ? <Typography>Tax Editing is not available for the selected Fiscal Year.</Typography> : null
        )
      
    }else{
      view=(<Skeleton variant="text" />)
    }

    return view
  }
  renderProjectTaxStatus() {
    const {taxesItems, taxesIsLoading} =this.props

    let view=null
    if(!taxesIsLoading){
      const items = taxesItems.length > 0 ? taxesItems : []
      const rowsOrdered = orderBy(items,["name"]);
    const data ={
        type:'projectBudget',
        idField:'id',
        
        internalId:'id',
        hiddenColumns:{
          // Hide columns
          id: false,
          changeHistoryId:false
        },
        rows: rowsOrdered,          
        columns:[
          {
            field: 'id',
            headerName: 'Id',
            type: 'number',
            width: 180,
            editable:false,
            hidden: true,
            align:'left',
            headerAlign:'left',
          },  
        {
          field: 'p2_id',
          headerName: 'P2 Id',
          type: 'string',
          width: 180,
          editable:false,
          hidden: false,
          align:'left',
          headerAlign:'left',
        },
        {
          field: 'name',
          headerName: 'Name',
          type: 'string',
          width: 300,
          editable:false,
          hidden: false,
          renderCell: cellExpander,
          align:'left',
          headerAlign:'left',
        },
        {
          field: 'descriptive_name',
          headerName: 'Descriptive Name',
          type: 'string',
          width: 300,
          editable:false,
          hidden: false,
          align:'left',
          headerAlign:'left',
        },
        {
          field: 'include_tax',
          headerName: 'Apply Tax',
          type: 'boolean',
          width: 180,
          editable:true,
          hidden: false,
          align:'center',
          headerAlign:'left',
          valueParser: (value, params) => {
            console.log(value)
            return value===true || value===1 ? 1 : 0;
          }
        },
        {
          field: 'changeHistoryId',
          headerName: 'Change History Id',
          type: 'number',
          width: 180,
          editable:false,
          hidden: true,
          align:'left',
          headerAlign:'left',
        },      
      ]
    }
      const editableFields = filter(data.columns,{editable: true});
      view=(
        <DataGrid type={ data.type} internalId={data.internalId} idField={ data.idField} hiddenColumns={ data.hiddenColumns} editableFields={editableFields} startEditing={this.startEditing} stopEditing={this.stopEditing} columns={ data.columns} rows={ data.rows} cancelEditing={this.cancelEditing}/>
      )
    }else{
      view=(<Skeleton variant="text" />)
    }
    return view
  }
  startEditing(type) {
    this.setState({editing: true})
  }
 
  stopEditing(type, editedValues) {
    const {orgCode} = this.state;
    const {doTaxesBulkSave, doTaxRateBulkSave, taxesItems, taxRateItems} = this.props;
    const editedIds = Object.keys(editedValues);
    if(editedIds.length>0) {
      const postAttrs ={}
      const editedArr =[];
      if(type==='projectBudget') {
        postAttrs.table='Taxes';
        for(let i=0;i<editedIds.length;i++) {        
          const editedObj = editedValues[editedIds[i]];
          const id ="id"
          const itemObj = find(taxesItems,{[id]:editedObj.id});
          itemObj[editedObj.field] = editedObj.newValue;
          editedArr.push({includeFlatTax:{table:'projectBudget', id:editedObj.id, changeHistoryId:editedObj.changeHistoryId , newVal:editedObj.newValue, oldVal:editedObj.oldValue }});
          editedArr.push({includeDivisionTax:{table:'projectBudget', id:editedObj.id, changeHistoryId:editedObj.changeHistoryId , newVal:editedObj.newValue, oldVal:editedObj.oldValue }});
          editedArr.push({includeSectionTax:{table:'projectBudget', id:editedObj.id, changeHistoryId:editedObj.changeHistoryId , newVal:editedObj.newValue, oldVal:editedObj.oldValue }});
          editedArr.push({includeBranchTax:{table:'projectBudget', id:editedObj.id, changeHistoryId:editedObj.changeHistoryId , newVal:editedObj.newValue, oldVal:editedObj.oldValue }});
        }
      }else{
        postAttrs.table='TaxRate';
        for(let i=0;i<editedIds.length;i++) {        
          const editedObj = editedValues[editedIds[i]];
          const id ="code";
          const itemObj = find(taxRateItems,{[id]:editedObj.internalId});
          itemObj[editedObj.field] = editedObj.newValue;
          editedArr.push({[editedObj.field]:{table:editedObj.table_name, id:editedObj.id, changeHistoryId:editedObj.changeHistoryId , newVal:editedObj.newValue, oldVal:editedObj.oldValue }});
        }
      }
      postAttrs.changes=editedArr;
      if(type==='projectBudget') {
        doTaxesBulkSave(postAttrs);
      }else{
        doTaxRateBulkSave(postAttrs);
      }
    }
    this.setState({editing: !this.state.editing, editedValues:null})
  }
  cancelEditing() {
    this.setState({editing: false, editingType: null, editedValues:null})
  }

  render() {
    const {doStartTaxCalculation, taxCalculationItems} = this.props
   
    return (
      <RoleFilter allowRoles={[`APP.ADMIN`, `:ORG.ADMIN`]}>
      <div>
         <Paper style={{padding:'2em', minWidth:'960px'}}>
        <Item >
          <Typography variant="h4"component="div">Taxes</Typography>
        </Item>
        <Box>
          {/* <div style={{display:'flex', flexDirection:'column', alignItems:'center' }}>
            <Button disabled={!taxCalculationItems[0]?.finishedOn} onClick={doStartTaxCalculation}>Force Tax Calculation</Button>
            <Typography variant="subtitle2">Last Ran On: {taxCalculationItems[0]?.startedOn}</Typography>
            <Typography variant="subtitle2">Ran By: {taxCalculationItems[0]?.startedBy}</Typography>
            <Typography variant="subtitle2">Status: {!taxCalculationItems[0]?.finishedOn ? 'Still Calculating' : 'Complete'}</Typography>
          </div> */}
          
        <Typography variant="h5">
          Tax Rate Information
        </Typography>
        <Box sx={{ margin:'2em' }}>
          {this.renderTaxRates()}
        </Box>
            <Typography variant="h5" >
              Project Tax Rate Status
            </Typography>
            <Box sx={{ margin:'2em' }}>
              {this.renderProjectTaxStatus()}
            </Box>
            
            </Box>
          </Paper>
        </div>
        </RoleFilter>
    );
  }
}

export default connect(
  "doUpdateUrlWithHomepage",
    "selectRouteParams",
    "selectOrgsByRoute",
    "selectOrgCodeDomain",
    "selectTaxesByRoute",
    "doTaxesFetch",
    "doTaxesBulkSave",
    'selectTaxesItems',
    "doTaxRateFetch",
    "doTaxRateBulkSave",
    'selectTaxRateItems',
    'selectTaxRateIsLoading',
    'selectTaxRateIsSaving',
    'selectTaxesIsLoading',
    // 'doTaxCalculationFetch', 
    // 'selectTaxCalculationItems',
    // 'doStartTaxCalculation', 
    Taxes
);
