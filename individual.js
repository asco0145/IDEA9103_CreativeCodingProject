let screamImg, guyImg;
let w, h;
let scaleFactor = 0.4;
let revealLocked = false; 


function preload() {
  screamImg = loadImage('assets/TheScream.png');   // painting
  guyImg = loadImage('assets/TheScreamGuy.png');   // foreground guy layer
}

function setup() {
  w = int(screamImg.width * scaleFactor);
  h = int(screamImg.height * scaleFactor);
  createCanvas(w, h);
  screamImg.resize(w, h);
  guyImg.resize(w, h);
}

function draw() {
  background(255);

  // gradually increase distortion over time
 //let magnitude = map(frameCount, 0.5, 2000, 20, 200); //map() re-maps a number from one range to another
// magnitude = constrain(magnitude, 15, 80); //constrain() constrains a number between a minimum and maximum value


// let speed = 0.04; // animation speed of wave


 // animate background with Perlin noise based wave distortion
// for (let y = 0; y < h; y++) {
  //let offset = noise(frameCount * speed, y * 0.05) * magnitude - magnitude / 2; // noise() is from p5js.org/reference/#/p5/noise
   //let jitter = random(-1, 1); // random small jitter
   //if (random(1) < 0.01) jitter += random(-10, 10); //  large jitter


   //copy(screamImg, 0, y, w, 1, offset + jitter, y, w, 1); // copy() copies pixels from a source image to a region of the canvas
 //}

 
  // mouse position controls Perlin parameters 
  //map() re-maps a number from one range to another
  let speed = map(mouseX, 0, width, 0.005, 0.03); // horizontal movement = animation speed 
  let magnitude = map(mouseY, 0, height, 5, 30); // vertical movement = wave magnitude 
  // // top to bottom reveal 
  // let revealHeight = map(mouseY, 0, height, 0, h); 


  let revealHeight;
  if (revealLocked) {
    revealHeight = h;         // full reveal
  } else {
    revealHeight = map(mouseY, 0, height, 0, h);  // interactive reveal
  }

  // animate only up to 'revealHeight' 
  for (let y = 0; y < revealHeight; y++) { 
    // mouse moves change all offsets for more interaction 
    let offset = noise(frameCount * speed, y * 0.04 + mouseX * 0.01) * magnitude - magnitude / 2; // noise() is from p5js.org/reference/#/p5/noise
    copy(screamImg, 0, y, w, 1, offset, y, w, 1); } // copy() to shift the pixel rows horizontally

 
 
  // animate the guy image with random values

 let guyYOffset = sin(frameCount * speed * 2) * magnitude * 0.4;
  let guyXOffset = noise(frameCount * speed * 2) * magnitude * 0.5 - magnitude * 0.25; 
   let jitterX = random(-25, 25);
let jitterY = random(-25, 25);

image(guyImg, guyXOffset + jitterX, guyYOffset + jitterY);

  }

  // click to see full image
  function mousePressed() {
  revealLocked = true;
}




