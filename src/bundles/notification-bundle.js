const errorMessages = {
  "200": {
    title: "Successful Request",
    level: "success",
    message: "API request was successful."
  },
  "401": {
    title: "Permissions Error",
    level: "warning",
    message:
      "You do not have permissions to perform the requested function, if this is in error please contact your organization admin."
  },
  "404": {
    title: "Not Found",
    level: "error",
    message:
      "The API resource requested was not found, please contact the site admin."
  },
  "500": {
    title: "Server Error",
    level: "error",
    message:
      "Sorry for the inconvenience, we seem to be having some server issues, please be patient.  If this continues please contact your organization admin."
  }
};

export default {
  name: "notifications",

  getReducer() {
    const initialData = {
      options: null
    };

    return (state = initialData, { type, payload }) => {
      if (type === "NOTIFICATIONS_FIRE") {
        return Object.assign({}, state, payload);
      }

      if (type === "NOTIFICATIONS_CLEAR") {
        return Object.assign({}, state, { options: null });
      }

      if (payload && payload.notification) {
        if (payload.notification.statusCode) {
          if (payload.notification.statusCode === 401) return state;
          const { statusCode } = payload.notification;
          if (errorMessages.hasOwnProperty(statusCode.toString())) {
            return Object.assign({}, state, {
              options: errorMessages[payload.notification.statusCode.toString()]
            });
          } else {
            return Object.assign({}, state, {
              options: {
                title: "Unspecified Error",
                level: "error",
                message: `We've encountered an interesting error, please contact your org admin with this information:
                  ${statusCode}
                  `
              }
            });
          }
        } else {
          return Object.assign({}, state, {
            options: {
              title: payload.notification.title || "ERROR",
              level: payload.notification.level || "error",
              message:
                payload.notification.message ||
                JSON.stringify(payload.notification)
            }
          });
        }
      }

      return state;
    };
  },

  doFireNotification: options => ({ dispatch, payload }) => {
    dispatch({ type: "NOTIFICATIONS_FIRE", payload: { options } });
  },

  doClearNotification: () => ({ dispatch }) => {
    dispatch({ type: "NOTIFICATIONS_CLEAR" });
  },

  selectActiveNotification: state => {
    return state.notifications.options;
  }
};
