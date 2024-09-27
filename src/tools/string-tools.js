export function convertToLabel(inputString) {
    // replace any underscores with spaces
    let convertedString = inputString.replace(/_/g, ' ');
    
    // add a space before each uppercase letter
    convertedString = convertedString.replace(/([A-Z])/g, ' $1');
    
    // capitalize the first letter of each word
    convertedString = convertedString.toLowerCase().replace(/(^|\s)\S/g, (match) => match.toUpperCase());
    
    return convertedString;
  }
