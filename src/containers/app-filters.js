import React from "react";
import { connect } from "redux-bundler-react";
import AuthProvider from "./context-providers/auth-provider";
import OrgProvider from "./context-providers/org-provider";
import OrgContainer from "./org-container";
import FullPageProvider from "./context-providers/full-page-provider";
import MainContainer from "./main-container";

class Filters extends React.Component {
  render() {
    return (
      <AuthProvider>
        <MainContainer>
          <FullPageProvider>
            <OrgProvider>
              <OrgContainer />
            </OrgProvider>
          </FullPageProvider>
        </MainContainer>
      </AuthProvider>
    );
  }
}

export default connect(Filters);
