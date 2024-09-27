
import {Button, Chip, Skeleton} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { Typography, Stack } from "@mui/material";
import * as React from "react";
import find from "lodash/find";
import findIndex from "lodash/findIndex";
import remove from "lodash/remove";
import { connect } from "redux-bundler-react";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import DataGrid from '../../components/data-grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import TextFieldInput from '../../components/editable-with-history/text-field';
import AutocompleteFieldInput from '../../components/editable-with-history/autocomplete-field';
import CheckBoxFieldInput from '../../components/editable-with-history/checkbox-field';
import GenericFieldInput from '../../components/editable-with-history/generic-field';
import TextFieldMultiInput from '../../components/editable-with-history/text-field-multi';
import RoleFilter from '../../containers/context-providers/role-filter';
import LockIcon from '@mui/icons-material/Lock';

const ignoreKeys = ['id', 'commentListId','technicalLeadName', 'projectManagerName', 'fiscalYearId']


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.primary.main,  
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.primary.contrastText,
  marginBottom:theme.spacing(4)
}));


class ProjectSetupDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing:false,
      editedAttrs:{},
    };
    this.startEditing= this.startEditing.bind(this);
    this.stopEditing= this.stopEditing.bind(this);
    this.cancelEditing= this.cancelEditing.bind(this);
    this.renderEditButtons= this.renderEditButtons.bind(this);
    this.handleChange= this.handleChange.bind(this);
    this.handleChangeDomain= this.handleChangeDomain.bind(this);
    this.renderSchema= this.renderSchema.bind(this);
    this.getSettings = this.getSettings.bind(this);
    this.getEditedVal = this.getEditedVal.bind(this);
    this.backToProject = this.backToProject.bind(this);
  }
  componentDidMount() {
    const { doPocFetch, pocItems, doActivityFetch, activityItems} = this.props;
    if(!pocItems?.length>0) {
      doPocFetch()
      }
    if(!activityItems?.length>0) {
      doActivityFetch()
      }     
  }
  
  getEditedVal () {
    const {projectByRoute} = this.props;
    const {editedAttrs }= this.state
    const rawKeys = Object.keys(projectByRoute);
    const keys = remove(rawKeys, function(n) {
      return (ignoreKeys).includes(n) === false;
    });
    for(let i=0;i<keys.length;i++) {
      const newValue =this.state[keys[i]]
      const oldVal = projectByRoute[keys[i]]
      if(oldVal === null && newValue ===''){
        console.log('ignore this change')
      }else if((projectByRoute[keys[i]]!== newValue)) {
        const attr = keys[i];
        if(editedAttrs[attr]) {
          if(editedAttrs[attr].oldVal) {
            if(editedAttrs[attr].oldVal === newValue) {
              delete editedAttrs[attr];
            }else{
              editedAttrs[attr].newVal = newValue
            }        
          }else {
            editedAttrs[attr].oldVal = projectByRoute[attr]
            editedAttrs[attr].newVal = newValue
          }
        }else{
          editedAttrs[attr] ={};
          editedAttrs[attr].oldVal = projectByRoute[attr];
          editedAttrs[attr].newVal = newValue;
        }
      }
    }
   
    
    return editedAttrs
  }
  handleChangeDomain (event, newValue, type) {
    
    
    const {pocItems} = this.props;
    const val = newValue;
    let obj
    if(val) {
      if(type && type==='projectManager') {
        const projectManagerObj = find(pocItems,{id: val.value});
        const projectManager={
          value: projectManagerObj.id,
          label: `${projectManagerObj.lastName}, ${projectManagerObj.firstName}`
        };
        obj={
          projectManager:val.value,
          projectManagerOption:projectManager
        };
      }else{
        const technicalLeadObj = find(pocItems,{id: val.value});
        const technicalLead={
          value: technicalLeadObj.id,
          label: `${technicalLeadObj.lastName}, ${technicalLeadObj.firstName}`
        };
        obj={
          technicalLead:val.value,
            technicalLeadOption:technicalLead
          };
      }
      
    }else{
      obj={
        [type]:null,
        [`${type}Option`]:null
      }
     
    }
    this.setState(
      obj
    );
    
  }
  handleChange (event) {
    const attr = event.target.name
   
    let val = event.target.value;
    if(attr === 'numberCADDrawings') {
      val= !isNaN(parseInt(event.target.value,10)) ? parseInt(event.target.value,10) : 0
    }
    this.setState(
      {
        [attr]: val
      }
    );
  }
  handleChangeBool  = params => event =>{
    const attr = event.target.name;    
    const currVal = this.state[attr];
    const val  = currVal===1 ? 0 :1;
    
    if(params) {
      const {activityItems}= this.state
      const idx = findIndex(activityItems, {id: params.id});
      activityItems[idx].show = params.show===0 ? 1 :0;
      activityItems[idx].changed= activityItems[idx].changed === true ? false: true;      
      this.setState({activityItems})
      
    }else{
      this.setState(
        {
          [attr]: val, 
        }
      );
    }  
    
  }
  startEditing() {
    const {activityItems, projectByRoute} = this.props;
    const newState = {
      projectId:projectByRoute.id,
      editing:true,       
      p2Id:projectByRoute.p2Id,
      assumptions:projectByRoute.assumptions,
      deliverables:projectByRoute.deliverables,
      descriptiveName:projectByRoute.descriptiveName,
      hasCAD:projectByRoute.hasCAD,
      hasGIS:projectByRoute.hasGIS,
      hasWM:projectByRoute.hasWM,
      engSurveyKTRSupport:projectByRoute.engSurveyKTRSupport,
      name:projectByRoute.name,
      numberCADDrawings:projectByRoute?.numberCADDrawings  === 0 || projectByRoute?.numberCADDrawings ? projectByRoute?.numberCADDrawings: 0,
      objectives:projectByRoute.objectives,
      projectManager:projectByRoute.projectManager,
      projectManagerOption:projectByRoute.projectManager ? {value:projectByRoute.projectManager, label:projectByRoute.projectManagerName} : null,
      projectManagerName:projectByRoute.projectManagerName || "",
      pdtMember:projectByRoute.pdtMember || "",
      scope:projectByRoute.scope,
      technicalLead:projectByRoute.technicalLead ,
      technicalLeadOption:projectByRoute.technicalLead ? {value:projectByRoute.technicalLead, label:projectByRoute.technicalLeadName} : null,
      technicalLeadName:projectByRoute.technicalLeadName || "",
      changeHistoryId:projectByRoute.changeHistoryId,  
      locked:projectByRoute.locked,  
      activityItems
    };
    this.setState(newState)
  }

  stopEditing() {
    const editedAttrs= this.getEditedVal();
    const {activityItems, doProjectBulkSave, doActivityBulkSave, projectByRoute} = this.props;
    const activityChanged =[];
    const showArr =[];
    for(let i=0;i<activityItems.length;i++) {
      if(activityItems[i].changed) {
        activityChanged.push(activityItems[i]);
      }
    }

    const notification = {
      project: Object.keys(editedAttrs).length === 0,
      activity: !(Object.keys(editedAttrs).length === 0 && activityChanged.length > 0) ,
    }

    if(Object.keys(editedAttrs).length>0) {
      const postAttrs ={}
      postAttrs.table='Project';
      postAttrs.changeHistoryId=projectByRoute.changeHistoryId
      postAttrs.changes=editedAttrs;
      doProjectBulkSave(postAttrs, projectByRoute.id, { hide_notification: notification.project })
    }
    if(activityChanged.length>0) {
      const postAttrs ={}
      for(let i=0;i<activityChanged.length;i++) {
        showArr.push({show:{table:'Activity', id:activityChanged[i].id,changeHistoryId:activityChanged[i].changeHistoryId , newVal:activityChanged[i].show, oldVal:activityChanged[i].show===1? 0 : 1 }})
      }
      postAttrs.table='Activity';
      postAttrs.changes=showArr;
      doActivityBulkSave(postAttrs, projectByRoute.id, { hide_notification: notification.activity })
    }
    

    this.setState({
      editing:false, 
      oldState:null
    
    })
  }

  cancelEditing() {
    const {activityItems} = this.props;
    for(let i=0;i<activityItems.length;i++) {
      if(activityItems[i].changed) {
        activityItems[i].changed = false;
        activityItems[i].show =activityItems[i].show=== true ? false: true;
      }
    }
    const newState =  {
      editing:false,
      p2Id:null,
      assumptions:null,
      descriptiveName:null,
      hasCAD:null,
      hasGIS:null,
      hasWM:null,
      engSurveyKTRSupport:null,
      name:null,
      numberCADDrawings:0,
      objectives:null,
      projectManager:null,
      projectManagerOption:null,
      pdtMember:null,
      scope:null,
      technicalLead:null,
      technicalLeadOption:null,
      activityItems: activityItems,
      changeHistoryId: null
    };
   
    this.setState(newState)
  }

  renderEditButtons() {
    const { editing } = this.state;
    const { projectByRoute } = this.props;

    let content= (
      <>
        {projectByRoute?.locked ? (
          <>
          <RoleFilter allowRoles={[`APP.ADMIN`, `:ORG.ADMIN`]}>
            <Button variant="contained" disabled={projectByRoute?.id ? false : true} onClick={this.startEditing}>Edit</Button>
          </RoleFilter>
          <Chip icon={<LockIcon />} sx={{ml:1}} label="LOCKED" variant="outlined" />
          </>
        ):(
          <Button variant="contained" disabled={projectByRoute?.id ? false : true} onClick={this.startEditing}>Edit</Button>
        )}
      </>
    )
    if(editing) {
      content= (
        <>
          <Button color="success" variant="outlined" onClick={this.cancelEditing}>Cancel</Button>
          <Button startIcon={<SaveIcon />} color="success" variant="contained" onClick={this.stopEditing}><span>Save</span></Button>
        </>
      )
    }
    return (<Stack sx={{py: 1.5}} direction="row" spacing={1.5}>{content}</Stack>)
  }
  
  getSettings() {
    const {editing} = this.state;
    const {activityItems, projectByRoute, pocItems} = this.props

    let obj={};
    if( editing) {
      const {
        p2Id,
        assumptions,
        descriptiveName,
        hasCAD,
        hasGIS,
        hasWM,
        engSurveyKTRSupport,
        name,
        numberCADDrawings,
        objectives,
        projectManagerName,
        pdtMember,
        scope,
        deliverables,
        projectManagerOption,
        technicalLeadOption,
        changeHistoryId
      }=this.state;
      obj.p2Id=p2Id
      obj.editing= editing
      obj.assumptions= assumptions
      obj.descriptiveName=descriptiveName
      obj.hasCAD=hasCAD
      obj.hasGIS= hasGIS
      obj.hasWM=hasWM
      obj.engSurveyKTRSupport=engSurveyKTRSupport
      obj.name=name
      obj.numberCADDrawings=numberCADDrawings
      obj.objectives=objectives
      obj.projectManagerName=projectManagerName
      obj.projectManagerOption=projectManagerOption
      obj.pdtMember=pdtMember
      obj.scope=scope
      obj.deliverables=deliverables
     
      obj.technicalLeadOption= technicalLeadOption
      obj.activityItems = activityItems
      obj.changeHistoryId= changeHistoryId

    }else if(projectByRoute) {
        const {      
          p2Id,
          assumptions,
          descriptiveName,
          hasCAD,
          hasGIS,
          hasWM,
          engSurveyKTRSupport,
          name,
          numberCADDrawings,
          objectives,
          projectManagerName,
          projectManager,
          technicalLead,
          technicalLeadName,
          pdtMember,
          scope,
          deliverables,
          changeHistoryId
        }=projectByRoute;
        obj.p2Id=p2Id
        obj.editing = editing
        obj.assumptions= assumptions
        obj.descriptiveName=descriptiveName
        obj.hasCAD=hasCAD
        obj.hasGIS= hasGIS
        obj.hasWM=hasWM
        obj.engSurveyKTRSupport=engSurveyKTRSupport
        obj.name=name
        obj.numberCADDrawings=numberCADDrawings
        obj.objectives=objectives
        obj.projectManagerName=projectManagerName
        obj.projectManagerOption=projectManager ? {value:projectManager, label:projectManagerName} : null;
        obj.pdtMember=pdtMember
        obj.scope=scope
        obj.deliverables=deliverables
        obj.technicalLeadOption=  technicalLead ? {value:technicalLead, label:technicalLeadName} : null;
        obj.activityItems = activityItems;
        obj.changeHistoryId= changeHistoryId;
      }else{
        obj.editing = editing
      }
      
    
    let pocOptions =[]
    if(pocItems && pocItems.length>0) {
      pocOptions = pocItems.map(d => {
        return {
          value: d.id,
          label: `${d.lastName}, ${d.firstName}`
        };
      });
    }
    obj.pocOptions=pocOptions
    return obj
  }
  renderSchema() {
    
    const {      
      p2Id,
      assumptions,
      descriptiveName,
      hasCAD,
      hasGIS,
      hasWM,
      engSurveyKTRSupport,
      name,
      numberCADDrawings,
      objectives,
      projectManagerOption,
      pdtMember,
      scope,
      deliverables,
      technicalLeadOption,
      activityItems,
      pocOptions,
      editing,
      changeHistoryId
    }=this.getSettings();
    const { projectIsSaving, projectIsLoading, activityIsSaving, activityIsLoading } = this.props

    if(!(projectIsSaving || projectIsLoading)) {
      
      if(p2Id){
        return(
          <Box>
              <Typography variant="h6" >
                Project Information
              </Typography>
              <div>
                    {this.renderEditButtons()}
              </div>
                <Box sx={{ margin:'2em' }}>
                <div style={{display:'flex', flexDirection:'row', gap: "10px 20px"}} >
                  <div style={{display:'flex', flexDirection:'column', flex:2}} >
                    <TextFieldInput componentName="project-settings" table="Project" changeHistoryId={changeHistoryId} attr="p2_id" value={p2Id} editing={false} label="P2 Id: "  onChange={this.handleChange} name="p2Id"/>
                    <TextFieldInput componentName="project-settings" table="Project" changeHistoryId={changeHistoryId} attr="project_name" value={name} editing={false} label="Project Name: "  onChange={this.handleChange} name="name"/>
                    <TextFieldInput componentName="project-settings" table="Project" changeHistoryId={changeHistoryId} attr="descriptive_name" value={descriptiveName} editing={editing} label="Project Descriptive Name: "  onChange={this.handleChange} name="descriptiveName"/>
                    
                    <AutocompleteFieldInput
                      componentName="project-settings" 
                      table="Project" 
                      changeHistoryId={changeHistoryId} 
                      attr="project_manager" 
                      value={projectManagerOption} 
                      editing={editing} 
                      label="Project Manager: "  
                      handleChange={(event,value) =>this.handleChangeDomain(event, value, 'projectManager')}
                      options={pocOptions}
                      name="projectManager"
                    /> 
                    <AutocompleteFieldInput
                      componentName="project-settings" 
                      table="Project" 
                      changeHistoryId={changeHistoryId} 
                      attr="technical_lead" 
                      value={technicalLeadOption} 
                      editing={editing} 
                      label="Technical Lead: "  
                      handleChange={(event,value) =>this.handleChangeDomain(event, value, 'technicalLead')}
                      options={pocOptions}
                      name="technicalLead"
                    /> 
                  
                  </div>
                  
                  <div style={{display:'flex', flexDirection:'column', flex:1}} >
                    <CheckBoxFieldInput componentName="project-settings" table="Project" changeHistoryId={changeHistoryId} attr="has_gis" value={hasGIS} type={"boolean"} editing={editing} label="EGIS Will be Used: "  onChange={this.handleChangeBool()} name="hasGIS" />
                    <CheckBoxFieldInput componentName="project-settings" table="Project" changeHistoryId={changeHistoryId} attr="has_wm" value={hasWM} type={"boolean"} editing={editing} label="Water Modeling Will be Used: "  onChange={this.handleChangeBool()} name="hasWM" />
                    <CheckBoxFieldInput componentName="project-settings" table="Project" changeHistoryId={changeHistoryId} attr="has_cad" value={hasCAD} type={"boolean"} editing={editing} label="CAD Will be Used: "  onChange={this.handleChangeBool()} name="hasCAD" />
                    <CheckBoxFieldInput componentName="project-settings" table="Project" changeHistoryId={changeHistoryId} attr="eng_survey_ktr_support" value={engSurveyKTRSupport} type={"boolean"} editing={editing} label="Eng/Survey-KTR Support: "  onChange={this.handleChangeBool()} name="engSurveyKTRSupport" />
                    <GenericFieldInput componentName="project-settings" table="Project" type="number" changeHistoryId={changeHistoryId} attr="number_cad_drawings" min="0" value={!isNaN(parseInt(numberCADDrawings,10)) ? parseInt(numberCADDrawings,10): 0} editing={editing} label="Number of CAD Drawings: "  onChange={this.handleChange} name="numberCADDrawings"/>            
                    
                  </div>
                  
                  </div>
                  <div>
                    <TextFieldMultiInput componentName="project-settings" table="Project" changeHistoryId={changeHistoryId} attr="pdt_member" type={"large_text"} value={pdtMember} editing={editing} label="PDT Member: "  onChange={this.handleChange} name="pdtMember"/>
                    <TextFieldMultiInput componentName="project-settings" table="Project" changeHistoryId={changeHistoryId} attr="scope" type={"large_text"} value={scope} editing={editing} label="Scope: "  onChange={this.handleChange} name="scope"/>
                    <TextFieldMultiInput componentName="project-settings" table="Project" changeHistoryId={changeHistoryId} attr="assumptions" type={"large_text"} value={assumptions} editing={editing} label="Assumptions: "  onChange={this.handleChange} name="assumptions"/>
                    <TextFieldMultiInput componentName="project-settings" table="Project" changeHistoryId={changeHistoryId} attr="objectives" type={"large_text"} value={objectives} editing={editing} label="Objectives: "  onChange={this.handleChange} name="objectives"/>
                    <TextFieldMultiInput componentName="project-settings" table="Project" changeHistoryId={changeHistoryId} attr="deliverables" type={"large_text"} value={deliverables} editing={editing} label="Deliverables: "  onChange={this.handleChange} name="deliverables"/>
                </div>
                </Box>

                {!(activityIsSaving || activityIsLoading) ? (
                  <>
                <Typography variant="h6" >
                Activity Information
            </Typography> 
            <div style={{ display: 'flex'}}>
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  autoHeight 
                  rows={activityItems || []} 
                  columns= {[
                    {
                      field: 'show',
                      headerName: 'Show',
                      
                      renderCell: (params) => (
                        <strong>
                        
                          <Checkbox
                            variant="contained"
                            color="primary"
                            size="small"
                            onChange={this.handleChangeBool(params.row)}
                            disabled={!editing} 
                            checked= {params.value === 1 ? true : false }
                            style={{ marginLeft: 16 }}
                          >
                            Show
                          </Checkbox>
                        </strong>
                      ),
                    },
                    {
                      field: 'id',
                      headerName: 'ID',
                      flex:1,
                        
                    },
                    {
                      field: 'activity_number',
                      headerName: 'Activity Id',
                      flex:1,
                        
                    },
                    {
                      field: 'wbs',
                      headerName: 'WBS',
                        
                    },
                    {
                      field: 'wbsName',
                      headerName: 'WBS Name',
                  
                          
                    },
                    {
                      field: 'activity_name',
                      headerName: 'Name',
                      flex:2,
                      minWidth: 300   
                    },
                    {
                      field: 'startDate',
                      headerName: 'Start Date',
                        
                    },
                    {
                      field: 'endDate',
                      headerName: 'End Date',
                        
                    },
                    
                  ]}
                />
              </div>
            </div>
            </>
                ) : (
                  <>        
                    <Typography variant="h6" >
                        Activity Information
                    </Typography> 
                    <Skeleton variant="text" />
                  </>
                )}
          </Box>
        )
      }

      return(
        <Typography sx={{ textAlign: 'center' }} variant="h6" >
          No project data was found.
        </Typography>
      )
    }else{
      return (
        <Box>        
          <Typography variant="h6" >
            Project Information
          </Typography>
          <div>
            {this.renderEditButtons()}
          </div>
            <Box sx={{ margin:'2em',display:'flex-column' }}>
              <Skeleton variant="text" />
            </Box>
            <Typography variant="h6" >
                Activity Information
            </Typography> 
            <Skeleton variant="text" />
        </Box>
      )
    }
  }

  
  backToProject() {
    const { doUpdateUrlWithHomepage, orgsByRoute, fySelectedYear } = this.props;
    doUpdateUrlWithHomepage(`/${orgsByRoute.slug}/${fySelectedYear}/projectSetup`);
  }
  render() {
   
    const  schema =this.renderSchema();
    return (
      <RoleFilter allowRoles={[`APP.ADMIN`, `:ORG.ADMIN`, `:ORG.TECH_LEAD`]}>
      <div>
         <Paper style={{padding:'2em', minWidth:'960px'}}>
        <Item >
          <Typography variant="h4"component="div">Project Configuration</Typography>
        </Item>
        <div>
          <Button startIcon={<ArrowBackIcon />} onClick={this.backToProject}>            
            Back            
          </Button>
        </div>
          {schema}
          
          </Paper>
        </div>
        </RoleFilter>
    );
  }
}

export default connect(
    "doUpdateUrlWithHomepage",
    "selectOrgsByRoute",
    "selectRouteParams",
    "selectProjectByRoute",
    "selectActivityByRoute",
    "doProjectFetch",
    "doProjectBulkSave",
    "doActivityBulkSave",
    "doActivityBulkSave",
    "selectPocItems",
    "selectActivityItems",
    "selectProjectIsSaving",
    "selectProjectIsLoading",
    "selectActivityIsSaving",
    "selectActivityIsLoading",
    "doPocFetch",
    "doActivityFetch",
    "selectFySelectedYear",
    ProjectSetupDetails
);
