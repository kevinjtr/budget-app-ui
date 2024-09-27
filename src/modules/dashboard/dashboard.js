import React from "react";
import { connect } from "redux-bundler-react";
import { Grid, Typography } from "@mui/material";
import Container from '@mui/material/Container';

class Dashboard extends React.Component {
  render() {
    const { routeParams } = this.props;
    return (
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="stretch"
        >
          <Grid item xs={4} sm={4}>
            <Typography variant="h6" fontSize="24px" fontWeight="300">
              This budget tracker has been designed as a tool to input project
              scopes, labor, and non-labor budget amounts for each selected
              activity. THIS IS NOT a replacement for the PPMD posted spreadsheets. All
              deadlines are still applicable.
            </Typography>
            

            
          </Grid>
          
        </Grid>
      </Container>
    );
  }
}

export default connect("selectRouteParams", Dashboard);
