import pkg from "../../package.json";
const cacheKey = `${pkg.name}-${pkg.version}-hide-notes`;

export default {
  name: "about",

  getReducer() {
    const initialData = {
      dontshow: window.localStorage.getItem(cacheKey) === "true",
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case "ABOUT_CLEAR":
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    };
  },

  selectAboutDontshow: (state) => {
    return state.about.dontshow;
  },

  doAboutClear: (dontshow) => ({ dispatch, store }) => {
    window.localStorage.setItem(cacheKey, `${dontshow}`);
    dispatch({
      type: "ABOUT_CLEAR",
      payload: {
        dontshow: dontshow,
      },
    });
    store.doDialogClose();
  },
};
