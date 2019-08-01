function slugify(string) {
  return string.toLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9-]/g, '');
}

var typeOptions = {
  'number': ['Default', 'Tens', 'Hundreds', 'Thousands'],
  'date': ['Default', 'Day', 'Month', 'Year'],
  'time': ['Default', 'Minute', '15 Minutes', 'Half Hour', 'Hour'],
  'string': ['Default', 'First Letter'],
  'unknown': ['Default']
}

var functionOptions = {
  'number': ['Count', 'Unique Count', 'Average', 'Maximum', 'Minimum', 'Sum'],
  'date': ['Count', 'Unique Count', 'Most Frequent Month', 'Most Frequent Day'],
  'time': ['Count', 'Unique Count', 'Most Frequent Hour', 'Most Frequent Half Hour'],
  'string': ['Count', 'Unique Count', 'Most Frequent String', 'Most Frequent Word'],
  'unknown': ['Count', 'Unique Count', 'Most Frequent']
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
  'name': 'string'
}

function getKnownTypeOptions(column) {
  return typeOptions[knownTypes[column]];
}
function getFunctionOptions(column) {
  return functionOptions[knownTypes[column]];
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