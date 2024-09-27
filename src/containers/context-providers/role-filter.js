import React from "react";
import { connect } from "redux-bundler-react";

class RoleFilter extends React.Component {
  render() {
    const {
      children,
      tokenRolesJoined,
      orgsActiveSlug,
      allowRoles,
      alt: Alt,
    } = this.props;

    function checkTokenPart(val, idx) {
      let match = false;
      tokenRolesJoined.forEach((tokenRole) => {
        const tokenPart = tokenRole.split(".")[idx];
        if (tokenPart === val) match = true;
      });
      return match;
    }

    let pass = false;

    for (let i = 0; i < allowRoles.length; i++) {
      let role = allowRoles[i];
      role = role.replace(
        `:ORG.`,
        `${orgsActiveSlug ? orgsActiveSlug.toUpperCase() : ""}.`
      );

      // let super users through no matter what
      if (tokenRolesJoined.indexOf("APP.SYSADMIN") !== -1) {
        pass = true;
        break;
      }

      // first let's test if this role is in tokenRoles, if so, pass and move on
      if (tokenRolesJoined.indexOf(role) !== -1) {
        pass = true;
        break;
      }

      // ok, let's check to see if we have a wildcard
      if (role.indexOf("*") !== -1) {
        // if both parts are * then pass is true
        if (role === "*.*") {
          pass = true;
          break;
        }

        // otherwise we've got to check both parts separately
        const parts = role.split(".");

        // looks like we do, is it in the org position?
        if (parts[0] === "*") {
          // if so, check tokenRoles for the role
          if (checkTokenPart(parts[1], 1)) pass = true;
          if (pass) break;
        }

        // how about the role position?
        if (parts[1] === "*") {
          if (checkTokenPart(parts[0], 0)) pass = true;
          if (pass) break;
        }
      }
    }

    if (!pass) {
      if (Alt) {
        return <Alt {...this.props} />;
      } else {
        return null;
      }
    }
    return <>{children}</>;
  }
}

export default connect(
  "selectTokenRolesJoined",
  "selectOrgsActiveSlug",
  RoleFilter
);
