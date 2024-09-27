import { debounce} from "lodash";

function calculateBreakpoint(innerWidth) {
  return innerWidth < 576
    ? "xs"
    : innerWidth < 768
    ? "sm"
    : innerWidth < 992
    ? "md"
    : innerWidth < 1200
    ? "lg"
    : "xl";
}

export default {
  name: "ui",

  getReducer() {
    const innerWidth = window.innerWidth;
    const breakpoint = calculateBreakpoint(innerWidth);
    const showWidths = ["md", "lg", "xl"];

    const initialState = {
      sidebarMinimized: false,
      sidebarShow: window.localStorage.getItem('side-bar-min') != null ? JSON.parse(window.localStorage.getItem('side-bar-min')) : true,
      breakpoint: breakpoint,
      shouldUpdateViewBreakpoint: true
    };

    return (state = initialState, { type, payload }) => {
      switch (type) {
        case "UI_TOGGLE_SIDEBAR_MINIMIZED":
        case "UI_TOGGLE_SIDEBAR_SHOW":
        case "UI_UPDATE_VIEW_BREAKPOINT":
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    };
  },

  doUiUpdateViewBreakpoint: e => ({ dispatch }) => {
    const innerWidth = e.target.innerWidth;
    const breakpoint = calculateBreakpoint(innerWidth);
    dispatch({
      type: "UI_UPDATE_VIEW_BREAKPOINT",
      payload: { breakpoint: breakpoint }
    });
  },

  doUiToggleSidebarMinimized: () => ({ dispatch, store }) => {
    dispatch({
      type: "UI_TOGGLE_SIDEBAR_MINIMIZED",
      payload: { sidebarMinimized: !store.selectUiSidebarMinimized() }
    });
  },

  doUiToggleSidebarShow: () => ({ dispatch, store }) => {
    const temp_val = !store.selectUiSidebarShow()
    window.localStorage.setItem('side-bar-min', temp_val)
    dispatch({
      type: "UI_TOGGLE_SIDEBAR_SHOW",
      payload: { sidebarShow: temp_val }

    });
  },

  selectUiSidebarMinimized: state => {
    return state.ui.sidebarMinimized;
  },

  selectUiSidebarShow: state => {
    return state.ui.sidebarShow;
  },

  selectUiBreakpoint: state => {
    return state.ui.breakpoint;
  },

  init: store => {

    window.addEventListener(
      "resize",
      debounce(store.doUiUpdateViewBreakpoint, 200)
    );
  }
};
