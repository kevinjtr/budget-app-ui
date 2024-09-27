// display children only if the orgSlug in the url matches the provided orgs
import React from "react";
import { connect } from "redux-bundler-react";

export default connect(
  "selectRouteParams",
  ({ routeParams, allowOrgs = [], children }) => {
    const org = routeParams.orgSlug;
    if (allowOrgs.indexOf(org) === -1) return null;
    return <>{children}</>;
  }
);
