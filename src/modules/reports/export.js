
import * as React from "react";
import { connect } from "redux-bundler-react";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { styled } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import ExportItems from './export-items';
import CalculateIcon from '@mui/icons-material/Calculate';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.primary.main,  
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.primary.contrastText,
  marginBottom:theme.spacing(4)
}));


class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.renderExports= this.renderExports.bind(this);
  }
  
  componentDidMount() {
    const {doFetchDownloads, downloadManagerItems} = this.props;
    if(!downloadManagerItems?.length>0) {
      doFetchDownloads()
    };
  }
  
  renderExports() {
    const {
      doStartProjectSummaryR1AR1BActivityDeltaExport,
      reportProjectSummaryR1AR1BActivityDeltaStatus,
      reportProjectSummaryR1AR1BActivityDeltaDownloadItem,
      doStartProjectSummaryR1AR1BDeltaExport,
      reportProjectSummaryR1AR1BDeltaStatus,
      reportProjectSummaryR1AR1BDeltaDownloadItem,
      doStartProjectSummaryExport, reportProjectSummaryStatus, reportProjectSummaryDownloadItem,
       doStartBudgetPivotExport, reportBudgetPivotStatus, reportBudgetPivotDownloadItem,
        doStartOrgProjectAllExport, reportOrgProjectAllStatus, reportOrgProjectAllDownloadItem,
         doStartOrgExport, reportOrgStatus, reportOrgDownloadItem, doStartScopeExport, reportScopeStatus,
          reportScopeDownloadItem, tokenRaw, doDownloadManagerDelete, fySelectedItem} = this.props
    
    return(
      <div style={{margin:'2em'}}>
      <div style={{display:'flex', flexDirection:'row', gap: "10px 20px", justifyContent: "start",  alignItems:"flex-end"}} >
        
                <Typography>
                  Scope:
                </Typography>
                {fySelectedItem?.active ? (
                !reportScopeStatus || reportScopeStatus==='processing' ? (<LoadingButton
                  loading={reportScopeStatus==='processing'}
                  loadingPosition="start"
                  startIcon={<CalculateIcon />}
                  onClick={doStartScopeExport}
                >
                  {reportScopeStatus==='processing'? 'Processing':'Generate Scope Report'}
                </LoadingButton>):
                <ExportItems file={reportScopeDownloadItem} token={tokenRaw} remove={doDownloadManagerDelete}/>
                ) : (
                  <LoadingButton
                    disabled
                    loadingPosition="start"
                    startIcon={<CalculateIcon />}
                  >
                    Generate Scope Report
                  </LoadingButton>
                )}
      </div>
      <Divider />
      <div style={{display:'flex', flexDirection:'row', gap: "10px 20px", justifyContent: "start",  alignItems:"flex-end"}} >
        
                <Typography>
                  Full Budget Export Pivot:
                </Typography>
                {fySelectedItem?.active ? (
                  !reportBudgetPivotStatus || reportBudgetPivotStatus==='processing' ? (<LoadingButton
                    loading={reportBudgetPivotStatus==='processing'}
                    loadingPosition="start"
                    startIcon={<CalculateIcon />}
                    onClick={doStartBudgetPivotExport}
                  >
                    {reportBudgetPivotStatus==='processing'? 'Processing':'Generate Full Budget Export Pivot'}
                  </LoadingButton> ) :
                  <ExportItems file={reportBudgetPivotDownloadItem} token={tokenRaw} remove={doDownloadManagerDelete}/>
                ) : (
                  <LoadingButton
                    disabled
                    loadingPosition="start"
                    startIcon={<CalculateIcon />}
                  >
                    Generate Full Budget Export Pivot
                  </LoadingButton>
                )}
      </div>
      <Divider />
      <div style={{display:'flex', flexDirection:'row', gap: "10px 20px", justifyContent: "start",  alignItems:"flex-end"}} >
        
                <Typography>
                  Org Project Summary:
                </Typography>
                {fySelectedItem?.active ? (
                  !reportOrgProjectAllStatus || reportOrgProjectAllStatus==='processing' ? (<LoadingButton
                    loading={reportOrgProjectAllStatus==='processing'}
                    loadingPosition="start"
                    startIcon={<CalculateIcon />}
                    onClick={doStartOrgProjectAllExport}
                  >
                    {reportOrgProjectAllStatus==='processing'? 'Processing':'Generate Full Org Project Export'}
                  </LoadingButton>):
                  <ExportItems file={reportOrgProjectAllDownloadItem} token={tokenRaw} remove={doDownloadManagerDelete}/>
                ) : (
                  <LoadingButton
                    disabled
                    loadingPosition="start"
                    startIcon={<CalculateIcon />}
                  >
                    Generate Full Org Project Export
                  </LoadingButton>
                )}
      </div>
      <Divider />
      <div style={{display:'flex', flexDirection:'row', gap: "10px 20px", justifyContent: "start",  alignItems:"flex-end"}} >
        
                <Typography>
                  Project Summary with AE Services Total:
                </Typography>
                {fySelectedItem?.active ? (
                  !reportProjectSummaryStatus || reportProjectSummaryStatus==='processing' ? (<LoadingButton
                    loading={reportProjectSummaryStatus==='processing'}
                    loadingPosition="start"
                    startIcon={<CalculateIcon />}
                    onClick={doStartProjectSummaryExport}
                  >
                    {reportProjectSummaryStatus==='processing'? 'Processing':'Generate Project Summary Export'}
                  </LoadingButton>):
                  <ExportItems file={reportProjectSummaryDownloadItem} token={tokenRaw} remove={doDownloadManagerDelete}/>
                ) : (
                  <LoadingButton
                    disabled
                    loadingPosition="start"
                    startIcon={<CalculateIcon />}
                  >
                    Generate Project Summary Export
                  </LoadingButton>
                )}
                {
                }
      </div>
      <Divider />
      <div style={{display:'flex', flexDirection:'row', gap: "10px 20px", justifyContent: "start",  alignItems:"flex-end"}} >
        
                <Typography>
                 R1A R1B Delta Report:
                </Typography>
                {fySelectedItem?.active ? (
                  !reportProjectSummaryR1AR1BDeltaStatus || reportProjectSummaryR1AR1BDeltaStatus==='processing' ? (<LoadingButton
                    loading={reportProjectSummaryR1AR1BDeltaStatus==='processing'}
                    loadingPosition="start"
                    startIcon={<CalculateIcon />}
                    onClick={doStartProjectSummaryR1AR1BDeltaExport}
                  >
                    {reportProjectSummaryR1AR1BDeltaStatus==='processing'? 'Processing':'Generate R1A R1B Delta Export'}
                  </LoadingButton>):
                  <ExportItems file={reportProjectSummaryR1AR1BDeltaDownloadItem} token={tokenRaw} remove={doDownloadManagerDelete}/>
                ) : (
                  <LoadingButton
                    disabled
                    loadingPosition="start"
                    startIcon={<CalculateIcon />}
                  >
                    Generate R1A R1B Delta Export
                  </LoadingButton>
                )}
                {
                }
      </div>
      <Divider />
      <div style={{display:'flex', flexDirection:'row', gap: "10px 20px", justifyContent: "start",  alignItems:"flex-end"}} >
        
                <Typography>
                 R1A R1B Delta Report by Activity:
                </Typography>
                {fySelectedItem?.active ? (
                  !reportProjectSummaryR1AR1BActivityDeltaStatus || reportProjectSummaryR1AR1BActivityDeltaStatus==='processing' ? (<LoadingButton
                    loading={reportProjectSummaryR1AR1BActivityDeltaStatus==='processing'}
                    loadingPosition="start"
                    startIcon={<CalculateIcon />}
                    onClick={doStartProjectSummaryR1AR1BActivityDeltaExport}
                  >
                    {reportProjectSummaryR1AR1BActivityDeltaStatus==='processing'? 'Processing':'Generate R1A R1B Activity Delta Export'}
                  </LoadingButton>):
                  <ExportItems file={reportProjectSummaryR1AR1BActivityDeltaDownloadItem} token={tokenRaw} remove={doDownloadManagerDelete}/>
                ) : (
                  <LoadingButton
                    disabled
                    loadingPosition="start"
                    startIcon={<CalculateIcon />}
                  >
                    Generate R1A R1B Activity Delta Export
                  </LoadingButton>
                )}
                {
                }
      </div>
      {/* <div style={{display:'flex', flexDirection:'row', gap: "10px 20px", justifyContent: "start",  alignItems:"flex-end"}} >
        
                <Typography>
                  Org Project Summary:
                </Typography>
                {!reportOrgStatus || reportOrgStatus==='processing' ? (<LoadingButton
                  loading={reportOrgStatus==='processing'}
                  loadingPosition="start"
                  startIcon={<CalculateIcon />}
                  onClick={doStartOrgExport}
                >
                  {reportOrgStatus==='processing'? 'Processing':'Generate Org Project Summary Report'}
                </LoadingButton>):
                <ExportItems file={reportOrgDownloadItem} token={tokenRaw} remove={doDownloadManagerDelete}/>
                }
      </div> */}
      </div>
      
    )
  }
  render() {
    
   
    return (
     
      <div>
         <Paper style={{padding:'2em', minWidth:'960px'}}>
        <Item >
          <Typography variant="h4"component="div">Request Report</Typography>
        </Item>
            <Box>
            <Typography variant="subtitle2" gutterBottom>
              Due to the size of some reports that aren't limited by Project, Org Code, or Activity, if you need a report please request the report by clicking the appropriate button below.
              After clicking the button the report creation can be monitored in the download manager at the top right. It will show a red icon when there has been a status update on the report. That status will also be updated here on this page 
            </Typography>
            <Divider />
              {this.renderExports()}
            </Box>
          </Paper>
        </div>
    );
  }
}

