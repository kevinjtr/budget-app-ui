import React from "react";
import { connect } from "redux-bundler-react";
import DrawerOpen from "./drawerOpen";
import DrawerClosed from "./drawerClosed";

class DrawerContent extends React.Component {
  render() {
    const {
      uiSidebarShow: open,
      isLoggedIn,
    } = this.props;

    if (!isLoggedIn) return null;

    return (
      open ? <DrawerOpen/> : <DrawerClosed />
    );
  }
}

export default connect(
  "selectIsLoggedIn",
  "selectUiSidebarShow",
  "doUiToggleSidebarShow",
  "selectOrgsByRoute",
  DrawerContent
);

