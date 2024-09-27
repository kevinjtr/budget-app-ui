import React from "react";

class ComingSoon extends React.Component {
  render() {
    return (
      <div className="app flex-row align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="clearfix">
                <h3 className="float-left display-3 mr-4">Coming Soon!</h3>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  window.history.back();
                }}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ComingSoon;
