/*
CROCHET CHART GENERATOR

Generates different circular crochet charts using the 
different crochet stitches increasing as you increase the number of rounds.

NEXT STEPS:
Make the randomize and normal toggles work
Word pattern

*/

var chain, dc, sc, doubleDC;
var puff, dcCorner, shell, picot, dcChainCorner;

var stitches = [];
var equivNum = []; //array equivalent number of stitches
var basicEquivNum = [];
var specialEquivNum = [];
var basicStitches = [];
var specialStitches = [];
var stitchNum;

var stitchNames = [];
var basicStitchesNames = [];
var specialStitchesNames = [];

var decoration, pattern;
//var singleIncrease; // doubleIncrease;

var saveNum = 1;
var incCounter; // keeps track of the number of increase rounds

var r = 190;
var i;

var replaceCheck = false;
var stitchScale = 0.2;
var rowXTranslate = 270;
var rowYTranslate = -150;
var rowStitchDist = 70;

var probPattern;
var index;
var lastStitch;


///////////////////////


function preload() {
  chain = loadImage("stitches/chain.png"); // CHANGE ALL THE SVGS TO PNGS
  dc = loadImage("stitches/dc.png");
  sc = loadImage("stitches/sc.png");
  doubleDC = loadImage("stitches/double_dc.png");
  dcChainCorner = loadImage("stitches/dc_3ch_corner.png");
  dcCorner = loadImage("stitches/dc_ch_corner.png");
  shell = loadImage("stitches/shell.png");
  picot = loadImage("stitches/picot.png");
  puff = loadImage("stitches/puff.png");
}

function setup() {
  if (windowWidth > 800) { // for desktop
    createCanvas(windowWidth, 0.85*windowHeight); 
    stitchScale = 0.17;
    r = 170; 
    rowYTranslate = -150;
  }
  else if (windowWidth >= 1800) { // for large desktop
    createCanvas(2.4*windowWidth/4, windowHeight);
    stitchScale = 0.17;
    r = 170; 
  }
  else { // for mobile
    //createCanvas(windowWidth, 6*windowHeight/5);
    createCanvas(windowWidth, 0.75*windowHeight);
    stitchScale = 0.12;
    r = 150; 
    rowYTranslate = -250;
    rowXTranslate = -50;
    rowStitchDist = 30;
  }
  
  stitches[0] = chain;
  stitches[1] = sc;
  stitches[2] = dc;
  stitches[3] = doubleDC;
  stitches[4] = puff;
  stitches[5] = dcCorner;
  stitches[6] = dcChainCorner;
  stitches[7] = shell;
  stitches[8] = picot;
  
  basicStitches[0] = chain;
  basicStitches[1] = sc;
  basicStitches[2] = dc;
  basicStitches[3] = doubleDC;
  basicStitches[4] = puff;
  
  specialStitches[0] = dcCorner;
  specialStitches[1] = dcChainCorner;
  specialStitches[2] = shell;
  specialStitches[3] = picot;

  stitchNames = ["chain", "single crochet", "double crochet", "two double crochet", "dc chain shell", "three chain dc shell", "shell", "picot", "puff"];
  basicStitchesNames = ["chain", "single crochet", "double crochet", "two double crochet", "puff"];
  specialStitchesNames = ["dc chain shell", "three chain dc shell", "shell", "picot"];

  
  equivNum = [1, 1, 1, 2, 2, 2, 5, 1, 1];
  basicEquivNum = [1, 1, 1, 2, 1];
  specialEquivNum = [2, 2, 5, 1];


  // PROBABILITY VARIABLES
   
  imageMode(CENTER);
  noLoop();
}

