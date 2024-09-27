import React from "react";
import { connect } from "redux-bundler-react";
import Loader from "../loader";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.renderContent = this.renderContent.bind(this);
  }

  renderContent() {
    const { isLoggedIn } = this.props;
    if (isLoggedIn) {
      return (
        <div style={{ marginTop: "50%", marginBottom: "50%" }}>
          <Loader opt="dissolving-cube" />
        </div>
      );
    }
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

export default connect(
  "selectIsLoggedIn",
  Home
);
