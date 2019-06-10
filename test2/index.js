if(typeof require !== 'undefined') XLSX = require('xlsx');
/* Declare Excel File */
var workbook = XLSX.readFile('../Type_A.xlsx');

var first_sheet_name = workbook.SheetNames[0];

var worksheet = workbook.Sheets[first_sheet_name];

/* Declare Error Type */
var header = XLSX.utils.sheet_to_json(worksheet, {header: 1})[0];
// console.log(header);
// console.log(XLSX.utils.sheet_to_json(worksheet));

var data = XLSX.utils.sheet_to_json(worksheet);
let errorMsg = [];

for (var i = 0; i < header.length; i++) {
    if (header[i].indexOf('*') > -1) {
        // console.log(header[i] + 'required');
        for (var j = 0; j < data.length; j++) {
            let tempError = '';
            
            if(data[j][header[i]] === undefined) {
                tempError += 'Missing value in ' + header[i] +', ';
            }
            if(tempError !== '') {
                errorMsg.push({row: j+2, ErrRow: tempError.trimRight("\W")});
                tempError = null;
            }
            
        }
    } else if (header[i].indexOf('#') > -1) {
        // console.log(header[i] + 'no spaces');

        for (var j = 0; j < data.length; j++) {
            let tempError = '';
            
            if(/\s/.test(data[j]['#Field_B'])) {
                tempError += 'Field B should not contain spaces, ';
            }
            if(tempError !== '') {
                errorMsg.push({row: j+2, ErrRow: tempError.trimRight("\W")});
                tempError = null;
            }
        }
    }
}

// console.log(errorMsg);

var output = [];

errorMsg.forEach(function(item) {
  var existing = output.filter(function(v, i) {
    return v.row == item.row;
  });
  if (existing.length) {
    var existingIndex = output.indexOf(existing[0]);
    output[existingIndex].ErrRow = output[existingIndex].ErrRow.concat(item.ErrRow);
  } else {
    if (typeof item.ErrRow == 'string')
      item.ErrRow = [item.ErrRow];
    output.push(item);
  }
});

console.log(output);