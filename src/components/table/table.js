import React from "react";
import Head from "./thead";
import Body from "./tbody";

export default ({ config, items, onRowSelect }) => {
  return (
    <>
      <small className="text-muted">Double click row to open details</small>
      <table className="table table-responsive-sm table-hover table-bordered table-striped table-sm">
        <Head config={config} />
        <Body config={config} items={items} onRowSelect={onRowSelect} />
      </table>
    </>
  );
};
