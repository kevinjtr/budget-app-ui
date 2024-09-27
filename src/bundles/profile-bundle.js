import createRestBundle from "./create-profile-rest-bundle";
import { createSelector } from "redux-bundler";

export default createRestBundle({
  name: "profile",
  uid: "id",
  prefetch: true,
  staleAfter: 900000,
  persist: false,
  routeParam: "profileSlug",
  getTemplate: "/profile",
  putTemplate: "/profile/:item.id",
  postTemplate: "/profile",
  bulkPostTemplate:"",
  deleteTemplate: "",
  fetchActions: ["AUTH_LOGGED_IN"],
  forceFetchActions: ["PROFILE_SAVE_FINISHED"],
  addons: {
    selectProfileActive: createSelector("selectProfileItems", profileItems => {      
      if (profileItems.length < 1) return null;
      return profileItems[0];
    }),
    selectProfileId: createSelector("selectProfileActive", profileActive => {
      if (!profileActive) return null;
      return profileActive.ID;
    })
  }
});
