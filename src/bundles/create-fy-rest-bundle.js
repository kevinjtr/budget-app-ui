import { createSelector } from "redux-bundler";
import isArray from 'lodash/isArray';
import toast from 'react-hot-toast';
import {Alert} from '@mui/material'
import { find, findIndex, maxBy } from "lodash";

const notification = (severity) => toast.custom(() => (
  <Alert sx={{outline:'none', backgroundColor:'background.default'}} severity={severity}>
    {severity === "success" ? 'Successfully updated data' : 'Error while updating data'} 
  </Alert>
))

/**
 * Replace any :item.* values in the url with the actual value from the item
 */
const decorateUrlWithItem = (urlTemplate, item) => {
  const regex = /(:.*?)(\/|$)/gi;
  let url = urlTemplate;
  let m;
  while ((m = regex.exec(urlTemplate)) != null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    const param = m[1];
    if (param.indexOf("item") !== -1) {
      const key = param.split(".")[1];
      url = url.replace(param, item[key]);
    }
  }
  return url;
};

/**
 * Check to see if a particular token part exists against a given value
 */
function checkTokenPart(tokenRoles, val, idx) {
  let match = false;
  tokenRoles.forEach((tokenRole) => {
    const tokenPart = tokenRole.split(".")[idx];
    if (tokenPart === val) match = true;
  });
  return match;
}

/**
 * Check one array of roles against another array of roles accounting
 * for wildcards and org substitution
 */
function checkRoles(rawRoles, tokenRolesJoined, orgsActiveSlug, type) {
  let pass = false;
  let roles
  if(rawRoles) {
    roles=rawRoles
  }else if(type!=='disallowed'){
    roles=["*"]
  }else{
    roles=[];
  }
  
  for (let i = 0; i < roles.length; i++) {
    let role = roles[i];
    role = role.replace(
      `:ORG.`,
      `${orgsActiveSlug ? orgsActiveSlug.toUpperCase() : ""}.`
    );

    // let super users through no matter what
    if (tokenRolesJoined.indexOf("APP.ADMIN") !== -1) {
      pass = true;
      break;
    }

    // first let's test if this role is in tokenRoles, if so, pass and move on
    if (tokenRolesJoined.indexOf(role) !== -1) {
      pass = true;
      break;
    }

    // ok, let's check to see if we have a wildcard
    if (role.indexOf("*") !== -1) {
      // if both parts are * then pass is true
      if (role === "*.*") {
        pass = true;
        break;
      }

      // otherwise we've got to check both parts separately
      const parts = role.split(".");

      // looks like we do, is it in the org position?
      if (parts[0] === "*") {
        // if so, check tokenRoles for the role
        if (checkTokenPart(tokenRolesJoined, parts[1], 1)) pass = true;
        if (pass) break;
      }

      // how about the role position?
      if (parts[1] === "*") {
        if (checkTokenPart(tokenRolesJoined, parts[0], 0)) pass = true;
        if (pass) break;
      }
    }
  }
  return pass;
}

