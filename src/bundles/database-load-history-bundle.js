import createRestBundle from "./create-rest-bundle-2";

export default createRestBundle({
  name: "databaseLoadHistory",
  uid: "id",
  prefetch: false,
  persist: false,
  staleAfter: 90000,
  allowRoles: ["APP.ADMIN"],
  routeParam: null,
  getTemplate: "/:orgSlug/databaseLoadHistory",
  putTemplate: "",
  postTemplate: "",
  bulkPostTemplate: "",
  deleteTemplate: "",
  fetchActions: [],
  forceFetchActions: [],
  allowNotifications: false,
  addons: {
  }
});