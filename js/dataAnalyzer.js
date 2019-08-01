function slugify(string) {
  return string.toLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9-]/g, '');
}

var typeOptions = {
  'number': ['default', 'tens', 'hundreds', 'thousands'],
  'date': ['day', 'month', 'year'],
  'time': ['default', 'minute', '15 minute', 'half hour', 'hour']
}

var knownTypes = {
  'bpm': 'number',
  'heart-rate': 'number',
  'heartrate': 'number',
  'time': 'time',
  'date': 'date'
}

function DataAnalyzer(csvInputID, settingsFormID) {
  this.csvInput = document.getElementById(csvInputID);
  this.settingsForm = document.getElementById(settingsFormID);
  this.rawData = {};
  this.organizedData = {};

  this.init();

  // console.log(this.csvInput, this.logicInput);
}

DataAnalyzer.prototype = {
  init: function() {
    this.setupHandlers().setupEvents();
  },

  setupHandlers: function() {
    this.csvChangeHandler = this.updateCSVData.bind(this);
    this.settingsChangeHandler = this.updateGrouping.bind(this);
    return this;
  },

  setupEvents: function() {
    this.csvInput.addEventListener('change', this.csvChangeHandler);
    this.settingsForm.addEventListener('change', this.settingsChangeHandler);
    return this;
  },

  updateCSVData: function(e) {
    console.log('alert');
    this.rawData = d3.csvParse(this.csvInput.value);

    this.dataLength = this.rawData.length;

  },

  updateGrouping: function(e) {
    console.log('here');
    var grouped = d3.nest()
                    .key(function(d) {var tens = Math.floor(d["Heart Rate"]/10).toString(); return tens+'0-'+tens+'9';})
                    .rollup(function(v) { return {
                        count: v.length,
                        total: d3.sum(v, function(d) { return d["Heart Rate"]; }),
                        avg: d3.mean(v, function(d) { return d["Heart Rate"]; })
                      }; })
                    .entries(this.rawData);

    this.organizedData = grouped;
  },

  getRandomInt: function(max) {
    return Math.floor(Math.random() * Math.floor(max));
  },

  getRandomItemWeighted: function() {
    var keyToStitches = {"<70": 0, "70-79": 1, "80-89": 3, "90-99": 2, "100-109":6, "110-119":7, "120-129":1, ">129": 0};
    var rand = this.getRandomInt(this.dataLength);
    var weight = 0;
    for (var key in this.organizedData) {
      weight = this.organizedData[key];
      rand = rand - weight;
      if (rand <= 0) {
        console.log(key);
        return keyToStitches[key];
      }
    }
  },

  numberKey: function(d) {

  },

  dateKey: function(d) {

  },

  timeKey: function(d) {

  }

}