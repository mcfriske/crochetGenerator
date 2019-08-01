function DataAnalyzer(crochetObject, pagination) {
  this.csvInput = document.getElementById('csv-data');
  this.settingsForm = document.getElementById('settingsForm');
  this.$groupOrder = document.getElementsByName('groupOrder');
  this.$stitches = document.getElementsByName('stitch');
  this.currentTab = 0;
  this.columnOptions = []
  this.groupingOptions = ['default']
  this.rawData = {};
  this.organizedData = {};
  this.crochetObject = crochetObject;
  this.pagination = pagination;

  this.init();
}

DataAnalyzer.prototype = {
  init: function() {
    this.setupHandlers().setupEvents().updateUncertaintyPreview();
  },

  setupHandlers: function() {
    this.csvChangeHandler = this.updateCSVData.bind(this);
    this.groupColumnsChangeHandler = this.updateGroupingOptions.bind(this);
    this.functionColumnsChangeHandler = this.updateFunctionOptions.bind(this);
    this.uncertaintyPreviewHandler = this.updateUncertaintyPreview.bind(this);
    this.numberKeyHandler = this.numberKey.bind(this);
    this.numberValueHandler = this.numberValue.bind(this);
    this.sortKeysHandler = this.sortKeys.bind(this);
    this.stitchUpdateHandler = this.stringToRegex.bind(this);
    return this;
  },

  setupEvents: function() {
    this.csvInput.addEventListener('change', this.csvChangeHandler);
    this.settingsForm.groupColumns.addEventListener('change', this.groupColumnsChangeHandler);
    this.settingsForm.functionColumns.addEventListener('change', this.functionColumnsChangeHandler);
    this.settingsForm.uncertaintyRange.addEventListener('input', this.uncertaintyPreviewHandler);
    [].forEach.call(this.$groupOrder,function(e){e.addEventListener('change',this.sortKeysHandler,false)}.bind(this));
    [].forEach.call(this.$stitches,function(e){e.addEventListener('change',this.stitchUpdateHandler,false)}.bind(this));
    return this;
  },

  /////// FORM UPDATES
  updateCSVData: function(e) {
    this.rawData = d3.csvParse(this.csvInput.value);

    this.dataLength = this.rawData.length;
    this.updateColumnOptions();
    this.updateGroupingOptions();
    this.updateFunctionOptions();

  },

  updateUncertaintyPreview: function() {
    var span = document.getElementById('demoUncertainty');

    span.innerText = this.settingsForm.uncertaintyRange.value;
  },

  updateColumnOptions: function(e) {
    var selects = this.settingsForm.columnOptions;

    for (var i = 0; i < selects.length; i++) {
      var columns = selects[i];
      while(columns.firstChild) {
        columns.removeChild(columns.firstChild);
      }

      for (var index in this.rawData.columns) {
        var opt = document.createElement('option');
        var col = this.rawData.columns[index];
        opt.value = slugify(col);
        opt.textContent = col;
        columns.appendChild(opt);
      }
    }
    
  },

  updateGroupingOptions: function() {
    var grouping = this.settingsForm.groupingOptions;
    var typeOptions = getKnownTypeOptions(this.settingsForm.groupColumns.value);

    while(grouping.firstChild) {
      grouping.removeChild(grouping.firstChild);
    }

    for (var index in typeOptions) {
      var opt = document.createElement('option');
      var typeOpt = typeOptions[index];
      opt.value = slugify(typeOpt);
      opt.textContent = typeOpt;
      grouping.appendChild(opt);
    }
  },

  updateFunctionOptions: function() {
    var functions = this.settingsForm.functionOptions;
    var funcOptions = getFunctionOptions(this.settingsForm.functionColumns.value);

    while(functions.firstChild) {
      functions.removeChild(functions.firstChild);
    }

    for (var index in funcOptions) {
      var opt = document.createElement('option');
      var funcOpt = funcOptions[index];
      opt.value = slugify(funcOpt);
      opt.textContent = funcOpt;
      functions.appendChild(opt);
    }
  },

  updateGrouping: function() {
    var grouped = d3.nest()
                    .key(this.numberKeyHandler)
                    .rollup(this.numberValueHandler)
                    .entries(this.rawData)
                    .sort(this.sortNumberKeys);

    this.organizedData = grouped;
    this.pagination.setRows(this.organizedData).getPagination();
  },

  updateDataCrochet: function() {
    this.updateGrouping();
  },

  sortKeys: function() {
    this.organizedData = this.organizedData.sort(this.sortNumberKeys);
    this.pagination.setRows(this.organizedData).getPagination();
  },

  getStitchIndex: function(row) {
    var key, value, weight;
    var selected = this.crochetObject.selectedGroups.sort(this.sortNumberKeys);
    var weighted = Math.random() + (this.settingsForm.uncertaintyRange.value / 100);

    if (row <= selected.length) {
      key = selected[row - 1];
      [value, weight] = this.organizedData.find(item => item.key === key).value;
      console.log(value, weight);
      if (weighted < 1) {
        return co.getStitchIndex(value);

      } else {
        return round(random(0,8));
      }
    } else {
      return round(random(0,8));
    }

    
  },

  getRandomInt: function(max) {
    return Math.floor(Math.random() * Math.floor(max));
  },

  getRandomItemWeighted: function() {
    var rand = this.getRandomInt(this.dataLength);
    console.log(this.dataLength);
    var key, value, weight;
    for (var index in this.organizedData) {
      key = this.organizedData[index].key;
      [value, weight] = this.organizedData[index].value;
      console.log(key, value, weight);
      // weight = this.organizedData[key];
      // rand = rand - weight;
      // if (rand <= 0) {
      //   console.log(key);
      //   // return keyToStitches[key];
      // }
    }
  },

  //////// DATA ANALYSIS FUNCTIONS
  numberKey: function(d) {
    var groupColumn = this.settingsForm.groupColumns.value;
    var groupingOption = this.settingsForm.groupingOptions.value;

    for (var id in d) {
      if (slugify(id) == groupColumn) {
        groupColumn = id;
        break;
      }
    }
    var value = parseInt(d[groupColumn]);
    var key = ""

    switch(groupingOption) {
      case 'tens':
        var tens = Math.floor(value / 10);
        key = tens.toString() + "0-" + tens.toString() +"9";
        break;
      case 'hundreds':
        var hund = Math.floor(value / 100);
        key = hund.toString() + "00-" + hund.toString() +"99";
        break;
      case 'thousands':
        var thous = Math.floor(value / 1000);
        key = thous.toString() + "000-" + thous.toString() +"999";
        break;
      default:
        key = d[groupColumn];
    }

    return key;
  },

  dateKey: function(d) {

  },

  timeKey: function(d) {

  },

  sortNumberKeys: function(a,b) {
    if (a instanceof Object) {
      a = parseInt(a.key.split('-')[0]);
      b = parseInt(b.key.split('-')[0]);
    } else {
      a = parseInt(a.split('-')[0]);
      b = parseInt(b.split('-')[0]);
    }
    var ascending = document.getElementById('ascending').checked;

    if (ascending) {
      return a < b ? -1 : a === b ? 0 : 1;
    } else {
      return a > b ? -1 : a === b ? 0 : 1;
    }
  },

  numberValue: function(v) {
    var functionColumn = this.settingsForm.functionColumns.value;
    var functionOption = this.settingsForm.functionOptions.value;
    var columns = this.rawData.columns;

    for (var id in columns) {
      if (slugify(columns[id]) == functionColumn) {
        functionColumn = columns[id];
        break;
      }
    }

    switch(functionOption) {
      case 'unique-count':
        return [d3.nest()
                 .key(function(d) {return d[functionColumn]})
                 .entries(v)
                 .length, v.length];
      case 'minimum':
        return [d3.min(v, function(d) {return parseInt(d[functionColumn])}), v.length];
      case 'maximum':
        return [d3.max(v, function(d) {return parseInt(d[functionColumn])}), v.length];
      case 'average':
        return [d3.mean(v, function(d) {return d[functionColumn]}), v.length];
      case 'sum':
        return [d3.sum(v, function(d) {return d[functionColumn]}), v.length];
      default: // this is count
        return [v.length, v.length];
    }
  }, 

  stringToRegex: function(e) {
    var stitchInput = e.currentTarget;
    var string = stitchInput.value;
    var items = string.split(',');
    var stitchID = stitchInput.id;
    var regexString = "^("

    for (var i = 0; i < items.length; i++) {
      var item = items[i];

      if (item.indexOf('-') !== -1) {
        var [start,stop] = item.split('-');
        start = parseInt(start);
        stop = parseInt(stop);

        var startTens, stopTens, stopOnes;
        startTens = Math.floor(start / 10);
        startOnes = start % 10;
        stopTens = Math.floor(stop / 10);
        stopOnes = stop % 10;

        for (var j = startTens; j <= stopTens; j++) {
          if (j != stopTens) {
            if (j ===  startTens) {
              regexString += `${j}[${startOnes}-9]|`;
            } else {
              regexString += `${j}[0-9]|`;
            }
          }
          else {
            if (j === startTens) {
              regexString += `${j}[${startOnes}-${stopOnes}]|`
            } else {
              regexString += `${j}[0-${stopOnes}]|`
            }
          }
        }
      } else {
        regexString += item.trim() + '|';
      }
    }
    regexString = regexString.replace(/\|$/g, ')'); // replace last pipe with closing parenthesis

    this.crochetObject.addStitchRegex(stitchID, regexString);


  },


  /////// MODAL AND TAB CONTROLS
  openStep: function(e, id, change) {
    var tabslinks, tabcontent;
    tablinks = document.getElementsByClassName('step');
    tabcontent = document.getElementsByClassName('step-content');

    if (id == null) {
      this.currentTab += change;
      id = "step" + (this.currentTab+1).toString();
    } else {
      this.currentTab = parseInt(id.replace('step', '')) - 1
    }

    for (var i = 0; i < tabcontent.length; i++) {
      if (id == tabcontent[i].id){
        tabcontent[i].classList.remove('hidden');
      } else {
        tabcontent[i].classList.add('hidden');
      }
      tablinks[i].classList.remove('current');
    }

    if (e != null && e.currentTarget.tagName != 'BUTTON') {
      e.currentTarget.classList.add('current');
    } else {
      tablinks[this.currentTab].classList.add('current');
    }

    if (this.currentTab == 0) {
      document.getElementById('prevButton').classList.add('hidden');
    } else {
      document.getElementById('prevButton').classList.remove('hidden');
    }

    if (this.currentTab != 2) {
      document.getElementById('goButton').classList.add('hidden');
    } else {
      document.getElementById('goButton').classList.remove('hidden');
    }

    if (this.currentTab == 2) {
      document.getElementById('nextButton').classList.add('hidden');
      this.updateDataCrochet();
    } else {
      document.getElementById('nextButton').classList.remove('hidden');
    }

  },

  show: function(id) {
    document.getElementById(id).classList.toggle('hidden');
    this.openStep(null, 'step1', null);
  }



}