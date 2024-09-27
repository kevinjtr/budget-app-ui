import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";
import flatten from 'lodash/flatten';
import groupBy from 'lodash/groupBy';
import filter from 'lodash/filter'
import sortBy from "lodash/sortBy";
  // request Objects so that we can abort?
  let fetchReq = null;

export default createRestBundle({
  name: "activityBudget",
  uid: "activity_budget_id",
  prefetch: false,
  persist: false,
  routeParam: null,
  getTemplate: "/orgs/:orgSlug/:fy/:projectId/activitybudget",
  putTemplate: "",
  disallowRoles:[],
  postTemplate: "/orgs/:orgSlug/:fy/:projectId/activitybudget/:item.id",
  bulkPostTemplate: "/orgs/:orgSlug/:fy/:projectId/activitybudget/:item.id",
  deleteTemplate: "",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  forceFetchActions: ["ACTIVITYBUDGET_UPDATE_FINISHED","ACTIVITYBUDGET_SAVE_FINISHED","ACTIVITYBUDGET_EDITING_SAVED"],
  allowNotifications: true,
  addons: {
    selectOrgCodeDomain: createSelector("selectDomainsItemsByGroupOrgCode", (items) => {
      if (!items) return null;
      if(items.BRANCH && items.DIVISION && items.SECTION){
        const newDom = flatten([items.BRANCH,items.DIVISION,items.SECTION]);
        const sortedDom =sortBy(newDom, 'CODE')
        return sortedDom;
      }else{
        return null
      }
      
    }),
    selectActivityBudgetGroupsByOrg: createSelector("selectActivityBudgetItems", (items) => {
      if (!items) return null;
      const newDom = groupBy(items,"org_code");
      return newDom;
    }),
    selectActivityBudgetActive: createSelector("selectActivityBudgetItems", (items) => {
      if (!items) return null;
      const rows = filter(items,{'show':1})
      return rows;
    }),    
  }
});
