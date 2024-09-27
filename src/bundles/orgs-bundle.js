import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";

export default createRestBundle({
  name: "orgs",
  uid: "slug",
  prefetch: true,
  staleAfter: 900000,
  persist: false,
  routeParam: "orgSlug",
  getTemplate: "/orgs",
  putTemplate: "",
  postTemplate: "",
  bulkPostTemplate:"",
  deleteTemplate: "",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  forceFetchActions: ["ORG_REQUEST_TO_JOIN_FINISHED"],
  addons: {
    selectOrgsItemsAsOptions: createSelector("selectOrgsItems", items => {
      const arr = items.map(item => {
        return {
          value: item.slug,
          label: item.name
        };
      });
      arr.sort((a, b) => {
        let s = 0;
        if (a.label === b.label) return s;
        s = a.label > b.label ? 1 : -1;
        return s;
      });
      return arr;
    }),
    selectOrgsAdditionalParams: createSelector("selectOrgsByRoute", org => {
      if (!org) return {};
      return {
        authOrgId: org.id
      };
    }),
    selectOrgsForUser: createSelector(
      "selectOrgsItems",
      "selectTokenGroupRoles",
      (orgs, tokenOrgRoles) => {
        if (!orgs) return null;
        if (!tokenOrgRoles) return null;
        const userOrgs = Object.keys(tokenOrgRoles);
        return orgs.filter(org => {
          if (!org || !org.name) return false;
          return userOrgs.indexOf(org.alias.toUpperCase()) !== -1;
        });
      }
    ),
    selectOrgsActiveSlug: createSelector("selectOrgsByRoute", org => {
      if (!org) return null;
      return org.slug;
    }),
    selectOrgsAsTree: createSelector(
      "selectOrgsItems",
      "selectOrgsForUser",
      (items, orgsForUser) => {
        if (!items) return null;
        const tree = {};
        items.forEach(item => {
          item.is_member = orgsForUser.indexOf(item) !== -1;
          item.children = [];
          if (!tree.hasOwnProperty(item.id)) {
            tree[item.id] = item;
          } else {
            item.children = tree[item.id].children;
            tree[item.id] = item;
          }
          if (!item.parent_id) item.parent_id = "root";
          if (!tree.hasOwnProperty(item.parent_id)) {
            tree[item.parent_id] = { children: [] };
          }
          tree[item.parent_id].children.push(item);
        });
        return tree;
      }
    ),
    doOrgsRequestToJoin: org => ({ dispatch, apiPost }) => {
      apiPost(`/orgs/${org.slug}/access`, {}, (err, response, body) => {
        if (err) {
          dispatch({ type: "ORG_REQUEST_TO_JOIN_FAILED" });
        } else {
          dispatch({ type: "ORG_REQUEST_TO_JOIN_FINISHED" });
        }
      });
    }
  }
});
