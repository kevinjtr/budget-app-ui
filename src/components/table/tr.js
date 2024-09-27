import React from "react";
import Col from "./td";

export default ({ config, item, onSelect }) => {
  const select = () => {
    onSelect(item.slug || item.id);
  };
  const keys = Object.keys(config);
  return (
    <tr onDoubleClick={select}>
      {keys.map((key, i) => {
        return (
          <Col key={i} config={config[key]} item={item} onSelect={select} />
        );
      })}
    </tr>
  );
};
