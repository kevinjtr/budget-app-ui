import React from "react";

export default ({ onSave, onCancel, onDelete }) => {
  return (
    <div className="clearfix">
      <div className="float-right">
        <button className="btn btn-secondary mr-2" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-success" onClick={onSave}>
          Save
        </button>
      </div>
      <button className="btn btn-danger" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
};
