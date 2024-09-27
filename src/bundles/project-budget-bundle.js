import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";

export default createRestBundle({
  name: "project",
  uid: "id",
  prefetch: false,
  persist: false,
  staleAfter: 90000,
  allowRoles: [":ORG.*"],
  routeParam: "projectId",
  getTemplate: "/orgs/:orgSlug/:fy/project",
  putTemplate: "",
  postTemplate: "",
  bulkPostTemplate:"",
  deleteTemplate: "",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  forceFetchActions: ["PROJECT_BUDGET_SAVE_FINISHED"],
  allowNotifications: true,
  addons: {
    
  }
});
