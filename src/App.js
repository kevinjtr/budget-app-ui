import React from "react";
import { Provider } from "redux-bundler-react";
import { getNavHelper } from "internal-nav-helper";
import AppFilters from "./containers/app-filters";
import NotificationPane from "./containers/notifications/notifications";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { Toaster } from 'react-hot-toast';

class App extends React.Component {
  render() {
    const { store } = this.props;
    return (
      <>
      <Toaster/>
      <Provider store={store}>
        <div onClick={getNavHelper(store.doUpdateUrlWithHomepage)}>
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppFilters />
            {/* <NotificationPane /> */}
          </Box>
        </div>
      </Provider>
      </>
    );
  }
}

export default App;