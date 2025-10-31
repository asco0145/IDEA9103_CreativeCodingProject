let baseImg, skyMask, waterMask, hillsMask, bridgeMask, guyMask;
let sky, water, hills, bridge, guy;

function preload(){
  baseImg = loadImage("assets/scream.jpeg")
  guyMask = loadImage("assets/guy.png")
  skyMask = loadImage("assets/sky.png")
  waterMask = loadImage("assets/water.png")
  hillsMask = loadImage("assets/hills.png")
  bridgeMask = loadImage("assets/bridge.png")

  sky = new SkyArea(skyMask);
  water = new WaterArea(waterMask);
  hills = new HillsArea(hillsMask);
  bridge = new BridgeArea(bridgeMask);
  guy = new GuyArea(guyMask);
}

function setup() {
  createCanvas(baseImg.width, baseImg.height);

  image(baseImg, 0, 0)
}

function draw() {
  background(220);

  
}

class SkyArea {
  
}

class WaterArea {
  
}

class HillsArea {
 
}

class BridgeArea {
  
}

class GuyArea {
  
}