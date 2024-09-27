import React from "react";
import RoleOrgPicker from "./role-org-picker";
import RoleUserList from "./role-user-list";

class RoleEditor extends React.Component {
  render() {
    return (
      <div>
        <div>
          Edit approval roles here for each of the offices. Mission Briefing
          Officer and Mission Approval capabilities can be granted to members of
          an organization, the user must be at least a read-only member of the
          organization to be granted approval roles.
        </div>
        <RoleOrgPicker />
        <RoleUserList />
      </div>
    );
  }
}

export default RoleEditor;
