import React from "react";
import { connect } from "redux-bundler-react";

const fullPageRoutes = ["/backlog", "/references", "/release-notes"];

class FullPageProvider extends React.Component {
  render() {
    const { children, route: Route, routeInfo } = this.props;
    if (fullPageRoutes.indexOf(routeInfo.pattern) !== -1) {
      return <Route />;
    } else {
      return <>{children}</>;
    }
  }
}

export default connect("selectRoute", "selectRouteInfo", FullPageProvider);
