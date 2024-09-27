import { waterfall, parallel } from "async";
import { createSelector } from "redux-bundler";

const fetchActions = ["APPROLES_FETCH_FINISHED", "URL_UPDATED"];

export default {
  name: "orgRoles",

  getReducer: () => {
    const initialData = {
      _err: null,
      _isSaving: false,
      _isLoading: false,
      _shouldFetch: false,
      _lastResource: null
    };

    return (state = initialData, { type, payload }) => {
      if (fetchActions.indexOf(type) !== -1) {
        return Object.assign({}, state, { _shouldFetch: true });
      }

      switch (type) {
        case "ORG_ROLES_FETCH_STARTED":
        case "ORG_ROLES_FETCH_FINISHED":
        case "ORG_ROLES_ERROR":
        case "ORG_ROLES_CHANGED":
        case "ORG_ROLES_UPDATE_FINISHED":
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    };
  },

  doOrgRolesFetch: () => ({ dispatch, store, apiGet }) => {
    dispatch({
      type: "ORG_ROLES_FETCH_STARTED",
      payload: { _shouldFetch: false, _isLoading: true }
    });

    // we only really care to fetch if were at /:orgSlug/users
    const path = store.selectPathname();
    if (path.indexOf("/users") === -1) {
      return dispatch({
        type: "ORG_ROLES_FETCH_ABORTED",
        payload: {
          _isLoading: false
        }
      });
    }

    const org = store.selectOrgsByRoute();
    const roles = store.selectAppRolesItems();

    let url = `/roles/${org.slug}/members`;

    // if there's no org loaded, then bail
    if (!org) return;

    const requests = {};
    roles.forEach(role => {
      requests[role.id] = function (callback) {
        apiGet(`${url}/${role.id}`, (err, response, body) => {
          if (err || !response.statusCode === 200) {
            return callback(response);
          } else {
            const data = JSON.parse(body);
            return callback(null, data);
          }
        });
      };
    });

    parallel(requests, (err, results) => {
      if (err) {
        dispatch({
          type: "ORG_ROLES_ERROR",
          payload: { _err: { err: err, _isLoading: false, _lastResource: url } }
        });
      } else {
        const flags = store.selectOrgRolesFlags();
        dispatch({
          type: "ORG_ROLES_FETCH_FINISHED",
          payload: {
            ...results,
            ...flags,
            ...{ _isLoading: false, _lastResource: url }
          }
        });
      }
    });
  },

  doOrgRolesChange: (user, roleId, fetch) => ({
    dispatch,
    store,
    apiPost
  }) => {
    // grab the current state
    const org = store.selectOrgsByRoute();
    const roles = store.selectOrgRolesItemsObject();
    const flags = store.selectOrgRolesFlags();
    let removeFromId = null;
    // delete user from existing role
    Object.keys(roles).forEach(key => {
      const idx = roles[key].indexOf(user);
      if (idx !== -1) {
        removeFromId = key;
        roles[key].splice(idx, 1);
      }
    });

    // add to new role
    if (roleId) {
      if (!roles[roleId]) roles[roleId] = [];
      roles[roleId].push(user);
    }

    // dispatch lcoal change
    dispatch({
      type: "ORG_ROLES_CHANGED",
      payload: {
        ...roles,
        ...flags,
        ...{ _isSaving: true }
      }
    });
    
    const postBody = {
      users_id: user.userNumber,
      org_id: org.id,
    }
    if(removeFromId) {
      postBody.remove_roles_id=removeFromId;
    }
    if(roleId) {
      postBody.add_roles_id=roleId;
    }
    // save changes to database
    if(fetch=false) {
      dispatch({
        type: "ORG_ROLES_UPDATE_FINISHED",
        payload: { _err: null, _isSaving: false, _shouldFetch: true }
      });
    }else{
      const postUrl = `/orgs/${org.slug}/orgroles`;
      apiPost(postUrl, postBody, (err, response, body) => {
        if (err || response.statusCode !== 200) {
          dispatch({
            type: "ORG_ROLES_ERROR",
            payload: { _err: err, _isSaving: false, _shouldFetch: true }
          });
        } else {
          dispatch({
            type: "ORG_ROLES_UPDATE_FINISHED",
            payload: { _err: null, _isSaving: false, _shouldFetch: true }
          });
        }
      });     
    }
    
  },

  selectOrgRolesLastResource: state => {
    return state.orgRoles._lastResource;
  },

  selectOrgRolesState: state => {
    return state.orgRoles;
  },

  selectOrgRolesIsLoading: state => {
    return state.orgRoles._isLoading;
  },

  selectOrgRolesIsSaving: state => {
    return state.orgRoles._isSaving;
  },

  selectOrgRolesFlags: createSelector("selectOrgRolesState", state => {
    const flags = {};
    Object.keys(state).forEach(key => {
      if (key[0] === "_") flags[key] = state[key];
    });
    return flags;
  }),

  selectOrgRolesItemsObject: createSelector("selectOrgRolesState", state => {
    const items = {};
    Object.keys(state).forEach(key => {
      if (key[0] !== "_") items[key] = state[key];
    });
    return items;
  }),

  selectOrgRolesByUser: createSelector("selectOrgRolesItemsObject", roles => {
    const out = {};
    Object.keys(roles).forEach(key => {
      roles[key].forEach(user => {
        if (!out.hasOwnProperty(user.id)) out[user.id] = user;
        if (!out[user.id].hasOwnProperty("roles")) out[user.id].roles = [];
        out[user.id].roles.push(key);
      });
    });
    return Object.values(out);
  }),

  reactOrgRolesShouldFetch: state => {
    if (state.orgRoles._shouldFetch)
      return { actionCreator: "doOrgRolesFetch" };
  }
};
