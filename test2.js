/* This function checks if the input file is Excel file (.xls, .xlsx) or not, if then passes the data to process. */
function ReadFile() {
  let regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;

  let filename = $("#excelfile")
    .val()
    .toLowerCase();

  // Checks whether the file is a valid excel file
  if (!regex.test(filename)) {
    alert("Please upload a valid Excel file!");
    return;
  }

  // Checks whether the browser supports HTML5
  if (typeof FileReader == "undefined") {
    alert("Sorry! Your browser does not support HTML5!");
    return;
  }

  let xlsxflag = false; // Flag for checking whether excel is .xls format or .xlsx format

  if (filename.indexOf(".xlsx") > 0) {
    xlsxflag = true;
  }

  let reader = new FileReader();
  reader.onload = function(e) {
    let data = e.target.result;

    //Converts the excel data in to object
    if (xlsxflag) {
      var workbook = XLSX.read(data, { type: "binary" });
    } else {
      var workbook = XLS.read(data, { type: "binary" });
    }

    let sheet_name_list = workbook.SheetNames; // Gets all the sheet names of excel in to a variable
    let cnt = 0; //This is used for restricting the script to consider only first sheet of excel

    // Iterate through all sheets
    sheet_name_list.forEach(function(y) {
      // Convert the cell value to Json
      if (xlsxflag) {
        var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
      } else {
        var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
      }
      if (exceljson.length > 0 && cnt == 0) {
        readData(exceljson, "#exceltable"); // WorkSheet Data is passed to read and validate
        cnt++;
      }
    });
    $("#exceltable").show(); // Show Hidden Html Table
  };

  // If excel file is .xlsx extension than creates a Array Buffer from excel
  if (xlsxflag) {
    reader.readAsArrayBuffer($("#excelfile")[0].files[0]);
  } else {
    reader.readAsBinaryString($("#excelfile")[0].files[0]);
  }
}

/* Function used to convert the JSON array to Html Table */
function readData(jsondata, tableid) {
  var columns = [];

  // Gets all the column headings of Excel
  jsondata.forEach(d => {
    for (var key in d) {
      if (d.hasOwnProperty(key)) {
        if ($.inArray(key, columns) == -1) {
          columns.push(key); // Adding each unique column names to a variable array
        }
      }
    }
  });

  // Clear Previous Output
  resetTable("#tableBody");

  let rowCount = 1;

  // Going through each row
  jsondata.forEach(d => {
    let msg = "";
    for (var colIndex = 0; colIndex < columns.length; colIndex++) {
      let colName = columns[colIndex];
      let cellValue = d[colName];
      if (cellValue == null) cellValue = ""; // Converting null value to empty string
      let v = validateData(colName, cellValue); // Calling Validation Function

      // Processing Error Message
      if (v != true) {
        if (msg.length > 0) {
          msg += ", ";
        }
        msg += v;
      }
    }

    // Binding Error Message to Html Table
    if (msg.length > 0) {
      msg = msg.substring(0, msg.length);
      let row$ = $("<tr/>");
      row$.append($("<td/>").html(rowCount));
      row$.append($("<td/>").html(msg));
      $(tableid).append(row$);
    }

    rowCount++;
  });
}

/* Function to validate excel data */
function validateData(colName, value) {
  // Validating Rules
  if (colName.charAt(colName.length - 1) == "*" && value.length == 0) {
    // Rule for Field with *
    return "Missing value in " + colName.replace("*", "");
  } else if (colName.charAt(0) == "#" && value.indexOf(" ") >= 0) {
    // Rule for Field with #
    return colName.replace("#", "") + " Should not contain any space";
  }
  return true;
}

/* Clear Previous Output From The Table */
function resetTable(tableid) {
  $(tableid).empty();
}
