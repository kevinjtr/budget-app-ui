import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
// If you need a specific domain item you can add a new selector here

export default createRestBundle({
  name: "domains",
  uid: "guid",
  prefetch: true,
  staleAfter: 90000,
  persist: false,
  routeParam: null,
  getTemplate: "/domains/composite",
  putTemplate: "",
  postTemplate: "",
  bulkPostTemplate:"",
  deleteTemplate: "",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  forceFetchActions: [
    "DOMAINSEDITABLE_SAVE_FINISHED",
    "DOMAINSEDITABLE_DELETE_FINISHED",
    "PLATFORMS_SAVE_FINISHED",
  ],
  addons: {
    selectDomainItemsByFilter: (filter) => createSelector(filter, "selectDomainsItems", (filter, items) => {
      if (!items) return null;
      
      const options = items      
      .filter(d => {
        if(filter?.key && filter?.value) {
          return d[filter.key] === filter.value;
        }else{
          return true;
        }        
      })
      return options;
    }),
    selectDomainsItemsByGroup: createSelector("selectDomainsItems", (items) => {
      if (!items) return null;
      const byGroup = {};
      items.forEach((item) => {
        if (!byGroup.hasOwnProperty(item.GRP)) byGroup[item.GRP] = [];
        byGroup[item.GRP].push(item);
      });
      return byGroup;
    }),
    selectDomainsItemsByGroupOrgCode: createSelector("selectDomainsItems","selectOrgsByRoute", (items, org) => {
      if (!items) return null;
      if (!org) return null;
      const orgFilteredItems = filter(items,{'ORG_CODE':org.slug});
      const byGroup = groupBy(orgFilteredItems,'GRP');
      return byGroup;
    }),
   
  },
});
