import React from "react";
import { connect } from "redux-bundler-react";
import Autocomplete from '@mui/material/Autocomplete';

class RoleOrgPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const { doApprovalRolesPersonnelSetOrgSlug } = this.props;
    const newOrg = e ? e.value : null;
    doApprovalRolesPersonnelSetOrgSlug(newOrg);
  }

  render() {
    const { orgsItemsAsOptions } = this.props;
    return (
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="mb-1">Select an Organization</div>
          {/* <Select
            onChange={this.handleChange}
            className="basic-single"
            classNamePrefix="select"
            isLoading={orgsIsLoading}
            isClearable={true}
            isSearchable={true}
            name="org"
            options={orgsItemsAsOptions}
          /> */}
         
          <Autocomplete            
            id="org-auto-complete"
            name="org"
            onChange={this.handleChange}
            options={orgsItemsAsOptions}
            sx={(theme) => ({
              ...theme.typography.body,
              color: theme.palette.primary.main,
            })}
            autoComplete        
            
          />
        </div>
      </div>
    );
  }
}

export default connect(
  "selectOrgsItemsAsOptions",
  "selectOrgsIsLoading",
  "doApprovalRolesPersonnelSetOrgSlug",
  RoleOrgPicker
);
