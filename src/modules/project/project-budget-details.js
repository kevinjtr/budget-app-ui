
import * as React from "react";
import { connect } from "redux-bundler-react";

import {Paper, IconButton, Tooltip} from '@mui/material';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import find from 'lodash/find';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from "@mui/material/Button";
import orderBy from 'lodash/orderBy';
import filter from 'lodash/filter';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextFieldInput from '../../components/editable-with-history/text-field';
import AutocompleteFieldInput from '../../components/editable-with-history/autocomplete-field';
import CheckBoxFieldInput from '../../components/editable-with-history/checkbox-field';
import GenericFieldInput from '../../components/editable-with-history/generic-field';
import TextFieldMultiInput from '../../components/editable-with-history/text-field-multi';
import BudgetTab from './budget-tab';
import {cellExpander} from '../../components/data-grid/options'
import Notes from '../../components/notes'
import RoleFilter from '../../containers/context-providers/role-filter';
import HistoryButton from '../../components/history';
import EventNoteIcon from '@mui/icons-material/EventNote';

const ViewChangeHistoryAction = ({params, table}) => {
  const {row} = params
  const change_history = table === 'BudgetLabor' ? 'labor_change_history_id' : 'non_labor_change_history_id'
  const attr = table === 'BudgetLabor' ? 'dollar_amount' : ''
  
  return(
    <HistoryButton table={table} attr={attr} componentName={`project-budget-details-${row.id}`} changeHistoryId={row[change_history]} />
  )
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.primary.main,  
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.primary.contrastText,
  marginBottom:theme.spacing(4)
}));


class ProjectBudgetDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orgCode:null,
      orgCodeOption:null,
      editing: false,
      value:0
    };
   
    this.handleChangeDomain= this.handleChangeDomain.bind(this);
    this.backToProject = this.backToProject.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.renderTabs = this.renderTabs.bind(this);
    this.startEditing = this.startEditing.bind(this);
    this.stopEditing = this.stopEditing.bind(this);
    this.cancelEditing = this.cancelEditing.bind(this);
    
  }
  componentDidMount() {
    const {doActivityBudgetFetch, activityBudgetItems, projectItems, doProjectFetch} = this.props;
    if(!activityBudgetItems?.length>0) {
      doActivityBudgetFetch()
    }
    if(!projectItems?.length>0) {
      doProjectFetch()
    }
  }

  startEditing(type) {
    this.setState({editing: true})
  }
 
  stopEditing(type, editedValues) {
    const {doBudgetLaborBulkSave, doBudgetNonLaborBulkSave, activityBudgetItems} = this.props;
    const editedIds = Object.keys(editedValues);
    if(editedIds.length>0) {
      const postAttrs ={}
      const editedArr =[];
      for(let i=0;i<editedIds.length;i++) {        
        const editedObj = editedValues[editedIds[i]];
        const id = `budget_${type==='labor'? "labor": "non_labor"}_id`;
        const itemObj = find(activityBudgetItems,{[id]:editedObj.id});
        itemObj[editedObj.field] = editedObj.newValue;
        editedArr.push({[editedObj.field==='labor_dollar_amount' ? 'dollar_amount': editedObj.field]:{table:(type==='labor'? 'BudgetLabor': 'BudgetNonLabor'),id:editedObj.id, changeHistoryId:editedObj.changeHistoryId , newVal:editedObj.newValue, oldVal:editedObj.oldValue }});
      }
      postAttrs.table=type==='labor'? 'BudgetLabor': 'BudgetNonLabor';
      postAttrs.changes=editedArr;

      if(type==='labor') {
        doBudgetLaborBulkSave(postAttrs);
      }else{
        doBudgetNonLaborBulkSave(postAttrs);
      }
    }
    this.setState({editing: !this.state.editing, editedValues:null})
  }
  cancelEditing() {
    this.setState({editing: false, editingType: null, editedValues:null})
  }
  
  handleChangeDomain (event, newValue) {
    const val = newValue;
    if(val) {
      
      const orgCode=val;
      this.setState(
        {
          orgCode:val.value,
          orgCodeOption:orgCode
        }
      );
    }else{
      this.setState(
        {
          orgCode:null,
          orgCodeOption:null
        }
      );
    }
    
  }
  

  backToProject() {
    const { doUpdateUrlWithHomepage, orgsByRoute, fySelectedYear } = this.props;
    doUpdateUrlWithHomepage(`/${orgsByRoute.slug}/${fySelectedYear}/project`);
  }

  handleTabChange(event, newValue) {
    this.setState({value:newValue})
  }

  // renderActivities() {
  //   const{activityBudgetGroupsByOrg, activityBudgetFetchCount,activityBudgetIsLoading}=this.props;
  //   let view= null;
  //   if(activityBudgetFetchCount>0 && !activityBudgetIsLoading) {

  //   }
  // }
  renderTabs() {
    const {orgCode, value, editing} = this.state
    const{activityBudgetGroupsByOrg}=this.props;
    let view =null
    if(orgCode) {
      const rows = filter(activityBudgetGroupsByOrg?.[orgCode],{'show':1})
      const rowsOrdered = orderBy(rows,["name"])
      const fy_locked = rowsOrdered[0].locked
      view=(
        <div>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={this.handleTabChange} aria-label="basic tabs example">
            <Tab disabled={editing} label="Labor" {...a11yProps(0)} />
            <Tab disabled={editing} label="Non Labor" {...a11yProps(1)} />
          </Tabs>
        </Box>
        
        {[
          {
            type:'labor',
            idField:'budget_labor_id',
            hiddenColumns:{
              // Hide columns
              budget_labor_id: false,
              labor_comment_list_id: false,
              labor_change_history_id: false
            },
            //activity columns edit          
            columns:[
              {
                field: 'Change History',
                type: 'actions',
                renderCell: (params) => <ViewChangeHistoryAction {...{params, table: 'BudgetLabor'}}/>,
                sortable: false,
                filterable: false,
                width: 80,
              },  
              {
                field: 'budget_labor_id',
                headerName: 'Budget Labor Id',
                type: 'number',
                width: 180,
                editable: false,
                hidden: true,
              },
              {
                field: 'activity_number',
                headerName: 'Activity ID',
                type: 'number',
                width: 180,
                editable:false,
              },
              { 
                field: 'activity_name',
                headerName: 'Name',
                width: 300,
                editable: false,
                renderCell: cellExpander
              },
              { 
                field: 'labor_dollar_amount', 
                headerName: 'Dollar Amount', 
                valueParser: (value, params) => {
                  return Math.abs(value)
                },
                type: 'number',
                flex:1, 
                minWidth: 220,
                maxWidth: 300,
                editable: true,
                align:'left',
                headerAlign:'left'
                // renderCell: (params) => (
                //   <>
                //     {params.value}
                //     <HistoryIcon
                //       table='BudgetLabor' attr='dollar_amount' changeHistoryId={params.row.labor_change_history_id}
                //     />
                //   </>
                // ), 
              },
              {
                field: 'startDate',
                headerName: 'Start Date',
                type: 'date',
                width: 180,
                editable: false,
              },
              {
                field: 'endDate',
                headerName: 'End Date',
                type: 'date',
                width: 180,
                editable: false,
              },
              {
                field: 'labor_change_history_id',
                headerName: 'Change History Id',
                type: 'number',
                width: 180,
                editable: false,
                hidden: true,
              },
              {
                field: 'labor_comment_list_id',
                headerName: 'Comment List Id',
                type: 'number',
                width: 180,
                editable: false,
                hidden: true,
              },
              
            ],
            rows: rowsOrdered
          },
          {
            type:'nonlabor',
            idField:'budget_non_labor_id',
            hiddenColumns:{
              // Hide columns status and traderName, the other columns will remain visible
              non_budget_labor_id: false,
              non_labor_comment_list_id: false,
              non_labor_change_history_id: false
            },          
            columns:[
              {
                field: 'Change History',
                type: 'actions',
                renderCell: (params) => <ViewChangeHistoryAction {...{params, table: 'BudgetNonLabor'}}/>,
                sortable: false,
                filterable: false,
              },   
              {
                field: 'non_budget_labor_id',
                headerName: 'Budget Non Labor Id',
                type: 'number',
                width: 180,
                editable:false,
                hidden: true,
              },
              {
                field: 'activity_number',
                headerName: 'Activity ID',
                type: 'number',
                width: 180,
                editable:false,
              },
              { 
                field: 'activity_name',
                headerName: 'Name',
                width: 300,
                editable: false,
                renderCell: cellExpander
              },
              {
                field:"ae_services",
                headerName:"AE Services", 
                valueParser: (value, params) => {
                  return Math.abs(value)
                },
                type: 'number',
                align:'left',
                headerAlign:'left',
                flex:1, 
                minWidth: editing ? 160 : 100,
                editable: true 
              },
              {
                field:"coredrill",
                headerName:"Core Drill",  
                valueParser: (value, params) => {
                  return Math.abs(value)
                },
                type: 'number',
                align:'left',
                headerAlign:'left',
                flex:1, 
                minWidth: editing ? 160 : 100,
                editable: true 
              },
              {
                field:"gis",
                headerName:"GIS",  
                valueParser: (value, params) => {
                  return Math.abs(value)
                },
                type: 'number',
                align:'left',
                headerAlign:'left',
                flex:1, 
                minWidth: editing ? 160 : 100,
                editable: true 
              },
              {
                field:"gsa_vehicle",
                headerName:"GSA Vehicle",  
                valueParser: (value, params) => {
                  return Math.abs(value)
                },
                type: 'number',
                align:'left',
                headerAlign:'left',
                flex:1, 
                minWidth: editing ? 160 : 100,
                editable: true 
              },
              {
                field:"other_con_svcs",
                headerName:"Other Con SVCS",  
                valueParser: (value, params) => {
                  return Math.abs(value)
                },
                type: 'number',
                align:'left',
                headerAlign:'left',
                flex:1, 
                minWidth: editing ? 180 : 120,
                editable: true 
              },
              {
                field:"other_corps",
                headerName:"Other Corps",  
                valueParser: (value, params) => {
                  return Math.abs(value)
                },
                type: 'number',
                align:'left',
                headerAlign:'left',
                flex:1, 
                minWidth: editing ? 160 : 110,
                editable: true 
              },
              {
                field:"other_facility_services",
                headerName:"Other Facility Services", 
                valueParser: (value, params) => {
                  return Math.abs(value)
                }, 
                type: 'number',
                align:'left',
                headerAlign:'left',
                flex:1, 
                minWidth: 180,
                editable: true 
              },
              {
                field:"other_gov",
                headerName:"Other Gov",  
                valueParser: (value, params) => {
                  return Math.abs(value)
                },
                type: 'number',
                align:'left',
                headerAlign:'left',
                flex:1, 
                minWidth: editing ? 160 : 110,
                editable: true 
              },
              {
                field:"shop_facility",
                headerName:"Shop Facility",  
                valueParser: (value, params) => {
                  return Math.abs(value)
                },
                type: 'number',
                align:'left',
                headerAlign:'left',
                flex:1, 
                minWidth: editing ? 180 : 120,
                editable: true 
              },
              {
                field:"travel_per_diem", 
                headerName:"Travel Per Diem", 
                valueParser: (value, params) => {
                  return Math.abs(value)
                },
                type: 'number',
                align:'left',
                headerAlign:'left',
                flex:1, 
                minWidth: editing ? 180 : 120,
                editable: true
              },
              {
                field: 'startDate',
                headerName: 'Start Date',
                type: 'date',
                width: 180,
                editable: false,
              },
              {
                field: 'endDate',
                headerName: 'End Date',
                type: 'date',
                width: 180,
                editable: false,
              },
              {
                field: 'non_labor_change_history_id',
                headerName: 'Change History Id',
                type: 'number',
                width: 180,
                editable: false,
                hidden: true,
              },
              {
                field: 'non_labor_comment_list_id',
                headerName: 'Comment List Id',
                type: 'number',
                width: 180,
                editable: false,
                hidden: true,
              },
              
            ],
            rows: rowsOrdered
          }
        ].map((val, idx)=>{
          const editableFields = filter(val.columns,{editable: true});
         
          return(
            <TabPanel key={`budget-${val.type}-tab`} value={value} index={idx}>
              <BudgetTab disableEdit={fy_locked} type={val.type} idField={val.idField} hiddenColumns={val.hiddenColumns} editableFields={editableFields} startEditing={this.startEditing} stopEditing={this.stopEditing} columns={val.columns} rows={val.rows} cancelEditing={this.cancelEditing}/>
            </TabPanel>
          )
        })}
        
        
      </div>
      )
    }else{
      view=(<Typography variant="subtitle2">Please Select Org Code to view Budget Information</Typography>)
    };
    return view;
  }
  render() {
    const {projectByRoute, orgCodeDomain, activityBudgetActive, activityBudgetIsLoading,activityBudgetIsSaving,
      doProjectNotesSave, doProjectNotesDelete, profileActive, projectNotesFetchCount, projectNotesItems,
       projectNotesIsLoading, projectNotesIsSaving, doProjectNotesStartEditing, doProjectNotesCancelEditing,
       projectNotesIsEditingId, projectNotesIsUpdateModalOpen, activityBudgetGroupsByOrg} = this.props
    const {editing, orgCodeOption} = this.state;
    let orgCodeOptions =[];
    const orgCodesAvailable = Object.keys(activityBudgetGroupsByOrg)
    if(orgCodeDomain && orgCodeDomain.length>0) {
      orgCodeOptions = filter(orgCodeDomain,function(o){ return orgCodesAvailable.includes(o?.CODE) })
      orgCodeOptions = orgCodeOptions.map(d => {
          return {
            value: d?.CODE,
            label: `${d?.CODE}(${d?.ALIAS})`
          };
      });
    }

    return (
      <RoleFilter allowRoles={[`APP.ADMIN`, `:ORG.*`]}>
      <div>
         <Paper style={{padding:'2em', minWidth:'960px'}}>
        <Item >
          <Typography variant="h4"component="div">Project Budget</Typography>
        </Item>
        <div>
          <Button startIcon={<ArrowBackIcon />} onClick={this.backToProject}>            
            Back            
          </Button>
        </div>
        <Box>
        
        {!activityBudgetIsLoading  ? (
                  projectByRoute ? (
                    <>
                    <Typography variant="h5" >
                          Project Information
                    </Typography> 
                    <Box sx={{ margin:'2em' }}>
                    {!activityBudgetIsLoading ? (
                      !projectByRoute ? (
                        <Typography variant="h6">Project was not found.</Typography>
                      ) : (
                        <>
                        <div style={{display:'flex', flexDirection:'row', gap: "10px 20px"}} >
                        <div style={{display:'flex', flexDirection:'column', flex:2}} >
                          <TextFieldInput componentName="project-budget-settings" table="Project" changeHistoryId={projectByRoute?.changeHistoryId} attr="p2_id" value={projectByRoute?.p2Id} editing={false} label="P2 Id: " name="p2Id"/>
                          <TextFieldInput componentName="project-budget-settings" table="Project" changeHistoryId={projectByRoute?.changeHistoryId} attr="project_name" value={projectByRoute?.name} editing={false} label="Project Name: " name="name"/>
                          <TextFieldInput componentName="project-budget-settings" table="Project" changeHistoryId={projectByRoute?.changeHistoryId} attr="descriptive_name" value={projectByRoute?.descriptiveName} editing={false} label="Project Descriptive Name: " name="descriptiveName"/>
                          <TextFieldInput componentName="project-budget-settings" table="Project" changeHistoryId={projectByRoute?.changeHistoryId} attr="project_manager" value={projectByRoute?.projectManagerName} editing={false} label="Project Manager: " name="projectManager"/>
                          <TextFieldInput componentName="project-budget-settings" table="Project" changeHistoryId={projectByRoute?.changeHistoryId} attr="technical_lead" value={projectByRoute?.technicalLeadName} editing={false} label="Technical Lead: " name="technicalLead"/>                  
                        </div>
                        <div style={{display:'flex', flexDirection:'column', flex:1}} >
                          <CheckBoxFieldInput componentName="project-budget-settings" table="Project" changeHistoryId={projectByRoute?.changeHistoryId} attr="has_gis" value={projectByRoute?.hasGIS} type={"boolean"} editing={false} label="EGIS Will be Used: "  name="hasGIS" />
                          <CheckBoxFieldInput componentName="project-budget-settings" table="Project" changeHistoryId={projectByRoute?.changeHistoryId} attr="has_wm" value={projectByRoute?.hasWM} type={"boolean"} editing={false}label="Water Modeling Will be Used: " name="hasWM" />
                          <CheckBoxFieldInput componentName="project-budget-settings" table="Project" changeHistoryId={projectByRoute?.changeHistoryId} attr="has_cad" value={projectByRoute?.hasCAD} type={"boolean"} editing={false} label="CAD Will be Used: " name="hasCAD" />
                          <CheckBoxFieldInput componentName="project-budget-settings" table="Project" changeHistoryId={projectByRoute?.changeHistoryId} attr="eng_survey_ktr_support" value={projectByRoute?.engSurveyKTRSupport} type={"boolean"} editing={false} label="Eng/Survey-KTR Support: " name="engSurveyKTRSupport" />            
                          <GenericFieldInput componentName="project-budget-settings" table="Project" type="number" changeHistoryId={projectByRoute?.changeHistoryId} attr="number_cad_drawings" value={projectByRoute?.numberCADDrawings  === 0 || projectByRoute?.numberCADDrawings ? projectByRoute?.numberCADDrawings: 0} editing={false} label="Number of CAD Drawings: "name="numberCADDrawings"/>
                        </div>
                        
                        </div>
                        <div>
                          <TextFieldMultiInput componentName="project-budget-settings" table="Project" changeHistoryId={projectByRoute?.changeHistoryId} attr="pdt_member" type={"large_text"} value={projectByRoute?.pdtMember} editing={false} label="PDT Member: " name="pdtMember"/>
                          <TextFieldMultiInput componentName="project-budget-settings" table="Project" changeHistoryId={projectByRoute?.changeHistoryId} attr="scope" type={"large_text"} value={projectByRoute?.scope} editing={false} label="Scope: "   name="scope"/>
                          <TextFieldMultiInput componentName="project-budget-settings" table="Project" changeHistoryId={projectByRoute?.changeHistoryId} attr="assumptions" type={"large_text"} value={projectByRoute?.assumptions} editing={false} label="Assumptions: "   name="assumptions"/>
                          <TextFieldMultiInput componentName="project-budget-settings" table="Project" changeHistoryId={projectByRoute?.changeHistoryId} attr="objectives" type={"large_text"} value={projectByRoute?.objectives} editing={false} label="Objectives: "  name="objectives"/>
                          <TextFieldMultiInput componentName="project-budget-settings" table="Project" changeHistoryId={projectByRoute?.changeHistoryId} attr="deliverables" type={"large_text"} value={projectByRoute?.deliverables} editing={false} label="Deliverables: "  ame="deliverables"/>
                      </div>
                      </>
                      )

                    ) : (<Skeleton variant="text" />)
                    }
                  {
                  (projectNotesFetchCount>0  && !projectNotesIsLoading ) ?  !projectByRoute ? null : (<Notes notes={projectNotesItems} submit={doProjectNotesSave} isUpdateModalOpen={projectNotesIsUpdateModalOpen} isSaving={projectNotesIsSaving} startEditing={doProjectNotesStartEditing} editingId={projectNotesIsEditingId} cancelEditing={doProjectNotesCancelEditing} notesDelete={doProjectNotesDelete} commentListId={projectByRoute?.commentListId} poc={profileActive}/>) : (<Skeleton variant="text" />)
                    }
                    </Box>
                    {
                      activityBudgetActive.length>0 ? (
                        <>
                          <div style={{display:'flex', flexDirection:'column', justifyContent: "start", gap: "10px 20px"}} >
                            <AutocompleteFieldInput
                              componentName="project-budget-settings" 
                              table="Activity"
                              attr="orgCode" 
                              value={orgCodeOption} 
                              editing={!editing} 
                              label="Org Code: "  
                              handleChange={this.handleChangeDomain}
                              options={orgCodeOptions}
                              name="orgCode"
                              useHistory={false}
                            />
                          </div>
                          {this.renderTabs()}
                        </>
                      ) : <Typography variant="h6">No tasks have been selected by the TL.  If this project has scope this FY, please contact the TL to select tasks.</Typography>
                    } 
                    </>
                  ) : <Typography variant="h6" sx={{ textAlign: 'center' }}>No project data was found.</Typography>
        ) : <Skeleton/> }
             
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
    "selectProjectByRoute",
    "selectActivityBudgetItems",
    "selectActivityBudgetGroupsByOrg",
    "doActivityBudgetFetch",
    "doBudgetLaborBulkSave",
    "doBudgetNonLaborBulkSave",
    'selectProjectItems', 
    'doProjectFetch',
    'selectActivityBudgetActive',
    'selectActivityBudgetFetchCount',
    'selectActivityBudgetIsLoading',
    'selectActivityBudgetIsSaving',
    'selectProfileActive',
    'selectProjectNotesItems', 
    'selectProjectNotesIsLoading', 
    'selectProjectNotesIsSaving', 
    'selectProjectNotesFetchCount',
    'doProjectNotesStartEditing',
    'doProjectNotesCancelEditing',
    'selectProjectNotesIsUpdateModalOpen',
    'selectProjectNotesIsEditingId',
    'doProjectNotesSave',
    'doProjectNotesDelete',
    'selectFySelectedYear',
    ProjectBudgetDetails
);