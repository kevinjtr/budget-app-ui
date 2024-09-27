import React from "react";
import OrgListItem from "./org-list-item";

export default ({ orgs, loading }) => {
  const renderEmpty = (msg) => {
    return (
      <div className="container">
        <div className="card" style={{ height: "200px" }}>
          <div className="card-body">{msg}</div>
        </div>
      </div>
    );
  };

  if (loading) {
    return renderEmpty("Loading...");
  }

  if (!loading && !orgs.length) {
    return renderEmpty(
      "Choose your Organization from the list below, once your membership is requested they will show up here in blue, once accepted, green."
    );
  }

  return (
    <div className="container">
      <div className="row">
        {orgs.map((org, i) => {
          return <OrgListItem key={org.id} org={org} />;
        })}
      </div>
    </div>
  );
};
