import {
  composeBundles,
  createCacheBundle,
  createUrlBundle,
} from "redux-bundler";
import cache from "../utils/cache";

import activityBundle from "./activity-bundle";
import activityBudgetBundle from "./activity-budget-bundle";
import aboutBundle from "./about-bundle";
import accessRequestBundle from "./access-request-bundle";
import apiBundle from "./api-bundle";
import appRolesBundle from "./app-roles-bundle";
import authBundle from "./auth-bundle";
import browserBundle from "./browser-bundle";
import domainsCompositeBundle from "./domains-composite-bundle";
import modalDialogBundle from "./modal-dialog-bundle";
import nestedUrlBundle from "./nested-url-bundle";
import notificationBundle from "./notification-bundle";

import budgetLaborBundle from "./budget-labor-bundle";
import budgetNonLaborBundle from "./budget-non-labor-bundle";
import downloadManagerBundle from "./download-manager-bundle";
import pocBundle from "./poc-bundle";
import profileBundle from "./profile-bundle";
import projectBundle from "./project-bundle";
import projectBudgetBundle from "./project-bundle";
import projectNotesBundle from "./project-notes-bundle";
import releaseNotesBundle from "./release-notes-bundle";
import reportBudgetPivotBundle from './report-budget-pivot-bundle';
import reportOrgBundle from './report-org-project-summary-bundle'
import reportOrgProjectAllBundle from './report-org-project-all-bundle';
import reportProjectSummaryBundle from './report-project-summary-bundle'
import reportProjectSummaryR1AR1BDeltaBundle from './report-project-summary-r1ar1b-delta-bundle'
import reportProjectSummaryR1ar1bDeltaActivityBundle from "./report-project-summary-r1ar1b-delta-activity-bundle";
import reportScopeBundle from './report-scope-bundle'
import routeBundle from "./route-bundle";
import taxesBundle from "./taxes-bundle";
import taxCalculationBundle from "./tax-calculation-bundle";
import taxRateBundle from "./tax-rate-bundle";
import uiBundle from "./ui-bundle";
import orgRolesBundle from "./org-roles-bundle";
import orgUsersBundle from "./org-users-bundle";
import orgsBundle from "./orgs-bundle";
import fySettingsBundle from "./fy-settings-bundle";
import fyBundle from "./fy-bundle";
import userPreferences from "./user-preferences-bundle"
import databaseLoadHistory from "./database-load-history-bundle"

export default composeBundles(
  createCacheBundle({
    cacheFn: cache.set,
  }),
  createUrlBundle(),
  activityBundle,
  activityBudgetBundle,
  aboutBundle,
  accessRequestBundle,
  apiBundle,
  appRolesBundle,
  authBundle,
  browserBundle,
  budgetLaborBundle,
  budgetNonLaborBundle,
  domainsCompositeBundle,
  downloadManagerBundle,
  modalDialogBundle,
  nestedUrlBundle,
  notificationBundle,
  projectNotesBundle,
  orgRolesBundle,
  orgUsersBundle,
  orgsBundle,
  pocBundle, 
  projectBundle,
  projectBudgetBundle,   
  profileBundle,
  releaseNotesBundle,
  reportBudgetPivotBundle,
  reportOrgBundle,
  reportOrgProjectAllBundle,
  reportProjectSummaryBundle,
  reportProjectSummaryR1ar1bDeltaActivityBundle,
  reportProjectSummaryR1AR1BDeltaBundle,
  reportScopeBundle,
  routeBundle,
  taxesBundle,
  taxCalculationBundle,
  taxRateBundle,  
  uiBundle,
  fySettingsBundle,
  fyBundle,
  userPreferences,
  databaseLoadHistory
);
