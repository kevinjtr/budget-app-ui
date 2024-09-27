import pkg from "../../package.json";
import Url from "url-parse";
import { createSelector } from "redux-bundler";

const RE_FETCH_BUNDLES = ["AccessRequest", "Domains", "Poc", "Orgs", "Fy", "Project", "Profile", "ReleaseNotes", "FySettings"]
const HIDE_FY_SELECT = ['/users',"/fiscalYearSettings"]

export default {
  name: "nestedUrl",

  doUpdateUrlWithHomepage: path => ({ store }) => {
    if (!pkg || !pkg.homepage) return store.doUpdateUrl(path);
    store.doUpdateUrl(`${pkg.homepage}${path}`);
  },

  
  doNewFySelectedFetchData: path => ({ store }) => {
    RE_FETCH_BUNDLES.map(bundleUcaseName => {
      store[`do${bundleUcaseName}ForceFetch`]()
    })
  },

  doUpdateUrlWithHomepageAndFetchData: path => ({ store }) => {
    if (!pkg || !pkg.homepage) return store.doUpdateUrl(path);
    store.doUpdateUrl(`${pkg.homepage}${path}`);

    RE_FETCH_BUNDLES.map(bundleUcaseName => {
      store[`do${bundleUcaseName}Fetch`]()
    })
  },

  selectHomepage: state => {
    if (!pkg || !pkg.homepage) return "";
    const url = new Url(pkg.homepage);
    return url.pathname;
  },

  selectPathnameMinusHomepage: createSelector(
    "selectPathname",
    "selectHomepage",
    (pathname, homepage) => {
      const matcher = new RegExp(homepage);
      return pathname.replace(matcher, "");
    }
  ),

  selectFyHiddenSelectPaths: createSelector(
    "selectPathname",
    (pathname) => {
      let found = false

      HIDE_FY_SELECT.map(path => {
        if(pathname.includes(path)){
          found = true
        }
      })

      return found
    }
  ),

  selectPathnameMinusHomepageAndFy: createSelector(
    "selectPathname",
    "selectHomepage",
    "selectFySelectedYear",
    "selectOrgsByRoute",
    (pathname, homepage, fySelected, orgs) => {
      const matcher1 = new RegExp(homepage);
      const matcher2 = new RegExp(`/${fySelected}`);
      const matcher3 = new RegExp(`/${orgs?.slug}`);

      return pathname.replace(matcher1, "").replace(matcher2, "").replace(matcher3, "");
    }
  ),
  selectPathnameMinusHomepageAndOrg: createSelector(
    "selectPathname",
    "selectHomepage",
    "selectFySelectedYear",
    "selectOrgsByRoute",
    (pathname, homepage, fySelected, orgs) => {
      const matcher1 = new RegExp(homepage);
      const matcher3 = new RegExp(`/${orgs?.slug}`);

      return pathname.replace(matcher1, "").replace(matcher3, "");
    }
  ),

  selectPublicFolder: createSelector(
    "selectHomepage",
    homepage => {
      if (process.env.NODE_ENV !== "production") return "";
      return `${homepage}/`;
    }
  )
};
