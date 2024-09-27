import createRestBundle from "./create-fy-rest-bundle";
import { createSelector } from "redux-bundler";

export default createRestBundle({
  name: "fy",
  uid: "id",
  prefetch: false,
  persist: false,
  staleAfter: 90000,
  allowRoles: ["APP.ADMIN", ":ORG.*"],
  routeParam: "fy",
  getTemplate: "/orgs/:orgSlug/fiscalYear",
  putTemplate: "",
  postTemplate: "",
  bulkPostTemplate: "",
  deleteTemplate: "",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  forceFetchActions: ["FY_SAVE_FINISHED"],
  allowNotifications: true,
  addons: {
    // init: (store) => {
    //   const path = store.selectPathnameMinusHomepage()
    //   let split_path = path.split('/')

    //   if(split_path.length >= 3){
    //     const fy_from_url = split_path[2]
    //     if(fy_from_url.length == 4 && !isNaN(fy_from_url)){
    //       //store.doFyChangeSelectedYear(Number(fy_from_url))
    //     }
    //   }
    // }
  }
});

// import xhr from "xhr";
// import { createSelector } from "redux-bundler";
// import { formatDistanceToNow } from "date-fns";

// const getTokenPart = function(token, part) {
//   const splitToken = token.split(".");
//   return splitToken[part];
// };

// const fyBundle= {
//   name: "fy",

//   getReducer() {
//     const initialData = {
//       items: {},
//       err: null,
//       isFetchingFY:null,
//       _lastChecked: 0
//     };

//     return (state = initialData, { type, payload }) => {
//       switch (type) {
//         case "FY_FETCH":
//         case "FY_FETCHING":
//         case "FY_FETCH_COMPLETE":
//         case "FY_FETCHING_ERROR":
//           return Object.assign({}, state, payload);        
//         default:
//           return state;
//       }
//     };
//   },  

//   doFetchFY: () => ({ dispatch }) => {
//     const url = `${process.env.REACT_APP_API_ROOT}/fiscalYear`;
//     dispatch({
//       type: "FY_FETCHING",
//       payload: { isFetchingFY: true }
//     });
//     xhr.get(
//       {
//         url: url,
//         withCredentials: false
//       },
//       (err, res, body) => {
//         if (err) {
//           dispatch({
//             type: "FY_FETCHING_ERROR",
//             payload: { items: "", err: err, isFetchingFY: false  }
//           });
//         } else {
//           try {
            
//             // test parse the token to make sure it's an actual token
            
//            const json = JSON.parse(body); // eslint-disable-line no-unused-vars
//             // if we're still alive we should be ok.

//             console.log(json)
//             dispatch({
//               type: "FY_FETCH_COMPLETE",
//               payload: { items: json, err: null, isFetchingFY: false }
//             });
//           } catch (e) {
//             dispatch({
//               type: "FY_FETCHING_ERROR",
//               payload: { items: {}, err: e, isFetchingFY: false  }
//             });
//           }
//         }
//       }
//     );
//   },

 

  
//   selectIsFetchingFY: state => {
//     return state.fy.isFetchingFY;
//   },

//   selectFYItems: state => {
//     return state.fy.items;
//   },


  
 

  

//   // persistActions: ["AUTH_LOGGED_IN", "AUTH_LOGGED_OUT"]
// };

// export default fyBundle