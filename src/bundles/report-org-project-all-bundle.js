import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";
let fetchReq = null;
export default createRestBundle({
  name: "reportOrgProjectAll",
  uid: "project_name",
  prefetch: false,
  staleAfter: 900000,
  persist: false,
  routeParam: "",
  getTemplate: "/orgs/:orgSlug/:fy/reports/orgProjectAll",
  putTemplate: "",
  postTemplate: "",
  bulkPostTemplate:"",
  deleteTemplate: "",
  fetchActions: [""],
  forceFetchActions: [""],
  addons: {
    selectReportOrgProjectAllDownloadItem: createSelector(
      "selectDownloadManagerItems",
      items => {
        let result = null
        for(let i=0;i<items.length;i++) {
          if(items[i].type ==='orgProjAll-report') {
            result=items[i];
          }
        }
        return result
      }
    ),
    selectReportOrgProjectAllStatus: createSelector(
      "selectDownloadManagerItems",
      items => {
        let result = false        
        for(let i=0;i<items.length;i++) {
          if(items[i].type ==='orgProjAll-report') {
            result=items[i].status;
          }
        }
        return result
      }
    ),
    selectReportOrgProjectAllDownloadActive: (state) => {
      return state.reportOrg._isDownloading;
    },
    doStartOrgProjectAllExport: () => ({ dispatch, store, apiGet }) => {
      const dActive = store.selectReportOrgProjectAllDownloadActive();
      if(dActive !== true) {
        dispatch({
          type: 'REPORTORGPROJECTALL_DOWNLOAD_STARTED',
          payload: {
            _isDownloading:true
          },
        });
        const org = store.selectOrgsByRoute();
        const fiscalYear = store.selectFySelectedYear();
        const url = `/orgs/${org.slug}/${fiscalYear}/reports/download/orgProjAll`
        fetchReq = null;
        fetchReq = apiGet(url, (err, response, body) => {
          if (err || response.statusCode !== 200) {
            dispatch({
              type: "REPORTORGPROJECTALL_DOWNLOAD_ERROR",
              payload: {
                _isDownloading:false
              },
            });
          } else {
            
            dispatch({
              type: 'REPORTORGPROJECTALL_DOWNLOAD_FINISHED',
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
