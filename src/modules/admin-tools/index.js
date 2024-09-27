import React from "react";
import { connect } from "redux-bundler-react";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import RoleFilter from '../../containers/context-providers/role-filter';
import { styled } from '@mui/material/styles';
import { Button, Tabs, Tab, Box } from "@mui/material";
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import UploadDocumentModal from './upload-document'
import DatabaseLoadHistory from './database-load-history'
import { TabPanel, a11yProps } from '../../components/history/history-config'

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.primary.main,  
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.primary.contrastText,
    marginBottom:theme.spacing(4)
  }));

function AdminTools({doToggleDarkMode, userDarkMode}) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <RoleFilter allowRoles={[`APP.ADMIN`]}>
        <div>
            <Paper style={{padding:'2em', minWidth:'960px', minHeight:"300px"}}>
                <Item >
                    <Typography variant="h4"component="div">Admin Tools</Typography>
                </Item>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, py: 3}}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab key={'admin-tools-tab-0'} label={'Tools'} {...a11yProps(0)}/>
                        <Tab key={'admin-tools-tab-1'} label={'Database Update'} {...a11yProps(1)}/>
                        <Tab key={'admin-tools-tab-2'} label={'Database Load History'} {...a11yProps(2)}/>
                        </Tabs>
                    </Box>
                    <TabPanel key={`tab-panel-0`} value={value} index={0}>
                        <Button title={userDarkMode ? "Enable Light Mode" : "Enable Dark Mode"} sx={{ mr: 1,
                            '&:focus': {
                                outline: 'none',
                                }}} onClick={() => doToggleDarkMode()}>
                            {userDarkMode ? 
                            <Brightness7Icon style={{fontSize:'1rem',marginBottom:'3px',marginRight:'5px'}}/> :
                            <Brightness4Icon style={{fontSize:'1rem',marginBottom:'3px',marginRight:'5px'}}/>}
                            <Typography style={{ fontSize:'.75rem' }}>{userDarkMode ? "Enable Light Mode" : "Enable Dark Mode"}</Typography>
                        </Button>
                    </TabPanel>
                    <TabPanel key={`tab-panel-1`} value={value} index={1}>
                        <UploadDocumentModal />
                    </TabPanel>
                    <TabPanel key={`tab-panel-2`} value={value} index={2}>
                        <DatabaseLoadHistory />
                    </TabPanel>
                </Box>
            </Paper>
        </div>
        </RoleFilter>
    );
}

export default connect(
    "doUpdateUrlWithHomepage",
    "selectOrgsByRoute",
    "selectFySelectedItem",
    "selectProjectItems",
    "selectProjectIsLoading",
    "doProjectFetch",
    "doToggleDarkMode",
    "selectUserDarkMode",
    AdminTools
);
