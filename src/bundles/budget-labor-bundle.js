import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";
import flatten from 'lodash/flatten';
import groupBy from 'lodash/groupBy';

  // request Objects so that we can abort?
  let fetchReq = null;

export default createRestBundle({
  name: "budgetLabor",
  uid: "id",
  prefetch: false,
  persist: false,
  routeParam: "",
  getTemplate: "",
  putTemplate: "",
  disallowRoles:[],
  postTemplate: "/orgs/:orgSlug/:fy/:projectId/budgetlabor/:item.id",
  bulkPostTemplate: "/orgs/:orgSlug/:fy/:projectId/budgetlabor",
  deleteTemplate: "",
  fetchActions: [],
  forceFetchActions: [],
  allowNotifications: true,
  addons: {},
});
