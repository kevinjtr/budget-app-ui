import React from "react";
import RoleEditor from "./role-editor";

class RoleManager extends React.Component {
  render() {
    return (
      <div className="container-fluid mt-4">
        <div className="card">
          <div className="card-header">
            <i className="mdi mdi-account-key"></i> Manage Approval Roles
          </div>
          <div className="card-body">
            <RoleEditor />
          </div>
        </div>
      </div>
    );
  }
}

export default RoleManager;
