import { createRouteBundle } from "redux-bundler";
import Home from "../components/app-home/home";

import {
  Dashboard,
  Project,
  ProjectBudgetDetails,
  ProjectSetup,
  ProjectSetupDetails,
  ReleaseNotesManager,
  ReportsExport,
  ReportsProject,
  ReportsOrg,
  Taxes,
  Users,
  FiscalYearSettings,
  RoleManager,
  AdminTools,
} from "../modules/route-roots";
import FourOhFour from "../components/four-oh-four";
import ComingSoon from "../components/coming-soon";


export default createRouteBundle(
  {
    "": Home,
    "/": Home,
    "/release-notes": ReleaseNotesManager,
    "/:orgSlug": Dashboard,
    "/:orgSlug/users": Users,
    "/:orgSlug/:fy/taxes": Taxes,
    "/:orgSlug/fiscalYearSettings": FiscalYearSettings,
    "/:orgSlug/:fy/project": Project,
    "/:orgSlug/:fy/project/:projectId": ProjectBudgetDetails,
    "/:orgSlug/:fy/project/:projectId/activity/:orgCode": ProjectBudgetDetails,
    "/:orgSlug/:fy/projectSetup": ProjectSetup,
    "/:orgSlug/:fy/projectSetup/:projectId": ProjectSetupDetails,
    "/:orgSlug/:fy/reports/export":ReportsExport,
    "/:orgSlug/:fy/reports/project":ReportsProject,
    "/:orgSlug/:fy/reports/org":ReportsOrg,
    "/:orgSlug/roles": RoleManager,
    "/:orgSlug/settings": ComingSoon,
    "/:orgSlug/admintools": AdminTools,
    "*": FourOhFour,
  },
  {
    routeInfoSelector: "selectPathnameMinusHomepage",
  }
);

/**
 * Anything behind /:orgSlug must check to see if the user can see that org and if not redirect to '/'
 */
