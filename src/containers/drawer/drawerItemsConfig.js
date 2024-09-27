// Drawer Config file added to make modifying the drawer easier.
//Be sure to add differnt configurations in the order you want them rendered

//Import Icon for each link here
import GroupsIcon from '@mui/icons-material/Groups';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import EngineeringIcon from '@mui/icons-material/Engineering';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
//import { connect } from "redux-bundler-react";

export const drawerItemsConfig = (fySelectedYear) => [

    {
        itemType: "subheader",
        title: "Organization",
        allowedRoles:["APP.ADMIN", ":ORG.*"]
    },
    {
      title: "Dashboard",
      icon: DashboardIcon,
      url: ``,
      allowedRoles: ["APP.ADMIN", ":ORG.*"],
    },
    {
      title: "Enter / View Budget",
      alternateTitle: "Enter Budget",
      icon: WarehouseIcon,
      url: `/${fySelectedYear}/project`,
      //`^(?=.*(?:[A-Za-z0-9]+))(?!.*(?://reports))`

      regex: [`^(?!reports$).*\/project\/[A-Za-z0-9]+`,`\/^(?!reports$).*\/project(?!Setup)`],
      allowedRoles: ["APP.ADMIN", ":ORG.*"],
    },
    {
       isDivider: true,
       allowedRoles: ["APP.ADMIN", ":ORG.*"],
    },
    {
        itemType: "subheader",
        title: "Reports",
        allowedRoles: ["APP.ADMIN", ":ORG.*"],

    },
    {
        title: "Request",
        icon: AssessmentIcon,
        url: `/${fySelectedYear}/reports/export`,
        regex: [`/[A-Za-z0-9]+/reports/export`],
        allowedRoles: ["APP.ADMIN", ":ORG.*"],
      },    
      {
        title: "Org Filtered",
        icon: AssessmentIcon,
        url: `/${fySelectedYear}/reports/org`,
        regex: [`/[A-Za-z0-9]+/reports/org`],
        allowedRoles: ["APP.ADMIN", ":ORG.*"],
      },    
      {
        title: "Project Filtered",
        icon: AssessmentIcon,
        url: `/${fySelectedYear}/reports/project`,
        regex: [`[A-Za-z0-9]+/reports/project(?!Setup)`],
        allowedRoles: ["APP.ADMIN", ":ORG.*"],
      },
      {
        isDivider: true,
        allowedRoles: ["APP.ADMIN", ":ORG.ADMIN", ":ORG.TECH_LEAD"],
      },
      {
        itemType: "subheader",
        title: "Settings",
        allowedRoles: ["APP.ADMIN", ":ORG.ADMIN", ":ORG.TECH_LEAD"],
      },    
      {
        title: "Project Setup",
        icon: EngineeringIcon,
        url: `/${fySelectedYear}/projectSetup`,
        regex: [`[A-Za-z0-9]+/projectSetup/[A-Za-z0-9]+`,`[A-Za-z0-9]+/projectSetup`],
        allowedRoles: ["APP.ADMIN", ":ORG.ADMIN", ":ORG.TECH_LEAD"],
      },
      {
        title: "Taxes",
        icon: AttachMoneyIcon,
        url: `/${fySelectedYear}/taxes`,
        regex: [`[A-Za-z0-9]+/taxes`],
        allowedRoles: ["APP.ADMIN", ":ORG.ADMIN"],
      },    
      {
        title: "FY Settings",
        icon: AdminPanelSettingsIcon,
        url: `/fiscalYearSettings`,
        allowedRoles: ["APP.ADMIN", ":ORG.ADMIN"],
      },    
      {
        title: "Org Members",
        icon: GroupsIcon,
        url: `/users`,
        allowedRoles: ["APP.ADMIN", ":ORG.ADMIN"],
      },
      {
        title: "Admin Tools",
        icon: SupervisedUserCircleIcon,
        url: `/admintools`,
        allowedOrgs: ['/app'],
        allowedRoles: ["APP.ADMIN"],
      },
  ];