import React from "react";
import { connect } from "redux-bundler-react";

export default connect(
  "doDialogClose",
  ({ doDialogClose }) => {
    return (
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Request Assistance</h5>
          <button
            onClick={doDialogClose}
            className="close"
            type="button"
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="modal-body">
          <p>
            Thanks, your message has been sent and we'll get back to you as soon
            as we can.
          </p>
        </div>

        <div className="modal-footer">
          <button
            onClick={doDialogClose}
            className="btn btn-sm btn-secondary"
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
);
