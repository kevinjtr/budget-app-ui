import React from "react";
import Col from "./th";

export default ({ config }) => {
  const keys = Object.keys(config);
  return (
    <thead>
      <tr>
        {keys.map((key, i) => {
          return (
            <Col key={i} config={config[key]}>
              {key}
            </Col>
          );
        })}
      </tr>
    </thead>
  );
};
