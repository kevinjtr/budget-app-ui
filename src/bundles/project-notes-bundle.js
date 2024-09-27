import createRestBundle from "./create-rest-bundle-2";


export default createRestBundle({
  name: "projectNotes",
  uid: "id",
  prefetch: false,
  persist: false,
  routeParam: "commentListId",
  getTemplate: "/orgs/:orgSlug/:fy/:projectId/notes",
  putTemplate: "",
  disallowRoles:[],
  postTemplate: "/orgs/:orgSlug/:fy/notes/:item.commentListId",
  deleteTemplate: "/orgs/:orgSlug/:fy/notes/:item.id",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  forceFetchActions: [],
  allowNotifications: true,
  addons: {}
});
