import React from "react";
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import { connect } from "redux-bundler-react";
import DrawerItemsOpen from "./drawer-items-open";
import {drawerItemsConfig} from "./drawerItemsConfig";
import RoleFilter from "../context-providers/role-filter";
import { v4 as uuidv4 } from 'uuid';
import { ConstructionOutlined } from "@mui/icons-material";

const drawerWidth = 240;

class DrawerContent extends React.Component {

  render() {
    const {
      orgsByRoute,
      pathnameMinusHomepage,
      fySelectedYear,
      orgsActiveSlug,
    } = this.props;

    const orgActive = orgsByRoute.slug.toUpperCase();
    const lCaseOrgActive = orgActive.toLowerCase();

    const drawerItems = drawerItemsConfig(fySelectedYear).map((item, index) => {
      if (item.isDivider) {
        return(
        <RoleFilter key={uuidv4()} allowRoles={item.allowedRoles}>
          <Divider key={`drawer-divider-${index}`} />
        </RoleFilter>
        )
      }

      if (item.itemType === "subheader") {
          return (
            <RoleFilter key={uuidv4()} allowRoles={item.allowedRoles}>
              <ListSubheader key={`list-subheader-${index}`}>
                {`${item.title} (${orgActive})`}
              </ListSubheader>
            </RoleFilter>
          );
        }

      const url = `/${lCaseOrgActive}${item.url}`;
      const pathMinusOrg = pathnameMinusHomepage.replace(`/${lCaseOrgActive}`,'')

      let isSelected = false

      if(item.regex?.length){

        item.regex.map(r => {
          const regex = new RegExp(r)

          const match = regex.test(pathMinusOrg)
  
          if(match || pathnameMinusHomepage == url){
            isSelected = true
          }
        })
        
      }else{
        isSelected = pathnameMinusHomepage == url
      }

      if(item?.allowedOrgs?.length > 0){
        if(item.allowedOrgs.includes(`/${orgsActiveSlug}`)){
          return(
            <RoleFilter key={uuidv4()} allowRoles={item.allowedRoles}>
              <DrawerItemsOpen
                selected={isSelected}
                icon={<item.icon />}
                url={url}
                title={item.title}
                idx={index}
              />
            </RoleFilter>
          )
        }

        return null
      }else{
        return (
          <RoleFilter key={uuidv4()} allowRoles={item.allowedRoles}>
            <DrawerItemsOpen
              selected={isSelected}
              icon={<item.icon />}
              url={url}
              title={item.title}
              idx={index}
            />
          </RoleFilter>
        )
      }
    });

    return(
      <MuiDrawer variant="permanent" anchor="left" sx={{
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        '& .MuiDrawer-paper':{
          overflowX:'hidden',
          top:65,
          height: "calc(100% - 75px)",
        }
      }}>
        <Box sx={{width: drawerWidth}}>
          {drawerItems}
        </Box>
      </MuiDrawer>
    )
  }
}

export default connect(
  "selectIsLoggedIn",
  "selectUiSidebarShow",
  "doUiToggleSidebarShow",
  "selectOrgsByRoute",
  "selectPathnameMinusHomepage",
  "selectFySelectedYear",
  "selectOrgsActiveSlug",
  DrawerContent
);