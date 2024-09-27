import React from "react";

class FourOhFour extends React.Component {
  render() {
    return (
      <div className="app flex-row align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="clearfix">
                <h1 className="float-left display-3 mr-4">404</h1>
                <h4 className="pt-3">
                  Uh oh, we couldn't find what you were looking for
                </h4>
              </div>
              <a className="btn btn-primary" href="/">
                Back to My Organization List
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FourOhFour;
