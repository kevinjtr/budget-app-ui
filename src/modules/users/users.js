import React from "react";
import { connect } from "redux-bundler-react";
import { sortBy } from "lodash";
import UsersListItem from "./users-list-item";
import NewUsersListItem from "./new-users-list-item";
import Loader from "../../components/loader";

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.renderList = this.renderList.bind(this);
  }
  componentDidMount() {
    const { doAppRolesFetch, doOrgUsersFetch } = this.props;
    doAppRolesFetch();
    doOrgUsersFetch();
  }

  renderList() {
    const { orgRolesByUser: users, orgRolesIsLoading } = this.props;
    const sorted = sortBy(users, ["userName"]);
    if (orgRolesIsLoading) {
      return <Loader />;
    } else {
      return (
        <>
          {sorted.map((user, i) => {
            return <UsersListItem key={i} user={user}></UsersListItem>;
          })}
        </>
      );
    }
  }

  render() {
    const { accessRequestItems: requests } = this.props;
    return (
      <div className="container-fluid mt-4">
        <div className="card">
          <div className="card-header">
            <i className="mdi mdi-account-multiple-outline"></i> Active Users
          </div>
          <div className="card-body">
            <ul className="list-group">{this.renderList()}</ul>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <i className="mdi mdi-account-multiple-outline"></i> Membership
            Requests
          </div>
          <div className="card-body">
            <ul className="list-group">
              {requests.map((user, i) => {
                return (
                  <NewUsersListItem key={i} user={user}></NewUsersListItem>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  "doOrgRolesFetch",
  "doAppRolesFetch",
  "doOrgUsersFetch",
  "selectOrgRolesByUser",
  "selectAccessRequestItems",
  "selectOrgRolesIsLoading",
  Users
);