/**
 * Main Bundle Creator export
 */
 export default (opts) => {
  const defaults = {
    name: null,
    uid: "id",
    lastFetch: new Date(),
    staleAfter: 0, // always stale
    persist: false,
    prefetch: false,
    routeParam: null,
    getTemplate: "/",
    putTemplate: "/",
    postTemplate: "/",
    deleteTemplate: "/",
    fetchActions: [],
    forceFetchActions: [],
    allowRoles: ["*.*"],
    disallowRoles: [],
    reduceFurther: null,
    addons: {},
    editableFields: [],
    editState: {},
    oldState: {},
    initialData: {},
    downloadActive:false,
    urlParamSelectors: [],
    allowNotifications: false,
  };

  const config = Object.assign({}, defaults, opts);

  const uCaseName = config.name.charAt(0).toUpperCase() + config.name.slice(1);
  const baseType = config.name.toUpperCase();

  // actions
  const actions = {
    FETCH_STARTED: `${baseType}_FETCH_STARTED`,
    FETCH_FINISHED: `${baseType}_FETCH_FINISHED`,
    FETCH_ABORT: `${baseType}_FETCH_ABORT`,
    EDITING_STARTED: `${baseType}_EDITING_STARTED`,
    EDITING_SAVED: `${baseType}_EDITING_SAVED`,
    EDITING_CANCELED: `${baseType}_EDITING_CANCELED`,
    SAVE_STARTED: `${baseType}_SAVE_STARTED`,
    SAVE_FINISHED: `${baseType}_SAVE_FINISHED`,
    DELETE_STARTED: `${baseType}_DELETE_STARTED`,
    DELETE_FINISHED: `${baseType}_DELETE_FINISHED`,
    UPDATED_ITEM: `${baseType}_UPDATED_ITEM`,
    DOWNLOAD_STARTED: `${baseType}_DOWNLOAD_STARTED`,
    DOWNLOAD_FINISHED: `${baseType}_DOWNLOAD_FINISHED`,
    ERROR: `${baseType}_ERROR`,
    SELECT_CHANGE: `${baseType}_SELECT_CHANGE`,
  };

  // action creators
  const doStartEditing = `do${uCaseName}StartEditing`;
  const doCancelEditing = `do${uCaseName}CancelEditing`;
  const doFetch = `do${uCaseName}Fetch`;
  const doForceFetch = `do${uCaseName}ForceFetch`;
  const doBulkSave = `do${uCaseName}BulkSave`;
  const doSave = `do${uCaseName}Save`;
  const doDelete = `do${uCaseName}Delete`;
  const doChangeSelectedYear = `do${uCaseName}ChangeSelectedYear`;

  // selectors
  const selectState = `select${uCaseName}State`;
  const selectFlags = `select${uCaseName}Flags`;
  const selectGetTemplate = `select${uCaseName}GetTemplate`;
  const selectPutTemplate = `select${uCaseName}PutTemplate`;
  const selectPostTemplate = `select${uCaseName}PostTemplate`;
  const selectBulkPostTemplate = `select${uCaseName}BulkPostTemplate`;
  const selectDeleteTemplate = `select${uCaseName}DeleteTemplate`;
  const selectGetUrl = `select${uCaseName}GetUrl`;
  const selectPutUrl = `select${uCaseName}PutUrl`;
  const selectPostUrl = `select${uCaseName}PostUrl`;
  const selectBulkPostUrl = `select${uCaseName}BulkPostUrl`;
  const selectDeleteUrl = `select${uCaseName}DeleteUrl`;
  const selectItemsObject = `select${uCaseName}ItemsObject`;
  const selectItemsArray = `select${uCaseName}ItemsArray`;
  const selectItems = `select${uCaseName}Items`;
  const selectByRoute = `select${uCaseName}ByRoute`;
  const selectIsLoading = `select${uCaseName}IsLoading`;
  const selectIsSaving = `select${uCaseName}IsSaving`;
  const selectFetchCount = `select${uCaseName}FetchCount`;
  const selectLastFetch = `select${uCaseName}LastFetch`;
  const selectIsStale = `select${uCaseName}IsStale`;
  const selectStaleAfter = `select${uCaseName}StaleAfter`;
  const selectLastResource = `select${uCaseName}LastResource`;
  const selectForceFetch = `select${uCaseName}ForceFetch`;
  const selectAbortReason = `select${uCaseName}AbortReason`;
  const selectAllowRoles = `select${uCaseName}AllowRoles`;
  const selectIsAllowedRole = `select${uCaseName}IsAllowedRole`;
  const selectDisallowRoles = `select${uCaseName}DisallowRoles`;
  const selectIsDisallowedRole = `select${uCaseName}IsDisallowedRole`;
  const selectIsEditing = `select${uCaseName}IsEditing`;
  const selectIsEditingId = `select${uCaseName}IsEditingId`;
  const selectSelectedYear = `select${uCaseName}SelectedYear`;
  const selectSelectedItem = `select${uCaseName}SelectedItem`;
  const selectIsUpdateModalOpen = `select${uCaseName}IsUpdateModalOpen`;
  const selectEditableFields = `select${uCaseName}EditableFields`;
  const selectEditableFieldsData = `select${uCaseName}EditableFieldsData`;
  const selectAllowNotifications = `select${uCaseName}AllowNotifications`;
  // reactors
  const reactShouldFetch = `react${uCaseName}ShouldFetch`;

  // request Objects so that we can abort?
  let fetchReq = null;

  const result = Object.assign(
    {},
    {
      name: config.name,

      getReducer: () => {
        const initialData = Object.assign(
          {
            _oldState:{},
            _err: null,
            _isEditing: false,
            _isSaving: false,
            _isLoading: false,
            _shouldFetch: config.prefetch,
            _forceFetch: false,
            _fetchCount: 0,
            _lastFetch: config.lastFetch,
            _lastResource: null,
            _abortReason: null,
            _isDownloading: false,
            _allowRoles: config.allowRoles,
            _disallowRoles: config.disallowRoles,
            _updateModalOpen: false,
            _isEditingId: null
          },
          config.initialData
        );

        return (state = initialData, { type, payload }) => {
          if (config.fetchActions.indexOf(type) !== -1) {
            return Object.assign({}, state, {
              _shouldFetch: true,
              _forceFetch: false,
            });
          }

          if (config.forceFetchActions) {
            if (config.forceFetchActions.indexOf(type) !== -1) {
              return Object.assign({}, state, {
                _shouldFetch: true,
                _forceFetch: true,
              });
            }
          }
          switch (type) {
            case actions.EDITING_STARTED:
            case actions.EDITING_SAVED:
            case actions.EDITING_CANCELED:
            case actions.SAVE_STARTED:
            case actions.SAVE_FINISHED:
            case actions.FETCH_STARTED:
            case actions.FETCH_ABORT:
            case actions.DELETE_STARTED:
            case actions.DELETE_FINISHED:
            case actions.DOWNLOAD_STARTED:
            case actions.DOWNLOAD_FINISHED:
            case actions.ERROR:
            case actions.UPDATED_ITEM:
            case actions.SELECT_CHANGE:
              return Object.assign({}, state, payload);
            case actions.FETCH_FINISHED:
              return Object.assign({}, payload);
            default:
              if (
                config.reduceFurther &&
                typeof config.reduceFurther === "function"
              ) {
                return config.reduceFurther(state, { type, payload });
              } else {
                return state;
              }
          }
        };
      },
      [doFetch]: () => ({ dispatch, store, apiGet }) => {
        
        dispatch({
          type: actions.FETCH_STARTED,
          payload: {
            _shouldFetch: false,
            _isLoading: true,
          },
        });

        const url = store[selectGetUrl]();
        let fetchCount = store[selectFetchCount]();
        const isStale = store[selectIsStale]();
        const lastResource = store[selectLastResource]();
        const forceFetch = store[selectForceFetch]();
        const flags = store[selectFlags]();
        // const items =store[selectItems]()
        if (url.indexOf("/:") !== -1 || url.indexOf("?:") !== -1) {
          // if we haven't filled in all of our params then bail
          
          dispatch({
            type: actions.FETCH_ABORT,
            payload: {
              _isLoading: false,
              _abortReason: `don't have all the params we need`,
            },
          });
          // if this is a new request, but the url isnt up to date, clear the items,
          // this way they can be garbage collected and it prevents leakage
          dispatch({
            type: actions.UPDATED_ITEM,
            payload: {
              ...flags,
              _isLoading: false,
              _isSaving: false,
            },
          });
          return;
        } else if (!isStale && url === lastResource && !forceFetch) {
          // if we're not stale and we're trying the same resource, then bail
          // but if force is true then keep going no matter what
          
          dispatch({
            type: actions.FETCH_ABORT,
            payload: {
              _isLoading: false,
              _abortReason: `we're not stale enough`,
            },
          });
          return;
        } else {
          if (fetchReq) fetchReq.abort();
          fetchReq = null;
          fetchReq = apiGet(url, (err, response, body) => {
            if (err || response.statusCode !== 200) {
              dispatch({
                type: actions.ERROR,
                payload: {
                  _err: { err: err, response: response },
                  notification: {
                    statusCode: response.statusCode,
                  },
                  _isLoading: false,
                  _isSaving: false,
                  _fetchCount: ++fetchCount,
                  _lastResource: url,
                  _abortReason: null,
                },
              });
            } else {
              const pathnameMinusHomepageAndOrg = store.selectPathnameMinusHomepageAndOrg()
              const pathname_split = pathnameMinusHomepageAndOrg.split('/')
              const orgsByRoute = store.selectOrgsByRoute()
              const data = JSON.parse(body);
              const itemsById = {};
              let selected_year = null
              let year_from_url = null
              year_from_url = pathname_split.length > 2 ? (!isNaN(pathname_split[1]) ? Number(pathname_split[1]) : null) : null

              data?.forEach((item) => {
                itemsById[item[config.uid]] = item;
              });

              if(year_from_url){
                const active_idx = findIndex(data,{year: year_from_url})

                if(active_idx != -1){
                  selected_year = data[active_idx].year
                }else{
                  const idx = findIndex(data,{active: 1})
                  if(idx != -1){
                    selected_year = data[idx].year
                  }
                }

                if(selected_year){
                  const pathnameMinusHomepage = store.selectPathnameMinusHomepage()
                  const url = pathnameMinusHomepage.replace(`${orgsByRoute?.slug}/${pathname_split[1]}`,`${orgsByRoute?.slug}/${selected_year}`)
                  store.doUpdateUrlWithHomepageAndFetchData(url)
                }

              }else if(pathname_split.length < 3){
                //dashboard
                const sel = JSON.parse(localStorage.getItem('fy'))
                const idx = findIndex(data,{year: sel})
  
                if(idx != -1){
                  selected_year = sel
                }else{
                  const active_idx = findIndex(data,{active: 1})

                  if(active_idx != -1){
                    selected_year = data[active_idx].year
                  }else{
                    const obj = maxBy(data,'year')
                    if(obj?.year){
                      selected_year = obj.year
                    }
                  }
                }
              }else{
                const active_idx = findIndex(data,{active: 1})

                if(active_idx != -1){
                  selected_year = data[active_idx].year
                }else{
                  const obj = maxBy(data,'year')
                  if(obj?.year){
                    selected_year = obj.year
                  }
                }

                if(selected_year){
                  const pathnameMinusHomepage = store.selectPathnameMinusHomepage()
                  const url = pathnameMinusHomepage.replace(`${orgsByRoute?.slug}/${pathname_split[1]}`,`${orgsByRoute?.slug}/${selected_year}`)
                  store.doUpdateUrlWithHomepageAndFetchData(url)
                }
              }
              
              dispatch({
                type: actions.FETCH_FINISHED,
                payload: {
                  ...itemsById,
                  ...flags,
                  ...{
                    _isLoading: false,
                    _isSaving: false,
                    _fetchCount: ++fetchCount,
                    _lastFetch: new Date(),
                    _lastResource: url,
                    _abortReason: null,
                    _selectedYear: selected_year
                  },
                },
              });
            }
          });
        }
      },
      [doForceFetch]: () => ({ dispatch, store, apiGet }) => {
        
        dispatch({
          type: actions.FETCH_STARTED,
          payload: {
            _shouldFetch: false,
            _isLoading: true,
          },
        });

        const url = store[selectGetUrl]();
        let fetchCount = store[selectFetchCount]();
        const isStale = store[selectIsStale]();
        const lastResource = store[selectLastResource]();
        const forceFetch = store[selectForceFetch]();
        const flags = store[selectFlags]();
        // const items =store[selectItems]()
        if (url.indexOf("/:") !== -1 || url.indexOf("?:") !== -1) {
          // if we haven't filled in all of our params then bail
          
          dispatch({
            type: actions.FETCH_ABORT,
            payload: {
              _isLoading: false,
              _abortReason: `don't have all the params we need`,
            },
          });
          // if this is a new request, but the url isnt up to date, clear the items,
          // this way they can be garbage collected and it prevents leakage
          dispatch({
            type: actions.UPDATED_ITEM,
            payload: {
              ...flags,
              _isLoading: false,
              _isSaving: false,
            },
          });
          return;
        } else {
          if (fetchReq) fetchReq.abort();
          fetchReq = null;
          fetchReq = apiGet(url, (err, response, body) => {
            if (err || response.statusCode !== 200) {
              dispatch({
                type: actions.ERROR,
                payload: {
                  _err: { err: err, response: response },
                  notification: {
                    statusCode: response.statusCode,
                  },
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
              let selected_year = null

              data?.forEach((item) => {
                itemsById[item[config.uid]] = item;
              });

              const sel = JSON.parse(localStorage.getItem('fy'))
              const idx = findIndex(data,{year: sel})
              
              if(idx != -1){
                selected_year = sel
              }else{
                const active_idx = findIndex(data,{active: 1})

                if(active_idx != -1){
                  selected_year = data[active_idx].year
                }else{
                  const obj = maxBy(data,'year')
                  if(obj?.year){
                    selected_year = obj.year
                  }
                }
              }
              
              dispatch({
                type: actions.FETCH_FINISHED,
                payload: {
                  ...itemsById,
                  ...flags,
                  ...{
                    _isLoading: false,
                    _isSaving: false,
                    _fetchCount: ++fetchCount,
                    _lastFetch: new Date(),
                    _lastResource: url,
                    _abortReason: null,
                    _selectedYear: selected_year
                  },
                },
              });
            }
          });
        }
      },
      [doBulkSave]: (item, id, callback, deferCallback) => ({
        dispatch,
        store,
        apiPost,
      }) => {
        dispatch({
          type: actions.SAVE_STARTED,
          payload: {
            _isSaving: true,
          },
        });
        let objItem = {}
        // grab the state object
        // const tempState = store[selectState]();        
        
        const url = decorateUrlWithItem(store[selectBulkPostUrl](), {id:id});
        // create a temporary id and store it in state using that as the key
        // const tempId = Number(new Date()).toString();
        // tempState[tempId] = Object.assign({}, item);
        // dispatch({
        //   type: actions.UPDATED_ITEM,
        //   // payload: tempState,
        // });
        apiPost(url, item, (err, response, body) => {
          if (err || response.statusCode !== 200) {

            dispatch({
              type: actions.ERROR,
              payload: {
                _err: { err: err, response: response },
                notification: {
                  statusCode: response.statusCode,
                },
                _isSaving: false,
              },
            });

            //store["doNewFySelectedFetchData"]()
            if(store[selectAllowNotifications]()){
              notification("error")
            }
            
          } else {
            // remove our temporary record from the state
            // const updatedState = store[selectState]();
            // delete updatedState[tempId];

            // // add our new id to our item and re-attach to our state
            // const data =
            //   typeof body === "string" ? JSON.parse(body)[0] : body[0];
            // const updatedItem = Object.assign({}, item, data);
            // updatedState[updatedItem[config.uid]] = updatedItem;

            dispatch({
              type: actions.UPDATED_ITEM,
              payload: {
                _updateModalOpen: false,
                _isEditingId: null,
                _isEditing: false,
              },
            });

            // Make sure we're sending save_finished when we're done
            dispatch({
              type: actions.SAVE_FINISHED,
              payload: {
                _isSaving: false,
              },
            });

            //store["doNewFySelectedFetchData"]()

            if(store[selectAllowNotifications]()){
              notification("success")
            }
            
            if (deferCallback && callback) callback();
          }
        });
        
        
      },
      [doSave]: (item, callback, deferCallback) => ({
        dispatch,
        store,
        apiPut,
        apiPost,
      }) => {
        dispatch({
          type: actions.SAVE_STARTED,
          payload: {
            _isSaving: true,
          },
        });

        // grab the state object
        const tempState = store[selectState]();
        if (!item[config.uid]) {
          const url = decorateUrlWithItem(store[selectPostUrl](), item);

          // create a temporary id and store it in state using that as the key
          const tempId = Number(new Date()).toString();
          tempState[tempId] = Object.assign({}, item);
          dispatch({
            type: actions.UPDATED_ITEM,
            payload: tempState,
          });
          apiPost(url, item, (err, response, body) => {
            if (err || response.statusCode !== 200) {
              dispatch({
                type: actions.ERROR,
                payload: {
                  _err: { err: err, response: response },
                  notification: {
                    statusCode: response.statusCode,
                  },
                  _isSaving: false,
                },
              });

              //store["doNewFySelectedFetchData"]()

              if(store[selectAllowNotifications]()){
                notification("error")
              }
            } else {
              // remove our temporary record from the state
              const updatedState = store[selectState]();
              delete updatedState[tempId];

              // add our new id to our item and re-attach to our state
              const data =
                typeof body === "string" ? JSON.parse(body)[0] : body[0];
              const updatedItem = Object.assign({}, item, data);
              updatedState[updatedItem[config.uid]] = updatedItem;

              dispatch({
                type: actions.UPDATED_ITEM,
                payload: {...updatedState,
                  _updateModalOpen: false,
                  _isEditingId: null,
                  _isEditing: false},
              });

              // Make sure we're sending save_finished when we're done
              dispatch({
                type: actions.SAVE_FINISHED,
                payload: {
                  _isSaving: false,
                },
              });

              //store["doNewFySelectedFetchData"]()

              if(store[selectAllowNotifications]()){
                notification("success")
              }

              if (deferCallback && callback) callback(updatedItem);
            }
          });
          // if we get a callback, go ahead and fire it
          if (!deferCallback && callback) callback();
        } else {
          const url = decorateUrlWithItem(store[selectPutUrl](), item);
          // add our updated item to the state based on it's key
          tempState[item[config.uid]] = Object.assign({}, item);
          dispatch({
            type: actions.UPDATED_ITEM,
            payload: tempState,
          });

          // save changes to the server
          apiPut(url, item, (err, response, body) => {
            if (err || response.statusCode !== 200) {
              dispatch({
                type: actions.ERROR,
                payload: {
                  _err: { err: err, response: response },
                  notification: {
                    statusCode: response.statusCode,
                  },
                  _isSaving: false,
                },
              });
              if(store[selectAllowNotifications]()){
                notification("error")
              }
            } else {
              // if successful we shouldn't have to do anything else
              dispatch({
                type: actions.SAVE_FINISHED,
                payload: {
                  _updateModalOpen: false,
                  _isEditingId: null,
                  _isSaving: false,
                  _isEditing: false,
                },
              });
              if (deferCallback && callback) callback();
            }
          });
          // if we get a callback, go ahead and fire it
          if (!deferCallback && callback) callback();
        }
      },

      [doDelete]: (item, callback, deferCallback) => ({
        dispatch,
        store,
        apiDelete,
      }) => {
        dispatch({
          type: actions.DELETE_STARTED,
          payload: {
            _isSaving: true,
          },
        });

        const url = decorateUrlWithItem(store[selectDeleteUrl](), item);
        if (url.indexOf("/:") !== -1 || url.indexOf("?:") !== -1) {
          // if we haven't filled in all of our params then bail
          return;
        } else {
          // remove the item from our state and update it internally
          const updatedState = store[selectState]();
          delete updatedState[item[config.uid]];
          dispatch({
            type: actions.UPDATED_ITEM,
            payload: updatedState,
          });

          // update the state on the server now
          apiDelete(url, null, (err, response, body) => {
            if (err || response.statusCode !== 200) {
              dispatch({
                type: actions.ERROR,
                payload: {
                  _err: { err: err, response: response },
                  notification: {
                    statusCode: response.statusCode,
                  },
                  _isSaving: false,
                },
              });
              if(store[selectAllowNotifications]()){
                notification("error")
              }
            } else {
              dispatch({
                type: actions.DELETE_FINISHED,
                payload: {
                  _isSaving: false,
                },
              });
              if (deferCallback && callback) callback();
            }
          });

          // if we get a callback, go ahead and fire it
          if (!deferCallback && callback) callback();
        }
      },

      [doChangeSelectedYear]: (item, callback, deferCallback) => ({
        dispatch,
        store,
        apiDelete,
      }) => {

        localStorage.setItem('fy',item)

        dispatch({
          type: actions.SELECT_CHANGE,
          payload: {
            _selectedYear: item,
          },
        });

      },

      [doStartEditing]: (obj) => ({
        dispatch,
        store,
      }) => {

        let id = null

        if(obj.hasOwnProperty("id")){
          id = obj.id
        }

        const oldState = store[selectItems]

        dispatch({
          type: actions.EDITING_STARTED,
          payload: {
            //_oldState: oldState,
            _isEditing: true,
            _updateModalOpen: true,
            _isEditingId: id
          },
        });        
      },
      [doCancelEditing]: () => ({
        dispatch,
        store,
      }) => {

        //const oldState = store[selectEditableFieldsData]()

        dispatch({
          type: actions.EDITING_CANCELED,
          payload: {
            //oldState,
            _isEditing:false,
            _updateModalOpen: false,
            _isEditingId: null
          },
        });        
      },
      [selectAbortReason]: (state) => {
        return state[config.name]._abortReason;
      },

      [selectForceFetch]: (state) => {
        return state[config.name]._forceFetch;
      },

      [selectFetchCount]: (state) => {
        return state[config.name]._fetchCount;
      },

      [selectLastFetch]: (state) => {
        return state[config.name]._lastFetch;
      },

      [selectLastResource]: (state) => {
        return state[config.name]._lastResource;
      },

      [selectState]: (state) => {
        return state[config.name];
      },

      [selectIsEditing]: (state) => {
        return state[config.name]._isEditing;
      },

      [selectIsUpdateModalOpen]: (state) => {
        return state[config.name]._updateModalOpen;
      },

      [selectIsEditingId]: (state) => {
        return state[config.name]._isEditingId;
      },

      [selectEditableFields]: (state) => {
        return state[config.name].editablefields;
      },

      [selectEditableFieldsData]: createSelector(
        selectEditableFields,
        selectState,
        (editableFields, currentState) => {
          const obj={}
          if(editableFields && editableFields.length>0) {
            for(let i=0;i<editableFields.length;i++) {
              obj[editableFields[i]]=currentState[editableFields[i]]
            }
          }
          return obj;
        }
      ),
     
      [selectIsLoading]: (state) => {
        return state[config.name]._isLoading;
      },

      [selectIsSaving]: (state) => {
        return state[config.name]._isSaving;
      },
      [selectIsEditing]: (state) => {
        return state[config.name]._isEditing;
      },
      [selectIsUpdateModalOpen]: (state) => {
        return state[config.name]._updateModalOpen;
      },
      [selectSelectedYear]: (state) => {
        return state[config.name]._selectedYear;
      },
      [selectIsEditingId]: (state) => {
        return state[config.name]._isEditingId;
      },
      [selectIsStale]: createSelector(
        "selectAppTime",
        selectLastFetch,
        (now, lastFetch) => {
          return now - new Date(lastFetch) > config.staleAfter;
        }
      ),

      [selectFlags]: createSelector(selectState, (state) => {
        const flags = {};
        Object.keys(state).forEach((key) => {
          if (key[0] === "_") flags[key] = state[key];
        });
        return flags;
      }),

      [selectItemsObject]: createSelector(selectState, (state) => {
        const items = {};
        Object.keys(state).forEach((key) => {
          if (key[0] !== "_") items[key] = state[key];
        });
        return items;
      }),

      [selectItemsArray]: createSelector(selectState, (state) => {
        const items = [];
        Object.keys(state).forEach((key) => {
          if (key[0] !== "_") items.push(state[key]);
        });
        return items;
      }),

      [selectItems]: createSelector(selectItemsArray, (items) => {
        return items;
      }),

      [selectSelectedItem]: createSelector(
        selectItems,
        selectSelectedYear,
        (items, year) => {
          const obj = find(items,function(item){ return item.year === year})
          return obj
        }
      ),

      [selectByRoute]: createSelector(
        selectItemsObject,
        "selectRouteParams",
        (items, params) => {
          if (params.hasOwnProperty(config.routeParam)) {
            if (items.hasOwnProperty(params[config.routeParam])) {
              return items[params[config.routeParam]];
            } else {
              return null;
            }
          } else {
            return null;
          }
        }
      ),

      [selectGetTemplate]: () => {
        return config.getTemplate;
      },

      [selectPutTemplate]: () => {
        return config.putTemplate;
      },

      [selectPostTemplate]: () => {
        return config.postTemplate;
      },
      [selectBulkPostTemplate]: () => {
        return config.bulkPostTemplate;
      },
      [selectDeleteTemplate]: () => {
        return config.deleteTemplate;
      },

      [selectGetUrl]: createSelector(
        selectGetTemplate,
        "selectRouteParams",
        "selectOrgsAdditionalParams",
        ...config.urlParamSelectors,
        (template, params, orgsAdditionalParams, ...args) => {
          const availableParams = Object.assign(
            {},
            params,
            orgsAdditionalParams,
            ...args
          );

          let url = template;
          Object.keys(availableParams).forEach((key) => {
            url = url.replace(`:${key}`, availableParams[key]);
          });
          return url;
        }
      ),

      [selectPutUrl]: createSelector(
        selectPutTemplate,
        "selectRouteParams",
        "selectOrgsAdditionalParams",
        ...config.urlParamSelectors,
        (template, params, orgsAdditionalParams, ...args) => {
          const availableParams = Object.assign(
            {},
            params,
            orgsAdditionalParams,
            ...args
          );
          let url = template;
          Object.keys(availableParams).forEach((key) => {
            url = url.replace(`:${key}`, availableParams[key]);
          });
          return url;
        }
      ),

      [selectPostUrl]: createSelector(
        selectPostTemplate,
        "selectRouteParams",
        "selectOrgsAdditionalParams",
        ...config.urlParamSelectors,
        (template, params, orgsAdditionalParams, ...args) => {
          const availableParams = Object.assign(
            {},
            params,
            orgsAdditionalParams,
            ...args
          );
          let url = template;
          Object.keys(availableParams).forEach((key) => {
            url = url.replace(`:${key}`, availableParams[key]);
          });
          return url;
        }
      ),
      [selectBulkPostUrl]: createSelector(
        selectBulkPostTemplate,
        "selectRouteParams",
        "selectOrgsAdditionalParams",
        ...config.urlParamSelectors,
        (template, params, orgsAdditionalParams, ...args) => {
          const availableParams = Object.assign(
            {},
            params,
            orgsAdditionalParams,
            ...args
          );
          let url = template;
          Object.keys(availableParams).forEach((key) => {
            url = url.replace(`:${key}`, availableParams[key]);
          });
          return url;
        }
      ),  
      [selectDeleteUrl]: createSelector(
        selectDeleteTemplate,
        "selectRouteParams",
        "selectOrgsAdditionalParams",
        ...config.urlParamSelectors,
        (template, params, orgsAdditionalParams, ...args) => {
          const availableParams = Object.assign(
            {},
            params,
            orgsAdditionalParams,
            ...args
          );
          let url = template;
          Object.keys(availableParams).forEach((key) => {
            url = url.replace(`:${key}`, availableParams[key]);
          });
          return url;
        }
      ),
      [selectStaleAfter]: () => {
        return config.staleAfter;
      },

      [selectAllowNotifications]: () => {
        return config.allowNotifications;
      },

      [selectAllowRoles]: (state) => {
        return state[config.name]._allowRoles;
      },

      [selectIsAllowedRole]: createSelector(
        selectAllowRoles,
        "selectTokenRolesJoined",
        "selectOrgsActiveSlug",
        checkRoles
      ),

      [selectDisallowRoles]: (state) => {
        return state[config.name]._disallowRoles;
      },

      [selectIsDisallowedRole]: createSelector(
        selectDisallowRoles,
        "selectTokenRolesJoined",
        "selectOrgsActiveSlug",
        checkRoles
      ),

      [reactShouldFetch]: (state) => {      
        if (state[config.name]._shouldFetch) return { actionCreator: doFetch };
      },
    },
    config.addons
  );
  
  if (config.persist) {
    result.persistActions = [
      actions.FETCH_STARTED,
      actions.FETCH_FINISHED,
      actions.FETCH_ABORT,
      actions.SAVE_STARTED,
      actions.SAVE_FINISHED,
      actions.DELETE_STARTED,
      actions.DELETE_FINISHED,
      actions.UPDATED_ITEM,
      actions.ERROR,
      actions.SELECT_CHANGE,
    ];
  }
  return result;
};
