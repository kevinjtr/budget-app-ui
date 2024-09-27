
import React from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import { connect } from "redux-bundler-react";
import RoleFilter from "../context-providers/role-filter";
import Toolbar from '@mui/material/Toolbar';

import Divider from '@mui/material/Divider';

import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';


import GroupsIcon from '@mui/icons-material/Groups';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import EngineeringIcon from '@mui/icons-material/Engineering';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DrawerItems from './drawer-items';
import DrawerClosed from './drawerClosed'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const drawerWidth = 240;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);


  class DrawerContent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        selectedIndex:0
      };
      this.handleListItemClick= this.handleListItemClick.bind(this);
    }
    
    handleListItemClick(event, index) {
      this.setState({selectedIndex:index})
    };
    render() {
      const {
        doUiToggleSidebarShow,
        uiSidebarShow:open, 
        isLoggedIn,
        orgsByRoute,
        pathnameMinusHomepage,
      } = this.props;

      console.log(pathnameMinusHomepage)

      const {selectedIndex} = this.state;
      if (!isLoggedIn) return null;
      const orgActive = orgsByRoute.slug.toUpperCase();
      const lCaseOrgActive = orgActive.toLowerCase();
       if (open) return(
        <Drawer 
          // sx={{
          //   width: drawerWidth,
          //   flexShrink: 0,
          //   [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          // }}
          variant="permanent"
          anchor="left" 
          open={open}
          >
            <Toolbar />
            <Box >
              <ListSubheader sx={{marginRight: 5,...(!open && { visibility: 'hidden' })}}>
                      {`Organization (${orgActive})`}
              </ListSubheader>
              <DrawerItems selected={`/${lCaseOrgActive}` === pathnameMinusHomepage} handleListItemClick={this.handleListItemClick} icon={<DashboardIcon />} url={`/${lCaseOrgActive}`} title={"Dashboard"}  />
              <DrawerItems selected={`/${lCaseOrgActive}/project`.includes(pathnameMinusHomepage) && `/${lCaseOrgActive}` !== pathnameMinusHomepage} handleListItemClick={this.handleListItemClick} icon={<WarehouseIcon />} url={`/${lCaseOrgActive}/project`} title={"Enter / View Budget"} />
              <Divider />    
              <ListSubheader sx={{
                      marginRight: 5,
                      ...(!open && { visibility: 'hidden' }),
                    }}>
                      Reports
                  </ListSubheader>
                  <RoleFilter allowRoles={[`APP.ADMIN`, `:ORG.ADMIN`, `:ORG.TECH_LEAD`, `:ORG.MEMBER`]}>
                    <DrawerItems selected={selectedIndex === 2} idx={2} handleListItemClick={this.handleListItemClick} icon={<AssessmentIcon />} url={`/${lCaseOrgActive}/reports/export`} title={"Request"} />
                    <DrawerItems selected={selectedIndex === 7} idx={7} handleListItemClick={this.handleListItemClick} icon={<AssessmentIcon />} url={`/${lCaseOrgActive}/reports/org`} title={"Org Filtered"} />
                    <DrawerItems selected={selectedIndex === 3} idx={3} handleListItemClick={this.handleListItemClick} icon={<AssessmentIcon />} url={`/${lCaseOrgActive}/reports/project`} title={"Project Filtered"} />
                  </RoleFilter>       
            <RoleFilter allowRoles={[`APP.ADMIN`, `:ORG.ADMIN`, `:ORG.TECH_LEAD`]}>
            <Divider />
              <List>
                <RoleFilter allowRoles={[`APP.ADMIN`, `:ORG.ADMIN`, `:ORG.TECH_LEAD`]}>
                  <ListSubheader sx={{
                      marginRight: 5,
                      ...(!open && { visibility: 'hidden' }),
                    }}>
                      Settings
                  </ListSubheader>
                  
                  <DrawerItems selected={selectedIndex === 4} idx={4} handleListItemClick={this.handleListItemClick} icon={<EngineeringIcon />} url={`/${lCaseOrgActive}/projectSetup`} title={"Project Setup"} />
                  <RoleFilter allowRoles={[`APP.ADMIN`,`:ORG.ADMIN`]}>
                    <DrawerItems selected={selectedIndex === 5} idx={5} handleListItemClick={this.handleListItemClick} icon={<AttachMoneyIcon />} url={`/${lCaseOrgActive}/taxes`} title={"Taxes"} />
                    <DrawerItems selected={selectedIndex === 8} idx={8} handleListItemClick={this.handleListItemClick} icon={<AdminPanelSettingsIcon />} url={`/${lCaseOrgActive}/fiscalYearSettings`} title={"FY Settings"} />
                    <DrawerItems selected={selectedIndex === 7} idx={7} handleListItemClick={this.handleListItemClick} icon={<GroupsIcon />} url={`/${lCaseOrgActive}/users`} title={"Org. Members"} />                  
                  </RoleFilter>
                </RoleFilter>
              </List>
            </RoleFilter>
            </Box>
            
        </Drawer>
        ); else return (
          <DrawerClosed />
        )
    }
}

export default connect(
    "selectIsLoggedIn",
    "selectUiSidebarShow",
    "doUiToggleSidebarShow",
    "selectOrgsByRoute",
    "selectPathnameMinusHomepage",
    DrawerContent
  );