
import React from "react";
import { connect } from "redux-bundler-react";
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import DataGrid from '../../components/data-grid';
import RoleFilter from '../../containers/context-providers/role-filter';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {StatusLockedOperators} from '../../tools/data-grid-column-filters'
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {red} from '@mui/material/colors';

const Actions = (props) => {
  const {params, setProject} = props
  return(
    <IconButton  onClick={() => setProject(params.row)} sx={{color:red['200'], '&:hover':{backgroundColor: red['200'], color:'background.default'}}}title="Open Project">
      <OpenInNewIcon/>
    </IconButton>
  )
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.primary.main,
  
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.primary.contrastText,
  marginBottom:theme.spacing(4)
}));



class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      columns : [
        {
          field: 'actions',
          type: 'actions',
          renderCell: (params) => <Actions {...{params, setProject: this.setProject}}/>,
          sortable: false,
          filterable: false,
        },   
        { field: 'id', headerName: 'ID', type:"number", flex:1},
        { field: 'p2Id', headerName: 'P2 ID', flex:1 },
        { field: 'name', headerName: 'Project Name', flex:2 },
        { field: 'descriptiveName', headerName: 'Descriptive Project Name', flex:2  },
        { field: 'projectManagerName', headerName: 'Project Manager', flex:1 },
        { field: 'technicalLeadName', headerName: 'Technical Lead', flex:1 },
        { field: 'locked', headerName: 'Status', flex:1, filterOperators: StatusLockedOperators, renderCell: (obj) => (
          <Stack direction="row" alignItems="center" gap={1}>
          {obj.value ? <><LockIcon/>Locked</> : <><LockOpenIcon/>Open</>}
          </Stack>
        )}
      ]
    }
    this.setProject = this.setProject.bind(this);
  }
  componentDidMount() {
    const { doProjectFetch,  projectItems} = this.props;
    if(projectItems && projectItems.length>0) {
        return
    }else{
        doProjectFetch()
    }
       
  }
  setProject(row) {
    const { doUpdateUrlWithHomepage, orgsByRoute, fySelectedYear } = this.props;
    doUpdateUrlWithHomepage(`/${orgsByRoute.slug}/${fySelectedYear}/projectSetup/${row.id}`);
  }
  render() {
    

    const { projectItems, projectIsLoading } = this.props;
    
    return (
      <RoleFilter allowRoles={[`APP.ADMIN`, `:ORG.ADMIN`, `:ORG.TECH_LEAD`]}>
      <div>
         <Paper style={{padding:'2em', minWidth:'960px', minHeight:"300px"}}>
        <Item >
          <Typography variant="h4"component="div">Project Configuration</Typography>
        </Item>
          <Box>
        
        <Typography variant="subtitle"component="div">Double Click Row to Open Project</Typography>
        <div style={{ display: 'flex'}}>
          <div style={{ flexGrow: 1 }}>
            <DataGrid              
              autoHeight  
              columns={this.state.columns}               
              rows={projectItems} 
              onRowDoubleClick={this.setProject}
              loading={projectIsLoading}
              />
            </div>
          </div>
        
        </Box>
      </Paper>
      </div>
      </RoleFilter>
    );
  }
}

export default connect(
    "doUpdateUrl",
    "selectOrgsByRoute",
    "selectProjectItems",
    "selectProjectIsLoading",
    'doProjectFetch',
    "doUpdateUrlWithHomepage",
    "selectFySelectedYear",
    Project
);
