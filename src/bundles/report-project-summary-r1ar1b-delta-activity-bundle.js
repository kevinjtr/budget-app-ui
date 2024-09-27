import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";
let fetchReq = null;
export default createRestBundle({
  name: "reportProjectSummaryR1AR1BActivityDelta",
  uid: "project_name",
  prefetch: false,
  staleAfter: 900000,
  persist: false,
  routeParam: "",
  getTemplate: "/orgs/:orgSlug/:fy/reports/projectSummaryR1AR1BActivityDelta",
  putTemplate: "",
  postTemplate: "",
  bulkPostTemplate:"",
  deleteTemplate: "",
  fetchActions: [""],
  forceFetchActions: [""],
  addons: {
    selectReportProjectSummaryR1AR1BActivityDeltaDownloadItem: createSelector(
      "selectDownloadManagerItems",
      items => {
        let result = null
        for(let i=0;i<items.length;i++) {
          if(items[i].type ==='projectSummaryR1AR1BActivityDelta-report') {
            result=items[i];
          }
        }
        return result
      }
    ),
    selectReportProjectSummaryR1AR1BActivityDeltaStatus: createSelector(
      "selectDownloadManagerItems",
      items => {
        let result = false
        for(let i=0;i<items.length;i++) {
          if(items[i].type ==='projectSummaryR1AR1BActivityDelta-report') {
            result=items[i].status;
          }
        }
        return result
      }
    ),
    selectReportProjectSummaryR1AR1BActivityDeltaDownloadActive: (state) => {
      return state.reportProjectSummaryR1AR1BActivityDelta._isDownloading;
    },
    doStartProjectSummaryR1AR1BActivityDeltaExport: () => ({ dispatch, store, apiGet }) => {
      const dActive = store.selectReportProjectSummaryR1AR1BActivityDeltaDownloadActive();
      if(dActive !== true) {
        dispatch({
          type: 'REPORTPROJECTSUMMARYR1AR1BACTIVITYDELTA_DOWNLOAD_STARTED',
          payload: {
            _isDownloading:true
          },
        });
        const org = store.selectOrgsByRoute();
        const fiscalYear = store.selectFySelectedYear();
        const url = `/orgs/${org.slug}/${fiscalYear}/reports/download/projectSummaryR1AR1BActivityDelta`
        fetchReq = null;
        fetchReq = apiGet(url, (err, response, body) => {
          if (err || response.statusCode !== 200) {
            dispatch({
              type: "REPORTPROJECTSUMMARYR1AR1BACTIVITYDELTA_DOWNLOAD_ERROR",
              payload: {
                _isDownloading:false
              },
            });
          } else {
            
            dispatch({
              type: 'REPORTPROJECTSUMMARYR1AR1BACTIVITYDELTA_DOWNLOAD_FINISHED',
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
