import React from "react";
import { connect } from "redux-bundler-react";
import HelpConfirm from "./help-confirm";

class Help extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: "",
      body: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
  }

  save() {
    const { doDialogOpen, doHelpSave, routeInfo } = this.props;
    doHelpSave({
      ...routeInfo,
      ...this.state
    });
    doDialogOpen({
      content: HelpConfirm,
      props: {}
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    const { doDialogClose } = this.props;
    const { subject, body } = this.state;
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
            Hello, if you need any assistance or found a bug, please let us
            know. We'll get back to you as soon as possible!
          </p>

          <div className="form-group">
            <label className="form-label">Subject</label>
            <input
              className="form-control"
              type="text"
              name="subject"
              value={subject}
              onChange={this.handleChange}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea
              className="form-control"
              type="text"
              rows="7"
              name="body"
              value={body}
              onChange={this.handleChange}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={doDialogClose}
            className="btn btn-sm btn-secondary"
            type="button"
          >
            Close
          </button>
          <button
            onClick={this.save}
            className="btn btn-sm btn-success"
            type="button"
          >
            Send
          </button>
        </div>
      </div>
    );
  }
}

export default connect(
  "selectRouteInfo",
  "doDialogOpen",
  "doDialogClose",
  "doHelpSave",
  Help
);
