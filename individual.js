let screamImg, guyImg;
let w, h;
let scaleFactor = 0.4;

function preload() {
  screamImg = loadImage('TheScream.png');   // painting
  guyImg = loadImage('TheScreamGuy.png');   // foreground guy layer
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

  // mouse position controls Perlin parameters
  let speed = map(mouseX, 0, width, 0.005, 0.03);      // horizontal movement = animation speed
  let magnitude = map(mouseY, 0, height, 5, 30);       // vertical movement = wave magnitude

 
  // animate the guy image with random values

 let guyYOffset = sin(frameCount * speed * 2 + mouseY) * magnitude * 0.4;
  let guyXOffset = noise(frameCount * speed * 2 + mouseX) * magnitude * 0.5 - magnitude * 0.25;


image(guyImg, guyXOffset, guyYOffset);
  }


