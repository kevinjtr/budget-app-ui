import createRestBundle from "./create-rest-bundle";

export default createRestBundle({
  name: "help",
  uid: "id",
  prefetch: false,
  routeParam: null,
  getTemplate: "",
  putTemplate: "",
  postTemplate: "/help",
  bulkPostTemplate:"",
  deleteTemplate: "",
  fetchActions: []
});
