import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";

export default createRestBundle({
  name: "taxRate",
  uid: "code",
  prefetch: false,
  staleAfter: 900000,
  persist: false,
  routeParam: "",
  getTemplate: "/orgs/:orgSlug/:fy/taxrates",
  putTemplate: "",
  postTemplate: "",
  bulkPostTemplate:"/orgs/:orgSlug/:fy/taxrates",
  deleteTemplate: "",
  fetchActions: [],
  forceFetchActions: ["TAXRATE_SAVE_FINISHED","FYSETTINGS_SAVE_FINISHED","FY_SELECT_CHANGE"],
  allowNotifications: true,
  addons: {
    
  }
});
