
import * as React from "react";
import { connect } from "redux-bundler-react";
import Paper from '@mui/material/Paper';
import Typography from "@mui/material/Typography";
import { styled } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import CalculateIcon from '@mui/icons-material/Calculate';
import AutocompleteFieldInput from '../../components/editable-with-history/autocomplete-field';
import makeCancelable from '../../utils/make-cancellable';
import DataGrid from '../../components/data-grid/grid';
import {cellExpander, customToolbar} from '../../components/data-grid/options';
import Box from '@mui/material/Box';
import filter from 'lodash/filter';
let request = obj => {
  return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open(obj.method || "GET", obj.url);
      if (obj.headers) {
          Object.keys(obj.headers).forEach(key => {
              xhr.setRequestHeader(key, obj.headers[key]);
          });
      }
      xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
              resolve(xhr.response);
          } else {
              reject(xhr.statusText);
          }
      };
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(obj.body);
  });
};


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.primary.main,  
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.primary.contrastText,
  marginBottom:theme.spacing(4)
}));

const reportTypeOptions =[
  {
    value: 'orgProjSummary',
    label: `Show Project Summary`
  }
]
class Org extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportData:[],
      reportType:null,
      reportTypeOption: null,
      orgCode: null,
      orgCodeOption:null,
      fetching:false,
      fetched:false
    };
    this.handleChangeDomain = this.handleChangeDomain.bind(this);
    this.getReport = this.getReport.bind(this);
    this.renderGrid = this.renderGrid.bind(this);
    this.renderTotal = this.renderTotal.bind(this);
  }
  componentWillUnmount() {
    if(this.cancelablePromise) {
      this.cancelablePromise.cancel();
    }    
  }
  
  getReport() {
    this.setState({fetching:true, fetched:false});
    
    const {fetched, fetching, reportType, orgCode} =this.state;
        if(!fetching) {
            this.setState({fetching: true, fetched: true, reportData: []});
            const { tokenRaw,apiRoot,orgsByRoute,fySelectedYear} = this.props;
            const url = `${apiRoot}/orgs/${orgsByRoute.slug}/${fySelectedYear}/reports/filtered/${reportType}/org/${orgCode}`
            this.cancelablePromise = makeCancelable(
                request({
                url:url,
                withCredentials: true,
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + tokenRaw
                }
                }),
            );
            this.cancelablePromise
            .then((results) => {
                if(results){
                const jsonData = JSON.parse(results);
                this.setState({fetching: false, fetched: true, reportData: jsonData});
                
              }else{
                this.setState({fetching: false, fetched: true, reportData: []});
              }            
                
            })
            .catch((e) => {
                this.setState({fetching: false, fetched: true, reportData: []});
                console.error('XHR error', e);
            });
        }
        
  }
  handleChangeDomain (event, newValue, type) {
    const val = newValue;
    let obj
    if(type==='reportType' && val) {
      obj={
        reportType:val.value,
        reportTypeOption: val
      }
    }else if(type==='orgCode' && val){
      obj={
        orgCode:val.value,
        orgCodeOption:val
      }    
    }else{
      obj={
        [type]:null,
        [`${type}Option`]:null
      }
    }
    obj.fetched = false
    this.setState(obj)
    
  }
  renderGrid() {
    const {reportData} = this.state
    let view=null;
    const {columns} = reportData;
    for(let i=0;i<columns.length;i++) {
      if(columns[i].cellExpander && columns[i].cellExpander === true) {
        columns[i].renderCell =cellExpander
        delete columns[i].cellExpander
      }
    }
    view=(<DataGrid
      customToolbar={{Toolbar: customToolbar}} 
      type={ reportData.type} 
      idField={ reportData.idField} 
      hiddenColumns={ reportData.hiddenColumns}
      columns={ reportData.columns} 
      rows={ reportData.rows}
    />)
    return view
  }
  renderTotal() {
    const {reportData} = this.state
    let view=null;
    const {rows} = reportData;
    let laborTotal =0;
    let nonLaborTotal =0;
    for(let i=0;i<rows.length;i++) {
      laborTotal=laborTotal + rows[i].LABOR_AMOUNT;
      nonLaborTotal=nonLaborTotal + rows[i].NON_LABOR_AMOUNT
    }
    view=(<>
    <div>
      <Typography>Labor Total: ${laborTotal}</Typography>
    </div>
    <div>
      <Typography>Non Labor Total: ${Math.ceil(nonLaborTotal / 100) * 100} </Typography>
    </div>
    
    </>)
    return view
  }
  render() {
    const {orgCodeDomain, fySelectedYear, fySelectedItem} = this.props;
    const {orgCodeOption, reportTypeOption, fetching, fetched, reportData} = this.state;
    let orgCodeOptions =[];

    if(orgCodeDomain && orgCodeDomain.length>0) {
      orgCodeOptions = filter(orgCodeDomain,function(o){ return (!['K3L0BH0','K3L0DD0'].includes(o?.CODE) && (fySelectedYear >= 2024 || fySelectedYear <= 2020)) || [2021,2022,2023].includes(fySelectedYear);  })
      orgCodeOptions = orgCodeOptions.map(d => {
        return {
          value: d?.CODE,
          label: `${d?.CODE}(${d?.ALIAS})`
        };
      });
    }
    return (
     
      <div>
         <Paper style={{padding:'2em', minWidth:'960px'}}>
        <Item >
          <Typography variant="h4"component="div">Org Filtered Reports</Typography>
        </Item>
        <AutocompleteFieldInput
                      componentName="project-report-type" 
                      table="ReportType"
                      attr="reportType" 
                      value={reportTypeOption} 
                      editing={!fetching} 
                      label="Report Type: "  
                      handleChange={(event,value) =>this.handleChangeDomain(event, value, 'reportType')}
                      options={reportTypeOptions}
                      useHistory={false}
                      name="reportType"
                    />
        <AutocompleteFieldInput
                      componentName="project-budget-settings" 
                      table="Activity"
                      attr="orgCode" 
                      value={orgCodeOption} 
                      editing={!fetching} 
                      label="Org Code: "  
                      handleChange={(event,value) =>this.handleChangeDomain(event, value, 'orgCode')}
                      options={orgCodeOptions}
                      useHistory={false}
                      name="orgCode"
                    />
               <LoadingButton
                  disabled ={!orgCodeOption || !reportTypeOption || fetched || !fySelectedItem?.active}
                  loading={fetching}
                  loadingPosition="start"
                  startIcon={<CalculateIcon />}
                  onClick={this.getReport}
                > {fetching ? 'Processing':'Generate Report'}</LoadingButton>
                
              <Box sx={{ margin:'2em' }}>
                {Object.keys(reportData).length>0 && fetched===true ? <>{this.renderTotal()}{this.renderGrid()}</> : null}
              </Box>
          </Paper>
        </div>
    );
  }
}

export default connect(
  "doProjectFetch", 
  "selectProjectItems",
  "selectTokenRaw",
  "selectApiRoot",
  "selectOrgsByRoute",
  "selectOrgCodeDomain",
  "selectFySelectedYear",
  "selectFySelectedItem",
  Org
);
