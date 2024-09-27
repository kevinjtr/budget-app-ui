import {IconButton, Stack, Skeleton, FormControl, InputLabel, NativeSelect} from '@mui/material';
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';

// const BootstrapInput = styled(InputBase)(({ theme }) => ({
//   // 'label + &': {
//   //   marginTop: theme.spacing(3),
//   // },
//   '& .MuiInputBase-input': {
//     // borderRadius: 4,
//     // position: 'relative',
//     // backgroundColor: theme.palette.background.paper,
//     // border: '1px solid #ced4da',
//     // fontSize: 16,
//     // padding: '10px 26px 10px 12px',
//     // transition: theme.transitions.create(['border-color', 'box-shadow']),
//     // // Use the system font instead of the default Roboto font.
//     // fontFamily: [
//     //   '-apple-system',
//     //   'BlinkMacSystemFont',
//     //   '"Segoe UI"',
//     //   'Roboto',
//     //   '"Helvetica Neue"',
//     //   'Arial',
//     //   'sans-serif',
//     //   '"Apple Color Emoji"',
//     //   '"Segoe UI Emoji"',
//     //   '"Segoe UI Symbol"',
//     // ].join(','),
    
//   },
// }));

export function LockedInputValue(props) {
    const { item, applyValue } = props;
  
    const handleFilterChange = (event) => {
      applyValue({ ...item, value: event.target.value });
    };
  
    return (
      <div>
        <FormControl fullWidth>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Status
          </InputLabel>
          <NativeSelect
            defaultValue={-1}
            onChange={handleFilterChange}
            value={item.value}
            sx={{
              '& .MuiInputBase-input': {
                '&:focus': {
                  backgroundColor: "action.selected"
                },
              }
            }}
            inputProps={{
              name: 'status',
              id: 'uncontrolled-native',
            }}
          >
            <option value={-1}>any</option>
            <option value={0}>open</option>
            <option value={1}>locked</option>
          </NativeSelect>
        </FormControl>
      </div>
    );
  }

export const StatusLockedOperators = [
    {
      label: 'is',
      value: 'is',
      getApplyFilterFn: (filterItem) => {
        if (
          !filterItem.columnField ||
          !filterItem.value ||
          !filterItem.operatorValue
        ) {
          return null;
        }
  
        return (params) => {
          if(Number(filterItem.value) == -1){
            return true
          }
          return Number(params.value) == Number(filterItem.value);
        };
      },
      InputComponent: LockedInputValue,
      InputComponentProps: { type: 'number' },
    },
  ];



// export default function CustomizedSelects() {
//   const [age, setAge] = React.useState('');
//   const handleChange = (event: { target: { value: string } }) => {
//     setAge(event.target.value);
//   };
//   return (
//     <div>
//       <FormControl sx={{ m: 1 }} variant="standard">
//         <InputLabel htmlFor="demo-customized-textbox">Age</InputLabel>
//         <BootstrapInput id="demo-customized-textbox" />
//       </FormControl>
//       <FormControl sx={{ m: 1 }} variant="standard">
//         <InputLabel id="demo-customized-select-label">Age</InputLabel>
//         <Select
//           labelId="demo-customized-select-label"
//           id="demo-customized-select"
//           value={age}
//           onChange={handleChange}
//           input={<BootstrapInput />}
//         >
//           <MenuItem value="">
//             <em>None</em>
//           </MenuItem>
//           <MenuItem value={10}>Ten</MenuItem>
//           <MenuItem value={20}>Twenty</MenuItem>
//           <MenuItem value={30}>Thirty</MenuItem>
//         </Select>
//       </FormControl>
//       <FormControl sx={{ m: 1 }} variant="standard">
//         <InputLabel htmlFor="demo-customized-select-native">Age</InputLabel>
//         <NativeSelect
//           id="demo-customized-select-native"
//           value={age}
//           onChange={handleChange}
//           input={<BootstrapInput />}
//         >
//           <option aria-label="None" value="" />
//           <option value={10}>Ten</option>
//           <option value={20}>Twenty</option>
//           <option value={30}>Thirty</option>
//         </NativeSelect>
//       </FormControl>
//     </div>
//   );
// }
