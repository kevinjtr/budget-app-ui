import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";
let fetchReq = null;
export default createRestBundle({
  name: "reportProjectSummary",
  uid: "project_name",
  prefetch: false,
  staleAfter: 900000,
  persist: false,
  routeParam: "",
  getTemplate: "/orgs/:orgSlug/:fy/reports/projectSummary",
  putTemplate: "",
  postTemplate: "",
  bulkPostTemplate:"",
  deleteTemplate: "",
  fetchActions: [""],
  forceFetchActions: [""],
  addons: {
    selectReportProjectSummaryDownloadItem: createSelector(
      "selectDownloadManagerItems",
      items => {
        let result = null
        for(let i=0;i<items.length;i++) {
          if(items[i].type ==='projectSummary-report') {
            result=items[i];
          }
        }
        return result
      }
    ),
    selectReportProjectSummaryStatus: createSelector(
      "selectDownloadManagerItems",
      items => {
        let result = false
        for(let i=0;i<items.length;i++) {
          if(items[i].type ==='projectSummary-report') {
            result=items[i].status;
          }
        }
        return result
      }
    ),
    selectReportProjectSummaryDownloadActive: (state) => {
      return state.reportProjectSummary._isDownloading;
    },
    doStartProjectSummaryExport: () => ({ dispatch, store, apiGet }) => {
      const dActive = store.selectReportProjectSummaryDownloadActive();
      if(dActive !== true) {
        dispatch({
          type: 'REPORTPROJECTSUMMARY_DOWNLOAD_STARTED',
          payload: {
            _isDownloading:true
          },
        });
        const org = store.selectOrgsByRoute();
        const fiscalYear = store.selectFySelectedYear();
        const url = `/orgs/${org.slug}/${fiscalYear}/reports/download/projectSummary`
        fetchReq = null;
        fetchReq = apiGet(url, (err, response, body) => {
          if (err || response.statusCode !== 200) {
            dispatch({
              type: "REPORTPROJECTSUMMARY_DOWNLOAD_ERROR",
              payload: {
                _isDownloading:false
              },
            });
          } else {
            
            dispatch({
              type: 'REPORTPROJECTSUMMARY_DOWNLOAD_FINISHED',
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
