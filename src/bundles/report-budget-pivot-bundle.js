import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";
let fetchReq = null;
export default createRestBundle({
  name: "reportBudgetPivot",
  uid: "project_name",
  prefetch: false,
  staleAfter: 900000,
  persist: false,
  routeParam: "",
  getTemplate: "/orgs/:orgSlug/:fy/reports/budgetpivot",
  putTemplate: "",
  postTemplate: "",
  bulkPostTemplate:"",
  deleteTemplate: "",
  fetchActions: [""],
  forceFetchActions: [""],
  addons: {
    selectReportBudgetPivotDownloadItem: createSelector(
      "selectDownloadManagerItems",
      items => {
        let result = null
        for(let i=0;i<items.length;i++) {
          if(items[i].type ==='budgetpivot-report') {
            result=items[i];
          }
        }
        return result
      }
    ),
    selectReportBudgetPivotStatus: createSelector(
      "selectDownloadManagerItems",
      items => {
        let result = false
        for(let i=0;i<items.length;i++) {
          if(items[i].type ==='budgetpivot-report') {
            result=items[i].status;
          }
        }
        return result
      }
    ),
    selectReportBudgetPivotDownloadActive: (state) => {
      return state.reportBudgetPivot._isDownloading;
    },
    doStartBudgetPivotExport: () => ({ dispatch, store, apiGet }) => {
      const dActive = store.selectReportBudgetPivotDownloadActive();
      if(dActive !== true) {
        dispatch({
          type: 'REPORTBUDGETPIVOT_DOWNLOAD_STARTED',
          payload: {
            _isDownloading:true
          },
        });
        const org = store.selectOrgsByRoute();
        const fiscalYear = store.selectFySelectedYear();
        const url = `/orgs/${org.slug}/${fiscalYear}/reports/budgetpivot/download`
        fetchReq = null;
        fetchReq = apiGet(url, (err, response, body) => {
          if (err || response.statusCode !== 200) {
            dispatch({
              type: "REPORTBUDGETPIVOT_DOWNLOAD_ERROR",
              payload: {
                _isDownloading:false
              },
            });
          } else {
            
            dispatch({
              type: 'REPORTBUDGETPIVOT_DOWNLOAD_FINISHED',
              payload: {
                _isDownloading:false
              }
            },store.doFetchDownloads(true));
          }
        });
      }
      
    }
  }
});
