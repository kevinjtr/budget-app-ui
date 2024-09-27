import React from "react";
import { connect } from "redux-bundler-react";

class FourOhThree extends React.Component {
  constructor(props) {
    super(props);
    const submitted = props.orgsByRoute.has_requested;
    this.state = {
      requestSubmitted: submitted || false
    };
    this.requestToJoin = this.requestToJoin.bind(this);
    this.renderRequestButton = this.renderRequestButton.bind(this);
  }

  requestToJoin() {
    const { orgsByRoute, doOrgsRequestToJoin } = this.props;
    this.setState(
      {
        requestSubmitted: true
      },
      () => {
        doOrgsRequestToJoin(orgsByRoute);
      }
    );
  }

  renderRequestButton() {
    const { orgsByRoute } = this.props;
    const { requestSubmitted } = this.state;
    if (requestSubmitted) {
      return (
        <button className="btn btn-outline-success">
          <i className="mdi mdi-check mr-2"></i>Request Submitted
        </button>
      );
    } else {
      return (
        <button
          onClick={this.requestToJoin}
          className="btn btn-outline-primary"
        >
          Request to Join {orgsByRoute.name}
        </button>
      );
    }
  }

  render() {
    const { orgsByRoute } = this.props;
    return (
      <div className="app flex-row align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="clearfix">
                <h4 className="pt-3">
                  Uh oh, looks like you aren't a member of {orgsByRoute.name}
                </h4>
                <p className="text-muted">
                  Click below to go back to your organization list or request
                  access to this organization. Please allow a couple hours for Org Admins to Process the request. If needed please contact  SAJ-Budget-Tool@usace.army.mil to expedite this request.
                </p>
              </div>
              <a className="btn btn-primary mr-4" href="/">
                Back to My Organization List
              </a>
              {this.renderRequestButton()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  "doOrgsRequestToJoin",
  "selectOrgsByRoute",
  FourOhThree
);
