import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";

export default createRestBundle({
  name: "taxes",
  uid: "id",
  prefetch: false,
  staleAfter: 900000,
  persist: false,
  routeParam: "",
  getTemplate: "/orgs/:orgSlug/:fy/taxes",
  putTemplate: "",
  postTemplate: "",
  bulkPostTemplate: "/orgs/:orgSlug/:fy/taxes",
  deleteTemplate: "",
  fetchActions: [],
  forceFetchActions: ["TAXES_SAVE_FINISHED","FYSETTINGS_SAVE_FINISHED","FY_SELECT_CHANGE"],
  allowNotifications: true,
  addons: {
    
  }
});
