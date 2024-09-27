import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";
let fetchReq
export default createRestBundle({
  name: "taxCalculation",
  uid: "id",
  prefetch: false,
  staleAfter: 900000,
  persist: false,
  routeParam: "",
  getTemplate: "/orgs/:orgSlug/:fy/taxcalc",
  putTemplate: "",
  postTemplate: "",
  bulkPostTemplate:"",
  deleteTemplate: "",
  fetchActions: [],
  forceFetchActions: ["TAXCALCULATION_START_FETCH_FINISHED"],
  allowNotifications: true,
  addons: {
    doStartTaxCalculation: () => ({ dispatch, store, apiGet }) => {
      dispatch({
        type: 'TAXCALCULATION_STARTED',
        payload: {},
      });
      const org = store.selectOrgsByRoute();
      const fiscalYear = store.selectFySelectedYear();
      const url = `/orgs/${org.slug}/${fiscalYear}/taxcalc/start`
      fetchReq = null;
      fetchReq = apiGet(url, (err, response, body) => {
        if (err || response.statusCode !== 200) {
          dispatch({
            type: "TAXCALCULATION_ERROR",
            payload: {},
          });
        } else {
          
          dispatch({
            type: 'TAXCALCULATION_START_FETCH_FINISHED',
            payload: {}
          });
        }
      });
    }
  }
});
