import React from "react";
import { connect } from "redux-bundler-react";

class NewUsersListItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleAssign = this.handleAssign.bind(this);
    this.handleReject = this.handleReject.bind(this);
  }

  handleAssign(e) {
    const { user, doAccessRequestAccept } = this.props;
    doAccessRequestAccept(user, e.target.dataset.role);
  }

  handleReject() {
    const { user, doAccessRequestDelete } = this.props;
    doAccessRequestDelete(user);
  }

  render() {
    const { user, appRolesItemsFiltered } = this.props;
    return (
      <li className="list-group-item">
        <div className="row">
          <span className="col-sm-3">{user.userName}</span>

          {appRolesItemsFiltered.map((role, i) => {
            return (
              <span key={i} className="col-sm">
                <button
                  onClick={this.handleAssign}
                  className="btn btn-sm btn-primary"
                  data-role={role.id}
                >
                  {`Add User as ${role.roleName}`}
                </button>
              </span>
            );
          })}

          <span className="col-sm">
            <span className="float-right">
              <button
                onClick={this.handleReject}
                className="btn btn-sm btn-danger"
              >
                Reject Request
              </button>
            </span>
          </span>
        </div>
      </li>
    );
  }
}

export default connect(
  "doAccessRequestAccept",
  "doAccessRequestDelete",
  "selectAppRolesItemsFiltered",
  NewUsersListItem
);
