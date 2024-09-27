import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";

export default createRestBundle({
  name: "activity",
  uid: "id",
  prefetch: false,
  persist: false,
  routeParam: "activityId",
  getTemplate: "/orgs/:orgSlug/:fy/:projectId/activity",
  putTemplate: "",
  disallowRoles:[],
  postTemplate: "/orgs/:orgSlug/:fy/:projectId/activity/item.id",
  bulkPostTemplate: "/orgs/:orgSlug/:fy/:projectId/activity",
  deleteTemplate: "",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  forceFetchActions: ["ACTIVITY_UPDATE_FINISHED","ACTIVITY_SAVE_FINISHED","ACTIVITY_EDITING_SAVED"],
  allowNotifications: true,
});
