import React from "react";
import { connect } from "redux-bundler-react";
import OrgPage from "../org-page/org-page";
import FourOhThree from "../../components/four-oh-three";
import FourOhFour from "../../components/four-oh-four";

class OrgProvider extends React.Component {
  render() {
    const { orgsByRoute, tokenGroups, routeInfo, isTokenFound, children } = this.props;
    if (routeInfo.pattern === "*") {
      return <FourOhFour />;
    } else if (orgsByRoute && tokenGroups.indexOf(orgsByRoute.alias) !== -1) {
      return <>{children}</>;
    } else if (!orgsByRoute && isTokenFound) {
      return <OrgPage />;
    } else {
      return <FourOhThree />;
    }
  }
}

export default connect(
  "selectOrgsByRoute",
  "selectTokenGroups",
  "selectRouteInfo",
  "selectIsTokenFound",
  OrgProvider
);
