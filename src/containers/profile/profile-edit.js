import React from "react";
import SchemaForm from "../../components/schema-form/schema-form";
import { connect } from "redux-bundler-react";
import { profile } from "../../models";

class ProfileEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edipi: props.tokenEdipi
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // componentDidMount() {
  //   const { tokenRaw } = this.props;
  //   if (!tokenRaw) return null;
  //   const qr = new window.QRCode(this.el, {
  //     text: tokenRaw,
  //     correctLevel: 1
  // //   });

  // <div className="row">
  //           <div className="col-3 text-right">
  //             <p>Mobile Login</p>
  //             <p className="text-muted">
  //               <small>{`Expires in ${tokenExpiresIn}`}</small>
  //             </p>
  //           </div>
  //           <div className="col-7">
  //             <div
  //               style={{ width: "200px" }}
  //               ref={el => {
  //                 this.el = el;
  //               }}
  //             />
  //           </div>
  //         </div>
  // }

  handleSubmit() {
    const { doProfileSave, doDialogClose } = this.props;
    if (this.form.isValid()) {
      const data = this.form.serialize();
      doProfileSave({ data: data });
      doDialogClose();
    }
  }

  render() {
    const { profileItems, doDialogClose, tokenExpiresIn } = this.props;
    const myProfile = profileItems[0];
    return (
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">My Profile</h5>
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
          <p className="text-muted">Manage your preferences here</p>

          <SchemaForm
            ref={el => {
              this.form = el;
            }}
            inline={true}
            displayOnly={false}
            schema={profile}
            data={myProfile}
          />
        </div>

        <div className="modal-footer">
          <span
            className="text-muted"
            style={{ position: "absolute", left: "20px" }}
          >{`Current Session Expires in ${tokenExpiresIn}`}</span>
          <button
            onClick={doDialogClose}
            className="btn btn-sm btn-secondary"
            type="button"
          >
            Close
          </button>
          <button
            onClick={this.handleSubmit}
            className="btn btn-sm btn-success"
            type="button"
          >
            Save
          </button>
        </div>
      </div>
    );
  }
}

export default connect(
  "doProfileSave",
  "doDialogClose",
  "selectProfileItems",
  "selectTokenEdipi",
  "selectTokenRaw",
  "selectTokenExpiresIn",
  ProfileEdit
);
