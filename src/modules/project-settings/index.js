
import * as React from "react";
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
import TransferList from "./transfer-list.tsx"
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { height } from "@mui/system";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.primary.main,  
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.primary.contrastText,
  marginBottom:theme.spacing(4)
}));

function ProjectSettings ({projectItems}) {
   const [loading, setLoading] = React.useState(false)
   const [changes, setChanges] = React.useState([])

   React.useEffect(()=> {
       if(loading){
        setTimeout(()=>{
            setLoading(prev => !prev)
        },3000)
       }
   },[loading])

    return (
      <RoleFilter allowRoles={[`APP.ADMIN`, `:ORG.ADMIN`]}>
      <div>
        <Paper style={{padding:'2em', minWidth:'960px'}}>
            <Item >
                <Typography variant="h4"component="div">Project Settings</Typography>
            </Item>
            <Box>
            <Typography variant="h4"component="div">Lock or Unlock Projects</Typography>
            <TransferList changes={changes} setChanges={setChanges}/>
            <Box sx={{
                textAlign:"center",
                pt:5,
            }}>
            <LoadingButton 
                //onClick={()=>console.log(projectByRoute)}
                disabled={!changes.length}
                loading={loading}
                loadingPosition="end"
                sx={{ width: 150}}
                variant="contained"
                endIcon={<SaveIcon />}>
                Save
            </LoadingButton>
            </Box>
            </Box>
        </Paper>
        </div>
        </RoleFilter>
    );
}

export default ProjectSettings;
