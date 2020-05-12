/*
 * Entry point for the watch app
 */

import document from "document";
import { Accelerometer } from "accelerometer";
import { vibration } from "haptics";

let container = document.getElementById("container");
let myanimation = document.getElementById("myanimation");
myanimation.animate("enable");

let myWolfAnimation = document.getElementById("myWolfAnimation");
myWolfAnimation.animate("enable");

let wolfRunAnimation = document.getElementById("wolfRunAnimation");
wolfRunAnimation.animate("enable");

let squatAnimation = document.getElementById("squatAnimation");
squatAnimation.animate("enable");

let wolfBiteAnimation = document.getElementById("wolfBiteAnimation");
wolfBiteAnimation.animate("enable");

let remainingJumps = document.getElementById("remainingJumps");
let remainingSquats = document.getElementById("remainingSquats");


function setupButtonEventHandler() {
    var easyButton = document.getElementById("easy");
    easyButton.onclick = function(evt) {      
        console.log("Easy pressed");
        remainingJumps.text = "5 Jumping Jacks!";
        container.value = container.value + 1; 
    }
    
    var mediumButton = document.getElementById("medium");
    mediumButton.onclick = function(evt) {
        console.log("Medium pressed");
        remainingJumps.text = "8 Jumping Jacks!";
        container.value = container.value + 1; 
    }
    
    var hardButton = document.getElementById("hard");
    hardButton.onclick = function(evt) {
        console.log("Hard pressed");
        remainingJumps.text = "10 Jumping Jacks!";
        container.value = container.value + 1; 
    }
    
    var nextJumpButton = document.getElementById("next-jump");
    nextJumpButton.onclick = function(evt) {
        console.log("next jump");
        jumps.remaining = 5
        container.value = container.value + 1;
    }
    
    var nextSquatButton = document.getElementById("next-squat");
    nextSquatButton.onclick = function(evt) {
        console.log("next-squat");
        jumps.squatsRemaining = 3
        container.value = container.value + 1;
    }
    
    var backButton = document.getElementById("back");
    backButton.onclick = function(evt) {
        console.log("back");
        container.value = container.value - 1 ;
    }
}

let accel = new Accelerometer();
accel.start();

class JumpingJack { 
  constructor(remaining=5, done=false, squatsRemaining=3) {
    this.remaining = remaining;
    this.done = done;
    this.squatsRemaining = squatsRemaining;
  }

  
  handleSquat() {
    this.squatsRemaining = this.squatsRemaining - 1
    if (this.squatsRemaining <= 0) {
        var message = String("Complete!");
    } else {
        var message = String(this.remaining) + " Squats!";        
    }
    console.log("Squatting");

    remainingSquats.text = message;
    vibration.start("nudge-max");
  }
  
  handleJump() {
    this.remaining = this.remaining - 1

    if (this.remaining <= 0) {
        vibration.start("nudge-max");
        vibration.start("nudge-max");
        vibration.start("nudge-max");
        var message = String("Complete!");
        myanimation.animate("disable");
    } else {
        var message = String(this.remaining) + " jumping jacks!";        
        myanimation.animate("enable");
        console.log("Jumping");

        remainingJumps.text = message;
        vibration.start("nudge-max");
    }
  }
  
  senseData(x, y, z) {
    if (this.done == false) {
      if (x > 10 && y < -12) {
        this.handleJump();
      }
    } else {
      // SQUAT CODE
      if (z > 16) {
        this.handleSquat();
      }
    } 
  }
}

function refreshData() {
  let data = {
    accel: {
      x: accel.x ? accel.x.toFixed(1) : 0,
      y: accel.y ? accel.y.toFixed(1) : 0,
      z: accel.z ? accel.z.toFixed(1) : 0
    }
  };
  // console.log("x: " + String(data.accel.x) + " y " + String(data.accel.y) + " z: " + String(data.accel.z));
  jumps.senseData(data.accel.x, data.accel.y, data.accel.z);
}



// Create a new object to hold jumping jack data
const jumps = new JumpingJack();
setupButtonEventHandler();

let wolfRunAnimation = document.getElementById("wolfRunAnimation");
let wolfBiteAnimation = document.getElementById("wolfBiteAnimation");
let remainingJumps = document.getElementById("remainingJumps");
let remainingSquats = document.getElementById("remainingSquats");


document.onkeypress = function(e) {
  console.log("Key pressed: " + e.key);
  jumps.handleJump();
  console.log("Handling jump")
  jumps.handleSquat();
  console.log("Handling Squat");
}

remainingJumps.onmousedown = function(evt) {      
    jumps.handleJump();
    console.log("Handling jump")
}

remainingSquats.onmousedown = function(evt) {
    jumps.handleSquat();
    console.log("Handling Squat");
}


// jumps.handleJump();
// jumps.handleSquat();
refreshData();
setInterval(refreshData, 100);