function draw() {
  background(255);
  incCounter = 1; // setting up all the variables
  var initStitchNum = sliderStitch.value;
  var rows = sliderRow.value; // number of rows
  var pattern = " ";
  var patternArray = [];

  var ascendingCheck = document.getElementById("ascending").checked;
  var roundCheck = document.getElementById("roundsMode").checked;



  //var rows = 8;

   // text(n, 50, 50);
   // var debug = document.getElementById("debugger");
   // debug.innerHTML = sliderRow.value;

    
  // making the crochet chart
  noFill();
  noStroke();
  push();
  if (roundCheck) { // check if rounds or rows and translate pattern accordingly
    translate(width/2, height/2);
  }
  else {
    translate(100, 500);
  }

  for (i = 1; i <= rows; i++) {
    var stitchInd = da.getStitchIndex(i);
    // var stitchInd = round(random(0,stitches.length-1));
    var stitchIndTwo = round(random(0,stitches.length-1));
    //var basicStitchInd = round(random(0,basicStitches.length-1));
    //var specialStitchInd = round(random(0,specialStitches.length-1));

    var incNum = i*initStitchNum;

    
    //RANDOM AND ROUNDS
    if (roundCheck) {
      
      var chainRound = new CrochetRound(stitches[stitchInd], stitches[stitchIndTwo]);
      chainRound.repeatAround(incNum, i*r);

      // pattern = incNum + " " + stitchNames[stitchInd] + " stitches\n";
      // patternArray.push(pattern);
      // pLen = patternArray.length;
      // listText = "<ol>";
      // for (var j = 0; j < pLen; j++) {
      //   listText += "<li>" + patternArray[j] + "</li>";
      // }
      // listText += "</ol>";
      // document.getElementById("patternDiv").innerHTML = listText;
    }

    

//COMMENTED OUT WORD PATTERN
      // pattern = initStitchNum + " " + basicStitchesNames[2] + " stitches\n";

      // patternArray.push(pattern);
      // pLen = patternArray.length;
      // listText = "<ol>";
      // for (var j = 0; j < pLen; j++) {
      //   listText += "<li>" + patternArray[j] + "</li>";
      // }
      // listText += "</ol>";
      // document.getElementById("patternDiv").innerHTML = listText;







    //RANDOM AND ROWS
    else if (!roundCheck) {
      
      var chainRound = new CrochetRound(stitches[stitchInd], stitches[stitchIndTwo]);
      chainRound.rowRepeat(initStitchNum, i*r);

      // pattern = initStitchNum + " " + stitchNames[stitchInd] + " stitches\n";
      // patternArray.push(pattern);
      // pLen = patternArray.length;
      // listText = "<ol>";
      // for (var j = 0; j < pLen; j++) {
      //   listText += "<li>" + patternArray[j] + "</li>";
      // }
      // listText += "</ol>";
      // document.getElementById("patternDiv").innerHTML = listText;
    }
    
    incCounter++;

  }
  pop();
}




function generate() {
  replaceCheck = true;
  redraw();
}

function savePattern() {
  save("crochet pattern" + saveNum + ".png");
  saveNum++;
}

/////////////////////////////////////////// THE CROCHET CLASS /////////////////////////////////////////
function CrochetRound(basicStitch, specialStitch) {
  
  this.basic = basicStitch;
  this.special = specialStitch;
 
  
  // need the shape you're repeating and the number of times you repeat it, and the radius of the round
  this.repeatAround = function(num, radius) {
    for (var j = 0; j < num; j++) {
      push();
      var ang = j*TWO_PI/num;
      rotate(ang);
      scale(stitchScale);
      image(this.basic,0,-radius);
      pop();
    }
  }

  // For rows. input the number of stitches and the row distance
  this.rowRepeat = function(num, dist) {
    for (var j = 0; j < num; j++) {
      push();
      var x = rowStitchDist*j;
      translate(rowXTranslate, rowYTranslate);
      // translate(-300, 150);
      // translate(-250-10*num/2, 150+10*num/2);
      // translate(x*num/2, -10*num/2);
      translate(x, 0);
      scale(stitchScale);
      image(this.basic, 0, -dist);
      pop();
    }
  }
  
  // the pattern stitch works!! This is for two stitch patterns. Need to use those class variables correctly. 
  this.patternStitch = function(num, radius) { // prep for having a sequence of stitches on a round
    for (var j = 0; j < num; j++) {
      var ang = j*(TWO_PI/num);
      if (j%2 == 1) {
        push();
        rotate(ang);
        scale(stitchScale);
        image(this.basic, 0, -radius);
        pop();
      }
      else {
        push();
        rotate(ang);
        scale(stitchScale);
        image(this.special, 0, -radius);
        pop();
      }
    }
  }
  
  this.increaseRound = function(num, radius, init) { // (number of stitches in each round, radius of round)
    if (incCounter == 1) {
      for (var j = 0; j < num; j++) {
        var ang = j*(TWO_PI/num);
        push();
        rotate(ang);
        scale(stitchScale);
        image(this.basic, 0, -radius);
        pop();
      }
    }
    
    else if (incCounter == 2) {
      for (var j = 0; j < num/2; j++) {
        var ang = j*(TWO_PI/(num/2));
        push();
        rotate(ang);
        scale(stitchScale);
        image(this.special, 0, -radius);
        pop();
      }
    }
    else {
      for (var j = 0; j < num-init; j++) {
        var ang = j*(TWO_PI/(num-init));
        if (j%(incCounter-1) != 0) {
          push();
          rotate(ang);
          scale(stitchScale);
          image(this.basic, 0, -radius);
          pop();
        }
        else {
          push();
          rotate(ang);
          scale(stitchScale);
          image(this.special, 0, -radius);
          pop();
        }
      }
    }
  }
}