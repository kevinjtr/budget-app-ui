
import Paper from '@mui/material/Paper';
import Typography from "@mui/material/Typography";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import RoleFilter from '../../containers/context-providers/role-filter';
import OrgFiscalYear from "./org-fiscal-year"

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.primary.main,  
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.primary.contrastText,
  marginBottom:theme.spacing(4)
}));

function FiscalYearSettings () {
    return (
      <RoleFilter allowRoles={[`APP.ADMIN`, `:ORG.ADMIN`]}>
      <div>
        <Paper style={{padding:'2em', minWidth:'960px'}}>
            <Item >
                <Typography variant="h4"component="div">Fiscal Year Settings</Typography>
            </Item>
            <Box>
            {/* <Typography variant="h4"component="div">Lock or Unlock Projects</Typography> */}
            {/* <TransferList changes={changes} setChanges={setChanges}/> */}
            <OrgFiscalYear/>
            </Box>
        </Paper>
        </div>
        </RoleFilter>
    );
}

export default FiscalYearSettings;
