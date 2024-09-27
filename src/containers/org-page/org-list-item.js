import React from "react";
import { connect } from "redux-bundler-react";

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import IconButton from '@mui/material/IconButton';
// class OrgListItem extends React.Component {
//   render() {
//     const { org, orgsForUser } = this.props;
//     if (!orgsForUser) return null;
//     const isMember = orgsForUser.indexOf(org) !== -1;
//     const hasRequested = org.has_requested;
//     const theme = isMember ? "success" : hasRequested ? "primary" : "secondary";
//     return (
//       <div className="col-sm-6 col-lg-3">
//         <div className="card">
//           <div className="card-body p-3 d-flex align-items-center">
//             <i className={`fa fa-cogs bg-${theme} p-3 font-2xl mr-3`}></i>
//             <div>
//               <div className={`text-value-sm text-${theme}`}>{org.name}</div>
//               <div className="text-muted text-uppercase font-weight-bold small">
//                 {}
//               </div>
//             </div>
//           </div>
//           <div className="card-footer px-3 py-2">
//             <a
//               className="btn-block text-muted d-flex justify-content-between align-items-center"
//               href={`/${org.slug}`}
//             >
//               <span className="small font-weight-bold">Open</span>
//               <i className="mdi mdi-chevron-right"></i>
//             </a>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default connect(
//   "selectOrgsForUser",
//   OrgListItem
// );
class OrgListItem extends React.Component {

  render() {
    const { org, orgsForUser } = this.props;
    if (!orgsForUser) return null;
    const isMember = orgsForUser.indexOf(org) !== -1;
    const hasRequested = org.has_requested;
    const theme = isMember ? "success" : hasRequested ? "primary" : "secondary";
    return (
    //   <Card sx={{ minWidth: 275, margin:2 }}>
    //   <CardContent>
        
    //     <Typography variant="h4" color={theme} component="div" gutterBottom>
    //     <i className={`bg-${theme} p-3 font-2xl mr-3`}></i>
    //     {org.name}
    //     </Typography>
    //     <Typography variant="caption">
          
    //       {org.description}
    //     </Typography>
    //   </CardContent>
    //   <CardActions disableSpacing>
    //     <Button size="small"  href={`/${org.slug}`}>Open</Button>
    //   </CardActions>
    // </Card>
      <div className="col-sm-6">
        <div className="card">
          <div className="card-body p-3 d-flex align-items-center">
            <i className={`fa fa-cogs bg-${theme} p-3 font-2xl mr-3`}></i>
            <div>
              <div className={`text-value-sm text-${theme}`}>{org.name}</div>
              <div className="text-muted text-uppercase font-weight-bold small">
                {}
              </div>
            </div>
          </div>
          <div className="card-footer px-3 py-2">
            
              {
                hasRequested && !isMember ? (<span className="small font-weight-bold">Request Still Pending</span>) : ( <a
                  className="btn-block text-muted d-flex justify-content-between align-items-center"
                  href={`/${org.slug}`}
                ><span className="small font-weight-bold">Open</span>
                <IconButton aria-label="add to favorites">
                  <ChevronRightIcon />
                </IconButton>
                </a>)
              }
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  "selectOrgsForUser",
  OrgListItem
);