export default {
  name: "userpreferences",

  getReducer() {

    const initialState = {
      darkMode: window.localStorage.getItem('dark-mode') != null ? JSON.parse(window.localStorage.getItem('dark-mode')) : false,
      uploading: false,
      complete: false,
    };

    return (state = initialState, { type, payload }) => {
      switch (type) {
        case "UI_TOGGLE_DARK_MODE":
        case "DOC_UPLOAD_STARTED":
        case "DOC_UPLOAD_COMPLETED":
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    };
  },

  doToggleDarkMode: () => ({ dispatch, store }) => {
    const temp_val = !store.selectUserDarkMode()
    window.localStorage.setItem('dark-mode', temp_val)

    dispatch({
      type: "UI_TOGGLE_DARK_MODE",
      payload: { darkMode: temp_val }
    });
  },

  selectUserDarkMode: state => {
    return state.userpreferences.darkMode;
  },
  selectUserUploadingDoc: state => {
    return state.userpreferences.uploading;
  },
  selectUserUploadingComplete: state => {
    return state.userpreferences.complete;
  },
  doAdminDocUpload: (files, selects, fetch) => ({
    dispatch,
    store,
    apiAxiosPost
  }) => {
    const {select1, select2, select3, year} = selects

    dispatch({
      type: "DOC_UPLOAD_STARTED",
      payload: { uploading: true }
    });

    if(files.length != 0){
      var formData = new FormData();
      formData.append('file', files[0]);
      const opt1 = select1 == -1 ? year : select1
      const url = `/app/upload/${opt1}/${select2}/${select3}`

      if(opt1 && select2 && select3){
        apiAxiosPost(url, formData).then(() => {
          dispatch({
            type: "DOC_UPLOAD_COMPLETED",
            payload: { uploading: false, complete: true }
          });
        })
      }else{
        dispatch({
          type: "DOC_UPLOAD_COMPLETED",
          payload: { uploading: false }
        });
      }
    }
  }
};
  
