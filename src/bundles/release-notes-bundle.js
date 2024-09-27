import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";
import {marked} from "marked";
import purify from "dompurify";

export default createRestBundle({
  name: "releaseNotes",
  uid: "id",
  prefetch: true,
  staleAfter: 1000*60*60,
  persist: false,
  routeParam: null,
  getTemplate: "/releasenotes",
  putTemplate: "/releasenotes/:item.id",
  postTemplate: "/releasenotes",
  bulkPostTemplate:"",
  deleteTemplate: "/releasenotes/:item.id",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  forceFetchActions: [
    "RELEASENOTES_SAVE_FINISHED",
    "RELEASENOTES_DELETE_FINISHED"
  ],
  allowNotifications: true,
  addons: {
    selectReleaseNotesItemsParsed: createSelector(
      "selectReleaseNotesItems",
      items => {
        return items
          .map(item => {
            item.html = purify.sanitize(marked(item.note));
            return item;
          })
          .sort((a, b) => {
            if (a.version > b.version) return -1;
            if (a.version < b.version) return 1;
            return 0;
          });
      }
    )
  }
});
