import createRestBundle from "./create-rest-bundle";

export default createRestBundle({
  name: "poc",
  uid: "id",
  prefetch: true,
  staleAfter: 900000,
  persist: false,
  routeParam: null,
  getTemplate: "/poc",
  putTemplate: "",
  postTemplate: "",
  bulkPostTemplate:"",
  deleteTemplate: "",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
});
