import React from "react";
import RoleUserListItem from "./role-user-list-item";
import { connect } from "redux-bundler-react";

class RoleUserList extends React.Component {
  constructor(props) {
    super(props);
    this.renderItems = this.renderItems.bind(this);
  }

  renderItems() {
    const { approvalRolesPersonnelItems: users } = this.props;
    if (users.length === 0) {
      return (
        <li className="list-group-item">
          No users to show at this time, pick an organization above.
        </li>
      );
    } else {
      return users
        .sort((a, b) =>
          a.name
            .trim()
            .split(" ")
            .slice(-1)
            .join(" ")
            .localeCompare(b.name.trim().split(" ").slice(-1).join(" "))
        )
        .map((user, i) => {
          return <RoleUserListItem key={i} user={user} />;
        });
    }
  }
  render() {
    return <ul className="list-group mt-3">{this.renderItems()}</ul>;
  }
}

export default connect("selectApprovalRolesPersonnelItems", RoleUserList);
