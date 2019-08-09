function CrochetObject() {
  this.$rowConstruction = document.getElementById('rowMode') // holds a true or false value under .checked
  this.$stitchRange =  document.getElementById('stitchRange') // holds a value number 3-10 under .value
  this.$constructionRange = document.getElementById('rowRange') // holds a value number 3-10 under .value
  // grab grouping form
  this.selectedGroups = []
  this.stitchesRegex = [{stitch: "chain", regex: null}, {stitch: "singleCrochet", regex: null},{stitch: "doubleCrochet", regex: null},{stitch: "doubleDC", regex: null},{stitch: "puff", regex: null}, {stitch: "dcChainCorner", regex: null},{stitch: "threeChainCorner", regex: null},{stitch: "shell", regex: null}, {stitch:"picot", regex: null}];
  this.ascending = document.getElementById('ascending');
  this.init();
}

CrochetObject.prototype = {
  init: function() {
    this.rowCheck = this.$rowConstruction.checked;
    // console.log(this.rowCheck);
    this.groupChangeHandler = this.handleGroupChange.bind(this);
  },

  handleGroupChange: function(e) {
    var key = e.currentTarget.name
    var checked = e.currentTarget.checked;

    if (checked) {
      this.addGroup(key);
    } else {
      this.deleteGroup(key);
    }
    // console.log(this.selectedGroups);
  },

  addGroup: function(key) {
    this.selectedGroups.push(key);
  },

  deleteGroup: function(key) {
    var index = this.selectedGroups.findIndex(item => item === key)
    this.selectedGroups.splice(index, 1);
  },

  hasGroup: function(key) {
    return this.selectedGroups.find(item => item === key)
  },

  addStitchRegex: function(stitchID, regexString) {
    var index = this.stitchesRegex.findIndex(item => item.stitch === stitchID);
    var regex = new RegExp(regexString, 'g');

    if (index != -1) {
      this.stitchesRegex[index].regex = regex;
    } 
  },

  getStitchIndex: function(value) {
    for (var index in this.stitchesRegex) {
      var regex = this.stitchesRegex[index].regex;
      var floored = Math.floor(value);
      value = value.toString();
      if (regex) {
        var match = value.match(regex);
        if (match && parseInt(match[0]) === floored) {
          return index;
        }
      }
    }
    return round(random(0,8));
  }
}