
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
    value: 'orgTotalLabor',
    label: `Show All Orgs With Total Labor`
  }
]
class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportData:[],
      reportType:null,
      reportTypeOption: null,
      project: null,
      projectOption:null,
      fetching:false,
      fetched:false
    };
    this.handleChangeDomain = this.handleChangeDomain.bind(this);
    this.getReport = this.getReport.bind(this);
    this.renderGrid = this.renderGrid.bind(this);
  }
  componentWillUnmount() {
    if(this.cancelablePromise) {
      this.cancelablePromise.cancel();
    }    
  }
  componentDidMount() {
    const {doProjectFetch, projectItems} = this.props;
    if(projectItems && projectItems.length>0) {
      return
    }else{
        doProjectFetch()
    }
  }
  getReport() {
    this.setState({fetching:true, fetched:false});
    
    const {fetched, fetching, reportType, project} =this.state;
        if(!fetching) {
            this.setState({fetching: true, fetched: true, reportData: []});
            const { tokenRaw,apiRoot,orgsByRoute,fySelectedYear} = this.props;
            const url = `${apiRoot}/orgs/${orgsByRoute.slug}/${fySelectedYear}/reports/filtered/${reportType}/project/${project}`
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
    }else if(type==='project' && val){
      obj={
        project:val.value,
        projectOption:val
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
  
  render() {
    const {projectItems,fySelectedItem} = this.props;
    const {projectOption, reportTypeOption, fetching, fetched, reportData} = this.state;
    let projectOptions =[];
    if(projectItems && projectItems.length>0) {
      projectOptions = projectItems.map(d => {
        return {
          value: d?.id,
          label: `P2 Id:${d?.p2Id}   Name: ${d?.name}`
        };
      });
    }
   
    return (
     
      <div>
         <Paper style={{padding:'2em', minWidth:'960px'}}>
        <Item >
          <Typography variant="h4"component="div">Project Filtered Reports</Typography>
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
                      componentName="project-report" 
                      table="Project"
                      attr="orgCode" 
                      value={projectOption} 
                      editing={!fetching} 
                      label="Project: "  
                      handleChange={(event,value) =>this.handleChangeDomain(event, value, 'project')}
                      options={projectOptions}
                      useHistory={false}
                      name="project"
                    />
               <LoadingButton
                  disabled ={!projectOption || !reportTypeOption || fetched || !fySelectedItem?.active}
                  loading={fetching}
                  loadingPosition="start"
                  startIcon={<CalculateIcon />}
                  onClick={this.getReport}
                > {fetching ? 'Processing':'Generate Report'}</LoadingButton>
              <Box sx={{ margin:'2em' }}>
                {Object.keys(reportData).length>0 && fetched===true ? this.renderGrid() : null}
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
  "selectFySelectedYear",
  "selectFySelectedItem",
  Project
);
