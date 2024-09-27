export default {
  name: "dialog",

  getReducer: () => {
    const initialData = {
      content: null,
      props: null,
      size: null
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case "DIALOG_OPENED":
        case "DIALOG_CLOSED":
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    };
  },

  doDialogOpen: ({ content, props, size }) => ({ dispatch }) => {
    dispatch({
      type: "DIALOG_OPENED",
      payload: {
        content: content,
        props: props,
        size: size
      }
    });
  },

  doDialogClose: () => ({ dispatch }) => {
    dispatch({
      type: "DIALOG_CLOSED",
      payload: {
        content: null,
        props: null,
        size: null
      }
    });
  },

  selectDialogContent: state => {
    return state.dialog.content;
  },

  selectDialogProps: state => {
    return state.dialog.props;
  },

  selectDialogSize: state => {
    return state.dialog.size;
  }
};
