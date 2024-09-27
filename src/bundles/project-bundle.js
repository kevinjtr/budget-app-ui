import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";

export default createRestBundle({
  name: "project",
  uid: "id",
  prefetch: false,
  persist: false,
  staleAfter: 90000,
  allowRoles: [":ORG.MEMBER", ":ORG.ADMIN", ":ORG.TECHNICAL_LEAD"],
  routeParam: "projectId",
  getTemplate: "/orgs/:orgSlug/:fy/project",
  putTemplate: "",
  postTemplate: "/orgs/:orgSlug/:fy/project/:item.id",
  bulkPostTemplate: "/orgs/:orgSlug/:fy/project/:item.id",
  deleteTemplate: "",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  forceFetchActions: ["PROJECT_SAVE_FINISHED","FYSETTINGS_SAVE_FINISHED","FY_SELECT_CHANGE"],
  allowNotifications: true,
  addons: {
    // doProjectAndActivityBulkSave: (bundles) => ({ store }) => ({
    //   dispatch,
    //   store,
    //   apiPost,
    // }) => {
  

    //   dispatch({
    //     type: "PROJECT_SAVE_STARTED",
    //     payload: {
    //       _isSaving: true,
    //     },
    //   });
    //   let objItem = {}
    //   // grab the state object
    //   // const tempState = store[selectState]();        
      
    //   dispatch({
    //     type: "PROJECT_UPDATED_ITEM",
    //     // payload: tempState,
    //   });


      
  
    //   const dispatchObject = {
    //     PROJECT_ERROR = [],

    //   }
    //   for(let i=0; i<bundles.length; i++){
    //     const {name, items} = bundles[i]


    //     const uCaseName = config.name.charAt(0).toUpperCase() + config.name.slice(1);
    //     selectBulkPostUrl = `select${uCaseName}BulkPostUrl`
    //     const url = decorateUrlWithItem(store[selectBulkPostUrl](), {id:id});
    //     // create a temporary id and store it in state using that as the key
    //     // const tempId = Number(new Date()).toString();
    //     // tempState[tempId] = Object.assign({}, item);



    //   }
    //   var some_function = function (username, password) {
    //     return new Promise(function (resolve, reject) {

    //     });
    //   };
    //   const myPromise = new Promise((resolve, reject) => {
    //     apiPost(url, item, (err, response, body) => {
    //       if (err || response.statusCode !== 200) {
            
    //         dipspatchObject.PROJECT_ERROR.push(true)

    //         // dispatch({
    //         //   type: "PROJECT_ERROR",
    //         //   payload: {
    //         //     _err: { err: err, response: response },
    //         //     notification: {
    //         //       statusCode: response.statusCode,
    //         //     },
    //         //     _isSaving: false,
    //         //   },
    //         // });
    //         //reject()
    //       } else {
    //         // remove our temporary record from the state
    //         // const updatedState = store[selectState]();
    //         // delete updatedState[tempId];
  
    //         // // add our new id to our item and re-attach to our state
    //         // const data =
    //         //   typeof body === "string" ? JSON.parse(body)[0] : body[0];
    //         // const updatedItem = Object.assign({}, item, data);
    //         // updatedState[updatedItem[config.uid]] = updatedItem;
  
    //         if(i == bundles.length - 1){
    //           dispatch({
    //             type: "PROJECT_UPDATED_ITEM",
    //           });
    //         }
            
  
    //         //dipspatchObject.PROJECT_SAVE_FINISHED.push(true)
    //         // Make sure we're sending save_finished when we're done
    //         // dispatch({
    //         //   type: "PROJECT_SAVE_FINISHED",
    //         //   payload: {
    //         //     _isSaving: false,
    //         //   },
    //         // });
  
    //         resolve()
    //         if (deferCallback && callback) callback();
    //       }
    //     });

    //     dispatch({
    //       type: "PROJECT_UPDATED_ITEM",
    //     });

    //     dispatch({
    //           type: "PROJECT_SAVE_FINISHED",
    //           payload: {
    //             _isSaving: false,
    //           },
    //         });


    //   });
      
    //   if(store[selectAllowNotifications]() && !hide_notification){
    //     toast.promise(myPromise, {
    //       ...toast_alerts.save
    //     }, {
    //       success: {
    //         duration: 5000,
    //       },
    //       error: {
    //         duration: 5000,
    //       },
    //     });
    //   }else{
    //     myPromise
    //       .then(res => {})
    //       .catch(err => {})
    //   }
      
    // },
  }
});
