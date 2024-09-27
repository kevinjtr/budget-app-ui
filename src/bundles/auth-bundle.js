import xhr from "xhr";
import { createSelector } from "redux-bundler";
import { formatDistanceToNow } from "date-fns";

const getTokenPart = function(token, part) {
  const splitToken = token.split(".");
  return splitToken[part];
};

const authBundle= {
  name: "auth",

  getReducer() {
    const initialData = {
      token: "",
      err: null,
      _shouldCheckToken: true,
      _lastChecked: 0,
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case "AUTH_LOGGING_IN":
        case "AUTH_LOGGED_IN":
        case "AUTH_LOGGED_ERROR":
        case "AUTH_CHECK_TOKEN":
        case "AUTH_LOOKING_FOR_TOKEN":
        case "AUTH_DONE_LOOKING_FOR_TOKEN":
          return Object.assign({}, state, payload);
        case "AUTH_LOGGED_OUT":
          return Object.assign({}, state, {
            token: "",
            err: null
          });
        case "APP_IDLE":
          return Object.assign({}, state, {
            _shouldCheckToken: true
          });
        default:
          return state;
      }
    };
  },  

  doLogin: () => ({ dispatch }) => {
    const url = `${process.env.REACT_APP_AUTH_ROOT}/login`;
    localStorage.removeItem('fy')

    dispatch({
      type: "AUTH_LOGGING_IN",
      payload: { isLoggingIn: true }
    });
    xhr.get(
      {
        url: url,
        withCredentials: false
      },
      (err, res, body) => {
        if (err) {
          dispatch({
            type: "AUTH_LOGGED_ERROR",
            payload: { token: "", err: err, isLoggingIn: false  }
          });
        } else {
          try {
            
            // test parse the token to make sure it's an actual token
            const parts = body.split(".");
            const head = window.atob(parts[1]);
            const json = JSON.parse(head); // eslint-disable-line no-unused-vars

            // if we're still alive we should be ok.

            localStorage.setItem('tokenBudget',body) // store token in local storage -JF
            dispatch({
              type: "AUTH_LOGGED_IN",
              payload: { token: body, err: null, isLoggingIn: false }
            });
          } catch (e) {
            dispatch({
              type: "AUTH_LOGGED_ERROR",
              payload: { token: "", err: e, isLoggingIn: false  }
            });
          }
        }
      }
    );
  },

    // Added doReload to check token on page refresh -JF
    doReload: () => ({dispatch,store}) => {
        dispatch({
            type: "AUTH_LOOKING_FOR_TOKEN",
            payload: { isLookingForToken: true }
        });

        try{
            const token = localStorage.getItem('tokenBudget')

            if(token){
              // parse value found in localstorage
              const parts = token.split(".");
              const head = window.atob(parts[1]);
              const json = JSON.parse(head);
              
              // check if token is expired
              if(Date.now() <= json.exp * 1000){
                  dispatch({
                      type: "AUTH_LOGGED_IN",
                      payload: { token: token, err: null }
                  });
              } 
            }
        } catch (e){
            console.log(e)
        }

        dispatch({
          type: "AUTH_DONE_LOOKING_FOR_TOKEN",
          payload: { isLookingForToken: false }
        });
    },

    // Added doReLogin to check token and then reauthenticate on page refresh -JF
    /*
    doReLogin: () => ({ dispatch }) => {
        const url = `${process.env.REACT_APP_AUTH_ROOT}/login`;
        dispatch({
            type: "AUTH_LOGGING_IN",
            payload: { isLoggingIn: true }
        });

        try{
            const token = localStorage.getItem('tokenBudget')

            // parse value found in localstorage
            const parts = token.split(".");
            const head = window.atob(parts[1]);
            const json = JSON.parse(head);
            
            // check if token is expired
            if(Date.now() <= json.exp * 1000){
                
                // if token is not expired, relogin/get new token.  -JF
                // this is a temporary solution and not a secure long-term solution -JF
                // user will be perpetually logged in as long as they return to site before their original token expires -JF
                xhr.get(
                    {
                        url: url,
                        withCredentials: false
                    },
                    (err, res, body) => {
                    if (err) {
                        dispatch({
                            type: "AUTH_LOGGED_ERROR",
                            payload: { token: "", err: err, isLoggingIn: false  }
                        });
                    } else {
                        try {

                            // test parse the token to make sure it's an actual token
                            const parts = body.split(".");
                            const head = window.atob(parts[1]);
                            const json = JSON.parse(head); // eslint-disable-line no-unused-vars

                            // if we're still alive we should be ok.

                            localStorage.setItem('tokenBudget',body) // store new token in local storage -JF
                            dispatch({
                                type: "AUTH_LOGGED_IN",
                                payload: { token: body, err: null }
                            });
                        } catch (e) {
                            dispatch({
                            type: "AUTH_LOGGED_ERROR",
                            payload: { token: "", err: e  }
                            });
                        }
                    }
                }
                );
            }
        } catch (e) {
            console.log(e)
        } finally {
            // a small timeout is required to prevent 'user is not found' message from appearing during reload -JF
            setTimeout(()=>{
                dispatch({
                    type: "AUTH_LOGGING_IN",
                    payload: { isLoggingIn: false }
                })
            },1000)
        }
    },
    */
    

  doLogout: () => ({ dispatch, store }) => {
    localStorage.removeItem('fy')
    const homepage = store.selectHomepage()
    store.doUpdateUrl(homepage || "/");
    localStorage.removeItem('tokenBudget') // Remove token from localStorage -JF
    dispatch({ type: "AUTH_LOGGED_OUT" });
  },

  doAuthCheckToken: () => ({ dispatch, store }) => {
    dispatch({
      type: "AUTH_CHECK_TOKEN",
      payload: {
        _shouldCheckToken: false,
        _lastChecked: new Date()
      }
    });
    const isExpired = store.selectIsTokenExpired();
    if (isExpired) store.doLogout();
  },

  selectIsLoggedIn: state => {
    return !!state.auth.token;
  },

  selectTokenRaw: state => {
    return state.auth.token;
  },

  selectAuthLastChecked: state => {
    return state.auth._lastChecked;
  },
  selectAuthIsLoggingIn: state => {
    return state.auth.isLoggingIn;
  },
  selectAuthIsLookingForToken: state => {
    return state.auth.isLookingForToken;
  },
  selectIsTokenFound: createSelector("selectTokenRaw", token => {
    return !!token
  }),

  selectIsTokenExpired: createSelector(
    "selectIsLoggedIn",
    "selectTokenPayload",
    (isLoggedIn, payload) => {
      if (!isLoggedIn) return false;
      return payload.exp < Math.floor(Date.now() / 1000);
    }
  ),

  selectTokenExpiresIn: createSelector(
    "selectIsLoggedIn",
    "selectTokenPayload",
    (isLoggedIn, payload) => {
      if (!isLoggedIn) return false;
      return formatDistanceToNow(payload.exp * 1000);
    }
  ),

  selectTokenHeader: createSelector("selectTokenRaw", token => {
    if (!token) return {};
    return JSON.parse(window.atob(getTokenPart(token, 0)));
  }),

  selectTokenPayload: createSelector("selectTokenRaw", token => {
    if (!token) return {};
    return JSON.parse(window.atob(getTokenPart(token, 1)));
  }),

  selectTokenUsername: createSelector("selectTokenPayload", payload => {
    if (!payload.hasOwnProperty("name")) return null;
    return payload.name;
  }),

  selectTokenEdipi: createSelector("selectTokenPayload", payload => {
    if (!payload.hasOwnProperty("sub")) return null;
    return payload.sub;
  }),

  selectTokenRoles: createSelector("selectTokenPayload", payload => {
    if (!payload.hasOwnProperty("roles")) return [];
    return payload.roles;
  }),

  selectTokenRolesJoined: createSelector("selectTokenRoles", roles => {
    if (!roles) return null;
    return roles;
    // return roles.map((r) => { r.pop(); return r.join('.')});
  }),

  selectTokenGroups: createSelector("selectTokenRoles", roles => {
    if (!roles) return null;
    return roles.map(role => {
      const groupRole = role.split(".");
      return groupRole[0];
    });
  }),

  selectTokenGroupRoles: createSelector("selectTokenRoles", roles => {
    if (!roles) return null;
    const groupRoles = {};
    roles.forEach(role => {
      const groupRole = role.split(".");
      if (!groupRoles.hasOwnProperty(groupRole[0]))
        groupRoles[groupRole[0]] = [];
      groupRoles[groupRole[0]].push(groupRole[1]);
    });
    return groupRoles;
  }),

  reactAuthShouldCheckToken: state => {
    if (state.auth._shouldCheckToken) {
      if (new Date() - state.auth._lastChecked > 60000)
        return { actionCreator: "doAuthCheckToken" };
    }
  },
    // Call reload token from local storage on initialization -JF
    init: store=>{
        store.doReload()
    }

  // persistActions: ["AUTH_LOGGED_IN", "AUTH_LOGGED_OUT"]
};

export default authBundle