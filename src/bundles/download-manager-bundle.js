import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';

let fetchInterval = null;
let fetchReq = null;
export default createRestBundle({
  name: "downloadManager",
  uid: "id",
  prefetch: false,
  staleAfter: 1000*60,
  persist: false,
  routeParam: null,
  getTemplate: "",
  putTemplate: "",
  postTemplate: "",
  bulkPostTemplate:"",
  deleteTemplate: "/downloads/:item.id",
  fetchActions: [],
  forceFetchActions: [
    
  ],
  addons: {
  
    doFetchDownloads: (force) => ({ dispatch, store, apiGet }) => {
      
      const defaultItems = store.selectDownloadManagerItemsObject();
      const isStale =store.selectDownloadManagerIsStale()
      const url = `/downloads`;
      let fetchCount = store.selectDownloadManagerFetchCount();
      const flags = store.selectDownloadManagerFlags();
      let shouldFetch = false
      if(fetchCount>0 && isStale) {
        shouldFetch =true;
      }else if(fetchCount===0){
        shouldFetch =true;
      }else if(force){
        shouldFetch =true;
      }
      if(shouldFetch) {
        if (fetchReq) fetchReq.abort();
        fetchReq = null;
        fetchReq = apiGet(url, (err, response, body) => {
          if (err || response.statusCode !== 200) {
            window.clearInterval(fetchInterval)
            console.log('ERROR')
            dispatch({
              type: 'DOWNLOADMANAGER_ERROR',
              payload: {
                _err: { err: err, response: response },                
                _isLoading: false,
                _isSaving: false,
                _fetchCount: ++fetchCount,
                _lastResource: url,
                _abortReason: null,
              },
            });
          } else {
            const data = JSON.parse(body);
            const itemsById = {};
            let shouldUpdate=false
            if(defaultItems && Object.keys(defaultItems).length>0) {
              data.forEach((item) => {
                const dItem = defaultItems[item.id];
                if(dItem) {
                  if(item.status !==dItem.status) {
                    shouldUpdate=true;
                  }
                }else{
                  shouldUpdate=true
                }
                itemsById[item.id] = item;
              });
            }else{
              shouldUpdate=true;
              data.forEach((item) => {
                itemsById[item.id] = item;
              });
            }
            if(shouldUpdate) {
              dispatch({
                type: 'DOWNLOADMANAGER_FETCH_FINISHED',
                payload: {
                  ...itemsById,
                  ...flags,
                  ...{
                    _isLoading: false,
                    _fetchCount: ++fetchCount,
                    _lastFetch: new Date(),
                  },
                },
              });
            }
            if(data && data.length>0) {
              let shouldAuto =false
              for (let i=0;i<data.length;i++) {
                if(data[i].status !=='complete') {
                  shouldAuto=true;
                }
              }
              if(shouldAuto && !fetchInterval) {
                fetchInterval = window.setInterval(() => {
                  store.doFetchDownloads()
               }, store.selectDownloadManagerStaleAfter());
              }else if(!shouldAuto){
                window.clearInterval(fetchInterval)
              }
              
            }else{
              window.clearInterval(fetchInterval)
            }
            
                       
          }
        });
      } 
      
    },
    
  
    // selectDomainItemsByFilter: (filter) => createSelector(filter, "selectDomainsItems", (filter, items) => {
    //   if (!items) return null;
    //   console.log(items)
    //   const options = items      
    //   .filter(d => {
    //     if(filter?.key && filter?.value) {
    //       return d[filter.key] === filter.value;
    //     }else{
    //       return true;
    //     }        
    //   })
    //   return options;
    // }),
    
   
  },
});
