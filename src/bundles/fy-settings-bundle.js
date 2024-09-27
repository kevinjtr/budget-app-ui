import createRestBundle from "./create-rest-bundle-2";

export default createRestBundle({
  name: "fySettings",
  uid: "id",
  prefetch: false,
  persist: false,
  staleAfter: 90000,
  allowRoles: ["APP.ADMIN", ":ORG.ADMIN"],
  routeParam: null,
  getTemplate: "/orgs/:orgSlug/fiscalYearSettings",
  putTemplate: "",
  postTemplate: "/orgs/:orgSlug/fiscalYearSettings",
  bulkPostTemplate: "/orgs/:orgSlug/fiscalYearSettings",
  deleteTemplate: "",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  forceFetchActions: ["FYSETTINGS_SAVE_FINISHED"],
  allowNotifications: true,
  addons: {
  }
});