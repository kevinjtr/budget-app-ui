import React from "react";
import { connect } from "redux-bundler-react";
import { find } from "lodash";

class RoleUserListItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const {
      user,
      doApprovalRolesSave,
      doApprovalRolesDelete,
      approvalRolesPersonnelOrgSlug: orgSlug
    } = this.props;
    const payload = {
      id: user.id,
      org_slug: orgSlug,
      personnel_approval_role_id: e.target.dataset.id,
      approval_role_id: e.target.value,
      slug: e.target.name
    };
    if (e.target.checked) {
      doApprovalRolesSave(payload);
    } else {
      doApprovalRolesDelete(payload);
    }
  }

  render() {
    const {
      user,
      domainsItems,
      approvalRolesItems,
      approvalRolesIsLoading,
      approvalRolesIsSaving
    } = this.props;

    const rolesDomainFiltered = domainsItems.filter(domain => {
      return domain.grp === "approval_role";
    });

    rolesDomainFiltered.forEach(role => {
      const assignedRole = find(approvalRolesItems, {
        id: user.id,
        approval_role_id: role.id
      });
      role.isActive = assignedRole ? true : false;
      role.personnel_approval_role_id = assignedRole
        ? assignedRole.personnel_approval_role_id
        : null;
    });

    return (
      <li className="list-group-item">
        <div className="row">
          <span className="col-sm-3">{user.name}</span>

          {rolesDomainFiltered.map((role, i) => {
            return (
              <span key={i} className="col-sm">
                <div className="form-check form-check-inline">
                  <label className="form-check-label">
                    <input
                      data-id={role.personnel_approval_role_id}
                      name={user.slug}
                      onChange={this.handleChange}
                      checked={role.isActive}
                      className="form-check-input"
                      type="checkbox"
                      value={role.id}
                      disabled={approvalRolesIsLoading || approvalRolesIsSaving}
                    />
                    {role.val}
                  </label>
                </div>
              </span>
            );
          })}
        </div>
      </li>
    );
  }
}

export default connect(
  "doApprovalRolesSave",
  "doApprovalRolesDelete",
  "selectDomainsItems",
  "selectApprovalRolesItems",
  "selectApprovalRolesIsSaving",
  "selectApprovalRolesIsLoading",
  "selectApprovalRolesPersonnelOrgSlug",
  RoleUserListItem
);
