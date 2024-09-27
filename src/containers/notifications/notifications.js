import React from "react";
import { connect } from "redux-bundler-react";

import NotificationSystem from "./NotificationSystem";

class NotificationPane extends React.Component {
  notificationSystem = React.createRef();

  addNotification = event => {
    event.preventDefault();
    const notification = this.notificationSystem.current;
    notification.addNotification({
      message: 'Notification message',
      level: 'success'
    });
  };
  render() {
    return (
      <div className="notification-pane">
       {/* <NotificationSystem ref={this.notificationSystem} /> */}
        
      </div>
    );
  }
}

export default connect(
  "selectActiveNotification",
  "doClearNotification",
  NotificationPane
);
