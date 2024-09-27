import React from "react";
import { connect } from "redux-bundler-react";
import pkg from "../../../package.json";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showall: false,
      dontshow: props.aboutDontshow,
    };
    this.clear = this.clear.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }

  handleCheck(e) {
    this.setState({
      dontshow: e.target.checked,
    });
  }

  clear() {
    const { doAboutClear } = this.props;
    const { dontshow } = this.state;
    doAboutClear(dontshow);
  }

  render() {
    const { releaseNotesItemsParsed } = this.props;
    const { dontshow, showall } = this.state;
    return (
      <Dialog open>
        
          <DialogTitle className="modal-title">About EBA</DialogTitle>

        <DialogContent>
          <h5>
            {dontshow ? null : (
              <span className="badge badge-success mr-2">NEW</span>
            )}
            Current Version: {pkg.version}
          </h5>
          {releaseNotesItemsParsed
            .filter((item) => {
              if (!showall && item.version.indexOf(pkg.version) === -1)
                return null;
              return item;
            })
            .map((item, i) => {
              if (!item) return null;
              return (
                <div key={i}>
                  <h3>{item.version}</h3>
                  <div dangerouslySetInnerHTML={{ __html: item.html }} />
                </div>
              );
            })}
          {!showall ? (
            <Button
              onClick={() => {
                this.setState({ showall: true });
              }}
            >
              Show All Notes from Previous Versions
            </Button>
          ) : null}
        </DialogContent>

        <DialogActions >
          
          <FormControlLabel control={<Checkbox checked={dontshow} onChange={this.handleCheck} />} label="Don't Show on Startup" />
          <Button
            onClick={this.clear}
            className="btn btn-sm btn-secondary"
            type="button"
          >
            Close
          </Button>
        </DialogActions >
      </Dialog>
    );
  }
}

export default connect(
  "selectAboutDontshow",
  "selectReleaseNotesItemsParsed",
  "doAboutClear",
  About
);
