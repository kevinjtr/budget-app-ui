import React from "react";
import { connect } from "redux-bundler-react";

class UsersListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isConfirmingRemove: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleCancelRemove = this.handleCancelRemove.bind(this);
    this.handleConfirmRemove = this.handleConfirmRemove.bind(this);
    this.renderActions = this.renderActions.bind(this);
  }

  handleChange(e) {
    const { user, doOrgRolesChange } = this.props;
    doOrgRolesChange(user, e.target.value);
  }

  handleRemove() {
    this.setState({
      isConfirmingRemove: true
    });
  }

  handleCancelRemove() {
    this.setState({
      isConfirmingRemove: false
    });
  }

  handleConfirmRemove() {
    const { user, doOrgRolesChange } = this.props;
    this.setState(
      {
        isConfirmingRemove: false
      },
      () => {
        doOrgRolesChange(user);
      }
    );
  }

  renderActions() {
    const { isConfirmingRemove } = this.state;
    const { orgRolesIsSaving, orgRolesIsLoading } = this.props;
    if (isConfirmingRemove) {
      return (
        <div className="btn-group float-right">
          <button
            onClick={this.handleConfirmRemove}
            className="btn btn-sm btn-danger"
          >
            Confirm
          </button>
          <button
            onClick={this.handleCancelRemove}
            className="btn btn-sm btn-secondary"
          >
            Cancel
          </button>
        </div>
      );
    } else {
      return (
        <button
          onClick={this.handleRemove}
          className="btn btn-sm btn-danger float-right"
          disabled={orgRolesIsSaving || orgRolesIsLoading}
        >
          Remove
        </button>
      );
    }
  }

  render() {
    const {
      user,
      appRolesItemsFiltered,
      orgRolesIsSaving,
      orgRolesIsLoading
    } = this.props;
    return (
      <li className="list-group-item">
        <div className="row">
          <span className="col-sm-3">{user.userName}</span>

          {appRolesItemsFiltered.map((role, i) => {
            return (
              <span key={i} className="col-sm">
                <div className="form-check form-check-inline">
                  <label className="form-check-label">
                    <input
                      name={user.id}
                      onChange={this.handleChange}
                      checked={user.roles.indexOf(`${role.id}`) !== -1}
                      className="form-check-input"
                      type="radio"
                      value={role.id}
                      disabled={orgRolesIsSaving || orgRolesIsLoading}
                    />
                    {role.roleName}
                  </label>
                </div>
              </span>
            );
          })}

          <span className="col-sm">{this.renderActions()}</span>
        </div>
      </li>
    );
  }
}

export default connect(
  "doOrgRolesChange",
  "selectAppRolesItemsFiltered",
  "selectOrgRolesIsLoading",
  "selectOrgRolesIsSaving",
  UsersListItem
);
