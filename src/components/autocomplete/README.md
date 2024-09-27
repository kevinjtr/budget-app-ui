# CorpsMap Autocomplete

CorpsMap Autocomplete is a react component that is made for use by the CorpsMap suite of client-side applications.

### How to use

Install the package into your project using npm - `npm install @corpsmap/autocomplete`

Import the component wherever you want to use it `import AutoComplete from '@corpsmap/autocomplete`, you can also import the AutoComplete component or its AutoCompleteItem component as named imports if you feel like it by doing something like | `import { AutoCompleteItem } from '@corpsmap/autocomplete'`.

AutoComplete exposes the following api via props:

| Prop | Type | Default | Description |
| ----- | ----- | ----- | ----- |
| apiParser | PropTypes.func | `null` | A function that can be used to parse api results into objects or strings that can be used by autocomplete.  The function will receive a single parameter containing the response body from the ajax request parsed as JSON (the api much provide a JSON payload) and should return an array of string values or an array of objects formatted for use per the items description below. |
| caseSensitive | PropTypes.bool | `false` | Whether or not the filter comparison should be case sensitive. |
| displayKey | PropTypes.string | `null` | If the items passed are objects, then displayKey is required so that the control knows what property of the object should be used for display. |
| inputClass | PropTypes.string | `'form-control'` | CSS class that will be applied to the HTML input tag rendered as part of the autocomplete control | 
| inputStyle | PropTypes.object | `null` | Style object that will be applied to the HTML input tag per React inline style rules. |
  items | PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.object | 
      PropTypes.string
    ])
  ).isRequired | 
  itemClass | PropTypes.string | 
  itemComponent | PropTypes.func | 
  itemProps | PropTypes.object | 
  itemStyle | PropTypes.object | 
  listClass | PropTypes.string | 
  listStyle | PropTypes.object | 
  minCharCount | PropTypes.number | 
  onSelect | PropTypes.func.isRequired | 
  placeholder | PropTypes.string | 
  url | PropTypes.string | 
  wrapperClass | PropTypes.string | 
  wrapperProps | PropTypes.object | 
  wrapperStyle | PropTypes.object

  caseSensitive: false,
  displayKey: null,
  inputClass: 'form-control',
  inputStyle: null,
  itemComponent: AutoCompleteItem,
  itemClass: 'list-group-item',
  listClass: 'list-group',
  minCharCount: 3,
  placeholder: '',
  url: ''  


### Development

1. Clone the repository from Di2E
2. Run `npm start` from the console to start up the compiler watching changes on the file system, this will rebuild the bundle for the test page when any changes to the file `./dev/src/app.js` or any of its dependencies (i.e. `./src/AutoComplete.js`) occur.
3. Run `http-server` in the `./dev/` folder from another console tab to serve out `index.html` so that you can load it into the browser and see your results.
4. Work on the coponent til your hearts content.

### Tests
Run `npm run test` from the console.