import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";

export default createRestBundle({
  name: "appRoles",
  uid: "id",
  prefetch: false,
  staleAfter: 900000,
  persist: false,
  routeParam: null,
  getTemplate: `/roles`,
  putTemplate: "",
  postTemplate: "",
  bulkPostTemplate:"",
  deleteTemplate: "",
  fetchActions: [],
  addons: {
    selectAppRolesHidden: createSelector("selectOrgsByRoute", org => {
      if (!org || org.slug != 'app') {
        const hiddenRoles = ["PUBLIC", "SYSADMIN"];
        return hiddenRoles;
      } else {
        const hiddenRoles = ["PUBLIC"];
        return hiddenRoles;
      }
    }),
    selectAppRolesItemsFiltered: createSelector(
      "selectAppRolesItems",
      "selectAppRolesHidden",
      (items, hidden) => {
        return items.filter(role => {
          return hidden.indexOf(role.roleName) === -1;
        });
      }
    )
  }
});
