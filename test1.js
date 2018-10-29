function main() {
  let text = document.getElementById("text").value;
  let index = document.getElementById("index").value;
  let output = document.getElementById("result");
  
  if (index >= text.length) { 
    output.innerHTML = "Index Value Greater Than Text Length!";
    return;
  } else if (index < 0) {
    output.innerHTML = "Index Must Be Positive!";
    return;
  }

  output.innerHTML = findIndex(text, index);
}
//main funtion
function findIndex(text, index) {
	
  let count = 1; 

  for (let i = index; i < text.length; i++) {
   
   let ch = text.charAt(i);
   
    if (ch == "(") {
      count++;
    } else if (ch == ")") {
      count--;
    }
    if (count == 0) {
      count = i;
      break;
    }
  }

  if (text.charAt(count) != ")") {
    return "Not Found!";
  }

  return count;
}
