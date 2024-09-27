import createRestBundle from "./create-rest-bundle";

export default createRestBundle({
  name: "orgUsers",
  uid: "id",
  prefetch: false,
  routeParam: null,
  staleAfter: 900000,
  getTemplate: `/orgs/:orgSlug/members`,
  putTemplate: "",
  postTemplate: "",
  bulkPostTemplate:"",
  deleteTemplate: "",
  fetchActions: []
});
