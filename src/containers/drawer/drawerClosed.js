import React from "react";
//import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
// import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
//import ListSubheader from '@mui/material/ListSubheader';
import { connect } from "redux-bundler-react";
import DrawerItemsClosed from "./drawer-items-closed";
import {drawerItemsConfig} from "./drawerItemsConfig";
import RoleFilter from "../context-providers/role-filter";
import { v4 as uuidv4 } from 'uuid';
import { matchRoutes } from "react-router-dom";
const drawerWidth = 70;
// const openedMixin = (theme) => ({
//   //width: drawerWidth,
//   transition: theme.transitions.create('width', {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.enteringScreen,
//   }),
//   overflowX: 'auto',
// });

// const closedMixin = (theme) => ({
//   transition: theme.transitions.create('width', {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   overflow: 'auto',
//   width: `calc(${theme.spacing(7)} + 1px)`,
//   [theme.breakpoints.up('sm')]: {
//     width: `calc(${theme.spacing(8)} + 1px)`,
//   },
// });
// const Drawer = styled(MuiDrawer)(
//   ({ theme }) => ({
    
//     //boxSizing: 'border-box',
//     // ...(open && {
//     //   ...openedMixin(theme),
//     //   '& .MuiDrawer-paper': openedMixin(theme),
//     // }),
//     // ...(!open && {
//     //   ...closedMixin(theme),
//     //   '& .MuiDrawer-paper': closedMixin(theme),
//     // }),
//   }),
// );

class DrawerContent extends React.Component {
  //constructor(props) {
   // super(props);
    // this.state = {
    //   selectedIndex: 0,
    // };
    // this.handleListItemClick = this.handleListItemClick.bind(this);
  //}

  // handleListItemClick(event, index) {
  //   this.setState({ selectedIndex: index });
  // }

  render() {
    const {
      // doUiToggleSidebarShow,
      //uiSidebarShow: open,
      //isLoggedIn,
      orgsByRoute,
      pathnameMinusHomepage,
      fySelectedYear,
      orgsActiveSlug,
    } = this.props;

    // const { selectedIndex } = this.state;
    //if (!isLoggedIn) return null;
    const orgActive = orgsByRoute.slug.toUpperCase();
    const lCaseOrgActive = orgActive.toLowerCase();

    const drawerItems = drawerItemsConfig(fySelectedYear).map((item, index) => {
      const isFirstSubHeaderItem = (index ? drawerItemsConfig(fySelectedYear)[index - 1].itemType === "subheader"  : true)

      if (item.isDivider) {
        return(
        <RoleFilter key={uuidv4()} allowRoles={item.allowedRoles}>
          <Divider key={`drawer-divider-${index}`} />
        </RoleFilter>
        )
      }

      if (item.itemType === "subheader") {
          return null;
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

      const title = item.alternateTitle ? item.alternateTitle : item.title;

      if(item?.allowedOrgs?.length > 0){
        if(item.allowedOrgs.includes(`/${orgsActiveSlug}`)){
          return(
            <RoleFilter key={uuidv4()} allowRoles={item.allowedRoles}>
              <DrawerItemsClosed
              {...(isFirstSubHeaderItem && { sx: { mt: 5 } })}
                selected={isSelected}
                icon={<item.icon />}
                url={url}
                title={title}
                idx={index}
              />
            </RoleFilter>
          )
        }

        return null
      }else{
        return (
          <RoleFilter key={uuidv4()} allowRoles={item.allowedRoles}>
            <DrawerItemsClosed
              selected={isSelected}
              {...(isFirstSubHeaderItem && { sx: { mt: 5 } })}
              icon={<item.icon />}
              url={url}
              title={title}
              idx={index}
            />
          </RoleFilter>
        )
      }
    });

      // return (
      //   <RoleFilter key={uuidv4()} allowRoles={item.allowedRoles}>
      //     <DrawerItemsClosed
      //       selected={isSelected}
      //       {...(isFirstSubHeaderItem && { sx: { mt: 5 } })}
      //       //handleListItemClick={this.handleListItemClick}
      //       icon={<item.icon />}
      //       url={url}
      //       title={title}
      //       idx={index}
      //       //alternateTitle={alternateTitle}
      //     />
      //   </RoleFilter>
      // );
    //});

    return(
      <MuiDrawer variant="permanent" anchor="left" sx={{
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        '& .MuiDrawer-paper': {
          overflowX:'hidden',
          top:65,
          height: "calc(100% - 75px)",
        },
      }}>
        {/* <Toolbar /> */}
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