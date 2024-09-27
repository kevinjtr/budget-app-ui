import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";
let fetchReq = null;
export default createRestBundle({
  name: "reportScope",
  uid: "project_name",
  prefetch: false,
  staleAfter: 900000,
  persist: false,
  routeParam: "",
  getTemplate: "/orgs/:orgSlug/:fy/reports/scope",
  putTemplate: "",
  postTemplate: "",
  bulkPostTemplate:"",
  deleteTemplate: "",
  fetchActions: [""],
  forceFetchActions: [""],
  addons: {
    selectReportScopeDownloadItem: createSelector(
      "selectDownloadManagerItems",
      items => {
        let result = null
        for(let i=0;i<items.length;i++) {
          if(items[i].type ==='scope-report') {
            result=items[i];
          }
        }
        return result
      }
    ),
    selectReportScopeStatus: createSelector(
      "selectDownloadManagerItems",
      items => {
        let result = false
        for(let i=0;i<items.length;i++) {
          if(items[i].type ==='scope-report') {
            result=items[i].status;
          }
        }
        return result
      }
    ),
    selectReportScopeDownloadActive: (state) => {
      return state.reportScope._isDownloading;
    },
    doStartScopeExport: () => ({ dispatch, store, apiGet }) => {
      const dActive = store.selectReportScopeDownloadActive();
      if(dActive !== true) {
        dispatch({
          type: 'REPORTSCOPE_DOWNLOAD_STARTED',
          payload: {
            _isDownloading:true
          },
        });
        const org = store.selectOrgsByRoute();
        const fiscalYear = store.selectFySelectedYear();
        const url = `/orgs/${org.slug}/${fiscalYear}/reports/scope/download`
        fetchReq = null;
        fetchReq = apiGet(url, (err, response, body) => {
          if (err || response.statusCode !== 200) {
            dispatch({
              type: "REPORTSCOPE_DOWNLOAD_ERROR",
              payload: {
                _isDownloading:false
              },
            });
          } else {
            
            dispatch({
              type: 'REPORTSCOPE_DOWNLOAD_FINISHED',
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