export default connect(  
  "doFetchDownloads",
  "doStartScopeExport",
  "selectReportScopeStatus",
  "selectReportScopeDownloadItem",
  "doStartOrgExport",
  "selectReportOrgStatus",
  "selectReportOrgDownloadItem",
  "doStartBudgetPivotExport",
  "selectReportBudgetPivotStatus",
  "selectReportBudgetPivotDownloadItem",
  "doStartOrgProjectAllExport",
  "selectReportOrgProjectAllStatus",
  "selectReportOrgProjectAllDownloadItem",
  "doStartProjectSummaryExport",
  "selectReportProjectSummaryStatus",
  "selectReportProjectSummaryDownloadItem",
  "doStartProjectSummaryR1AR1BActivityDeltaExport",
  "selectReportProjectSummaryR1AR1BActivityDeltaStatus",
  "selectReportProjectSummaryR1AR1BActivityDeltaDownloadItem",
  "doStartProjectSummaryR1AR1BDeltaExport",
  "selectReportProjectSummaryR1AR1BDeltaStatus",
  "selectReportProjectSummaryR1AR1BDeltaDownloadItem",
  "selectDownloadManagerItems", 
  "selectTokenRaw", 
  "doDownloadManagerDelete",   
  "selectFySelectedItem", 
    Project
);
