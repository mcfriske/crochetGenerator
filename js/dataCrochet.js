function slugify(string) {
  return string.toLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9-]/g, '');
}

var typeOptions = {
  'number': ['Default', 'Tens', 'Hundreds', 'Thousands'],
  'date': ['Default', 'Day', 'Month', 'Year'],
  'time': ['Default', 'Minute', '15 Minutes', 'Half Hour', 'Hour'],
  'string': ['Default', 'First Letter', 'Length'],
  'unknown': ['Default']
}

var functionOptions = {
  'number': ['Count', 'Unique Count', 'Average', 'Maximum', 'Minimum', 'Sum'],
  'date': ['Count', 'Unique Count', 'Most Frequent Month', 'Most Frequent Day'],
  'time': ['Count', 'Unique Count', 'Most Frequent Hour'],
  'string': ['Count', 'Unique Count'],
  'unknown': ['Count', 'Unique Count']
}

var knownTypes = {
  'bpm': 'number',
  'heart-rate': 'number',
  'heartrate': 'number',
  'time': 'time',
  'date': 'date',
  'interpreted': 'string',
  'state': 'unknown', 
  'activity': 'string',
  'name': 'string',
  'temperature': 'number',
  'temp': 'number',
}

var timeFormat = [{regex: /^(0?[1-9]|1[0-2]):[0-5][0-9]\s*[aApP][mM]?$/gm,format: 'hh:mm a'},
                  {regex: /^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/gm, format: 'HH:mm'},
                  {regex: /^(0?[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}$/gm, format: 'HH:mm:ss'},
                  {regex: /^(0?[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}\.\d{1,3}$/gm, format: 'HH:mm:ss.SSS'}]
var dateFormat = []

function getKnownTypeOptions(column) {
  return typeOptions[knownTypes[column]];
}
function getFunctionOptions(column) {
  return functionOptions[knownTypes[column]];
}

function getTimeRegex(value) {
  var regex, format;
  for (var index in timeFormat) {
    regex = timeFormat[index].regex;
    format = timeFormat[index].format;

    if (value.match(regex)) {
      console.log(format);
      return format;
    }    
  }
  return null;
}

var sliderStitch = document.getElementById("stitchRange");
var outputStitch = document.getElementById("demoStitch");

var sliderRow = document.getElementById("rowRange");
var outputRow = document.getElementById("demoRow");

outputStitch.innerHTML = sliderStitch.value;
outputRow.innerHTML = sliderRow.value;

sliderStitch.oninput = function() {
  outputStitch.innerHTML = this.value;
}
sliderRow.oninput = function() {
  outputRow.innerHTML = this.value;
}

// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
    // modal.style.display = "block";
    modal.style.display = modal.style.display == "block" ? "none" : "block";
}