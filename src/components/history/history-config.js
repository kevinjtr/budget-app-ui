
import { Typography, Box } from '@mui/material';
import moment from 'moment'
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

export function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
        {value === index && (
            <Box sx={{ p: 3 }}>
            {children}
            </Box>
        )}
        </div>
    );
}
  
export function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#fff',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 320,
      maxHeight: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
      overflow: 'scroll'
    },
}))
  
export const column_formats = {
    status_locked: (value) => <Typography>{value ? 'Locked' : 'Open'}</Typography>,
    large_text: (value) => (
      value?.length > 50 ? (
        <HtmlTooltip title={
            <Typography color="inherit">{value}</Typography>
        }>
          <Typography>
          {`${value.substring(0,50)}...`}
          </Typography>
          
        </HtmlTooltip>
      ) : value
    ),
    boolean: (value) => value ? 'true' : 'false'
}
  
export const columns = (cell_format) => [
      { id: 'pocName', label: 'POC', minWidth: 170, format: (value) => value},
      {
        id: 'oldValue',
        label: 'Old Value',
        minWidth: 170,
        maxWidth: 270,
        align: 'right',
        format: (value) => column_formats[cell_format] ? column_formats[cell_format](value) : value,
      },
      {
        id: 'newValue',
        label: 'New Value',
        minWidth: 170,
        maxWidth: 270,
        align: 'right',
        format: (value) => column_formats[cell_format] ? column_formats[cell_format](value) : value,
      },
      {
        id: 'dateModified',
        label: 'Date Modified',
        minWidth: 170,
        align: 'right',
        isDate: true,
        format: (value) => value && moment(new Date(value)).format("DD/MM/YYYY HH:mm:ss").toString(),
      },
];