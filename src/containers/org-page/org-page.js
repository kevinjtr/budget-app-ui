import React from "react";
import { connect } from "redux-bundler-react";
import OrgList from "./org-list";

class OrgListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: ""
    };
    this.updateSearch = this.updateSearch.bind(this);
  }

  updateSearch(e) {
    const val = e.currentTarget.value;
    this.setState({
      searchTerm: val
    });
  }

  render() {
    const { orgsItems: orgs, orgsForUser, orgsIsLoading } = this.props;

    if (!orgsForUser) return null;

    const { searchTerm } = this.state;
    const myOrgs = orgs
      .filter(org => {
        const isMember = orgsForUser.indexOf(org) !== -1;
        const hasRequested = org.has_requested;
        return isMember || hasRequested;
      })
      .sort((orgA, orgB) => {
        const memberA = orgsForUser.indexOf(orgA) !== -1;
        const memberB = orgsForUser.indexOf(orgB) !== -1;
        if (memberA) {
          if (memberB) {
            // member of both
            return orgA.name > orgB.name ? 1 : -1;
          } else {
            // member of a but not b
            return -1;
          }
        } else {
          if (memberB) {
            // member of b but not a
            return 1;
          } else {
            // not a member of either
            return orgA.name > orgB.name ? 1 : -1;
          }
        }
      });

    const otherOrgs = orgs.filter(org => {
      const isMember = orgsForUser.indexOf(org) !== -1;
      const hasRequested = org.has_requested;
      const matcher = new RegExp(searchTerm, "ig");
      return (
        matcher.test(Object.values(org).join(" ")) &&
        !(isMember || hasRequested)
      );
    });

    return (
      <div className="container" style={{ marginTop: "80px" }}>
        <h5 className="mb-4 text-muted">
          Welcome to the Engineering Budget Application, choose your
          organization to get started
        </h5>
        <h5>My Organizations</h5>
        <div className="row">
          <OrgList orgs={myOrgs} loading={orgsIsLoading} />
        </div>
        <h5>Find Organizations</h5>
        <div className="row">
          <div className="col-lg-12 mb-4">
            <input
              className="form-control"
              type="text"
              onChange={this.updateSearch}
              value={searchTerm}
              placeholder="Search Organizations..."
            ></input>
          </div>
        </div>
        <div className="row">
          <OrgList orgs={otherOrgs} loading={orgsIsLoading} />
        </div>
      </div>
    );
  }
}

export default connect(
  "selectOrgsItems",
  "selectOrgsForUser",
  "selectOrgsIsLoading",
  "doOrgsShouldLoadItems",
  OrgListPage
);
