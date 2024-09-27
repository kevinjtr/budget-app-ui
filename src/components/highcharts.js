import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { connect } from "redux-bundler-react";

class Chart extends React.Component {
  render() {
    return (
      <div>
        <div style={{ display: "inline-block" }} className="container-fluid">
          <HighchartsReact
            highcharts={Highcharts}
            options={this.props.options}
          />
        </div>
      </div>
    );
  }
}

export default connect(Chart);
