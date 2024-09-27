import React from "react";

export default ({ config, item, onSelect }) => {
  const val = item[config.dataKey];
  if (config.renderFn) {
    return <td>{config.renderFn(config, item, onSelect)}</td>;
  }
  return (
    <td>
      <span className="overflow-ellipsis">{val}</span>
    </td>
  );
};
