import React from "react";
import { connect } from "redux-bundler-react";

export default connect("selectApiRoot", ({ apiRoot }) => {
  if (process.env.REACT_APP_DEPLOY_ENV !== "development") return null;
  return (
    <>
      <div
        className="bg-warning text-center"
        style={{ position: "fixed", width: "100%", zIndex: 9999 }}
      >
        Running in development / test mode against {apiRoot}
      </div>
      <div
        className="bg-warning text-center"
        style={{ position: "fixed", bottom: 0, width: "100%", zIndex: 9999 }}
      >
        Running in development / test mode against {apiRoot}
      </div>
    </>
  );
});
