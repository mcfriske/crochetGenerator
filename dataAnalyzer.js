function slugify(string) {
  return string.toLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9-]/g, '');
}

// var knownTypes = {
//   'heart-rate': int,
//   'heartrate': int,
//   'bpm': int,
//   'total': float,
//   'time': Date.time,
//   'date': Date,
// }

function DataAnalyzer(csvInputID, logicInputID) {
  this.csvInput = document.getElementById(csvInputID);
  this.logicInput = document.getElementById(logicInputID);
  this.organizedData = {};

  // console.log(this.csvInput, this.logicInput);
}

DataAnalyzer.prototype = {
  init: function() {
    this.setupHandlers().setupEvents();
  },

  setupHandlers: function() {
    this.csvChangeHandler = this.updateCSVData.bind(this);
    return this;
  },

  setupEvents: function() {
    this.csvInput.addEventListener('change', this.csvChangeHandler);
    return this;
  },

  updateCSVData: function(e) {
    var data = d3.csvParse(this.csvInput.value);

    

    var heartRateCount = {"<70": 0, "70-79": 0, "80-89": 0, "90-99": 0, "100-109":0, "110-119":0, "120-129":0, ">129": 0};
    for (var index in data) {
      var item = data[index];
      if (Array.isArray(item)) {
        // this is the columns array
      } else {
        // this is a dictionary of row
        var hour = item["Time"].slice(0,2);
        var heartRate = parseFloat(item["Heart Rate"]);
        var tens = Math.floor(heartRate / 10);
        var key = "";

        // console.log(tens);

        if (tens < 7) {
          key = "<70";
        } else if (tens > 12) {
          key = ">129";
        } else {
          key = tens.toString() + "0-" + tens.toString() + "9";
        }

        heartRateCount[key] += 1;
      }
    }

    this.organizedData = heartRateCount;
    this.dataLength = data.length;

    var grouped = d3.nest()
                    .key(function(d) {var tens = int(d["Heart Rate"]/10).toString(); return tens+'0-'+tens+'9';})
                    .rollup(function(v) { return {
                        count: v.length,
                        total: d3.sum(v, function(d) { return d["Heart Rate"]; }),
                        avg: d3.mean(v, function(d) { return d["Heart Rate"]; })
                      }; })
                    .entries(data);
    console.log(grouped);

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

}