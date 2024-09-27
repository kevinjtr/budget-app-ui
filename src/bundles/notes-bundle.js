import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";

export default createRestBundle({
  name: "notes",
  uid: "id",
  prefetch: true,
  persist: false,
  routeParam: "",
  getTemplate: "/orgs/:orgSlug/:fy/notes/:parentId",
  putTemplate: "/orgs/:orgSlug/:fy/notes/:item.id",
  postTemplate: "/orgs/:orgSlug/:fy/notes/",
  bulkPostTemplate:"",
  deleteTemplate: "/orgs/:orgSlug/:fy/notes/:item.id",
  allowNotifications: true,
  fetchActions: [
    "URL_UPDATED",
    "AUTH_LOGGED_IN",
  ],
  
});
