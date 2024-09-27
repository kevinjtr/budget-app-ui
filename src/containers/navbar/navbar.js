import React from 'react';
import pkg from "../../../package.json";
import { connect } from "redux-bundler-react";
import RoleFilter from "../context-providers/role-filter";
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import {Typography, FormControl, Select, MenuItem, FormHelperText, Stack} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Profile from "../profile/profile-edit";
import NavbarMenu from './navbar-menu';
import DownLoadManager from './download-manager';
import HomeIcon from '@mui/icons-material/Home';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import orderBy from 'lodash/orderBy'

const theme = createTheme ({
  palette: {
    // primary: {
    //    main: "#FFFFFF",
      
    // },
    //mode: 'dark',
  }
})

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleUpdateUrl= this.handleUpdateUrl.bind(this);
  }
  componentDidMount() {
    const {doFetchDownloads, downloadManagerItems} = this.props;
    if(!downloadManagerItems?.length>0) {
      doFetchDownloads()
    };
  }
  handleClick = (event) => {
    this.setState({anchorEl: event.currentTarget});
  };
  handleClickHome = (event) => {
    const {doUpdateUrlWithHomepage} = this.props;
  
    
  };
  handleUpdateUrl =(url) => {
    const {doDialogOpen, doUpdateUrlWithHomepage} = this.props;    
    switch(url) {
      case '/profile':
        doDialogOpen({
          content: Profile,
          props: { scrollable: true },
          size: "lg",
        });
        break;
      case '/release-notes':
        doUpdateUrlWithHomepage('/release-notes')
        break;
      case '/help-documents':
        window.open(process.env.REACT_APP_HELP_URL, "_blank");
        break;
      default:
        break
    }
  }

  handleChange(event){
    const {doFyChangeSelectedYear, pathnameMinusHomepage, doUpdateUrlWithHomepageAndFetchData, orgsByRoute} = this.props;

    let split_path = pathnameMinusHomepage.split('/')

    if(split_path.length >= 3){
      const fy_from_url = split_path[2]
      if(!isNaN(event.target.value)){

        const url = pathnameMinusHomepage.replace(`${orgsByRoute?.slug}/${fy_from_url}`,`${orgsByRoute?.slug}/${event.target.value}`)
        doFyChangeSelectedYear(event.target.value)
        doUpdateUrlWithHomepageAndFetchData(url)
      }
    }else{
      doFyChangeSelectedYear(event.target.value)
    }
  }

  render() {
    const {
      doUpdateUrlWithHomepage,
        doUiToggleSidebarShow,
        isLoggedIn,
        doLogout,        
        orgsByRoute,
        downloadManagerItems,
        doStartDownloads,
        doDownloadManagerDelete,
        tokenRaw,
        fyItems,
        fyIsLoading,
        fyIsSaving,
        fySelectedYear,
        fyHiddenSelectPaths,
    } = this.props;
      
    const {anchorEl} = this.state
      
    const open = Boolean(anchorEl);
      
    if (!isLoggedIn) return null;
      
    const inOrg = !!orgsByRoute;    
      
    let toggler =null
      
    if(inOrg) {
        toggler=(
          <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={doUiToggleSidebarShow}
                sx={{
                  marginRight: '36px'
                }}
              >
                <MenuIcon />
              </IconButton>
        )
      }

      const fyMenuItems = orderBy(fyItems,'year', 'desc')?.map((item) => 
        <MenuItem id={`fy-item-${item.id}`} key={`fy-item-${item.id}`} value={item.year}>{`FY ${item.year}`}</MenuItem>
      )

    return (
      <AppBar position="absolute" style={{height:'64px'}}sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            {toggler}
            <ThemeProvider theme={theme}>
            <Typography
              component="h1"
              variant="h6"
              color="primary.main"
              noWrap
              sx={{ flexGrow: 1,  }}
            >
            <Stack direction="row" alignItems="center" gap={1}>
              <Button href={`/${orgsByRoute?.slug}`} variant="text" sx={{height:47, fontSize: "20px", textTransform: "none",
              color:'background.default',
              '&:hover':{
                color:'background.default',
                backgroundColor:'action.hover'
                }
                }}>
                {/* <a href="/"> */}
                Engineering Budget{" "}
                  <RoleFilter allowRoles={["APP.ADMIN"]}>
                    {pkg.version}{" "}
                  </RoleFilter>
                  {/* </a> */}
              </Button>
              {inOrg && !fyIsLoading && !fyIsSaving && !fyHiddenSelectPaths && fyMenuItems.length > 0 && (
              <FormControl sx={{ m: 1, minWidth: 120}}>
                <Select
                  value={fySelectedYear || ''}
                  onChange={this.handleChange}
                  sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 }, '& .MuiSvgIcon-root':{
                    color:'background.default',
                  },'&:hover':{
                    backgroundColor:'action.hover'},
                    color:'background.default',
                  }}
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  {fyMenuItems}
                </Select>
              </FormControl>
              )}

            </Stack>
            </Typography>
            </ThemeProvider>

            
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
             
            <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
                onClick={()=>doUpdateUrlWithHomepage("/")}
                >
                
                    <HomeIcon />
                
            </IconButton>
              <DownLoadManager items={downloadManagerItems ? downloadManagerItems : []} startDownload={doStartDownloads} token={tokenRaw} remove={doDownloadManagerDelete}/>
              <NavbarMenu updateUrl={this.handleUpdateUrl} logout={doLogout}/>
            </Box>
            
          </Toolbar>
        </AppBar>
      
    );
  }
}

export default connect(
  "selectIsLoggedIn",
  "selectUiSidebarShow",
  "doUiToggleSidebarShow",
  "selectOrgsByRoute",
  'doUpdateUrlWithHomepage',
  'doUpdateUrlWithHomepageAndFetchData',
  "doDialogOpen",
  "doLogout",
  "doFetchDownloads",
  "doStartDownloads",
  "selectDownloadManagerItems",
  "selectTokenRaw",
  "doDownloadManagerDelete",
  "selectFyItems",
  "selectFyIsLoading",
  "selectFyIsSaving",
  "doFyChangeSelectedYear",
  "selectFySelectedYear",
  "selectPathnameMinusHomepage",
  "selectFyHiddenSelectPaths",
  Navbar
);
