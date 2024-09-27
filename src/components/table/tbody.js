import React from "react";
import Row from "./tr";

export default ({ config, items, onRowSelect }) => {
  return (
    <tbody>
      {items.map((item, i) => {
        return (
          <Row key={i} config={config} item={item} onSelect={onRowSelect} />
        );
      })}
    </tbody>
  );
};
