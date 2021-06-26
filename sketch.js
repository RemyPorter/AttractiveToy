const N = 3;
const SPEED = 4000;
const GRAB_RADIUS=0.05;
let grabbed = null;
let grabbable = null;
let lastGrabbed = null;
let showPings = true;
let lerpDist = 0.5;

let attractors = [
];

let tracepoint = Vector.Random(5);

function step() {
  let dest = attractors[Math.floor(Math.random()*attractors.length)];
  let inv = dest.subtract(tracepoint);
  inv = inv.multiply(lerpDist);
  tracepoint = tracepoint.add(inv);
}

function seedAttractors() {
  attractors = [];
  for (let i = 0; i < N; i++) {
    attractors.push(Vector.Random(5));
  }
  tracepoint = Vector.Random(5);
}

function setup() {
  seedAttractors();
  createCanvas(windowWidth, windowHeight);
  background(0);
  scale(width, height);
  ellipseMode(CENTER);
  colorMode(RGB, 1.0);
  noStroke();
}

function vfill(vec) {
  fill(vec.e(3), vec.e(4), vec.e(5));
}

function draw() {
  scale(width, height);
  console.log(grabbable);
  if (showPings) {
    attractors.forEach((a) => {
      strokeWeight(1.0/height);
      if (a == grabbable) {
        stroke(255, 0, 0);
      } else {
        stroke(255);
      }
      vfill(a);
      ellipse(a.e(1), a.e(2), 5.0/width, 5.0/width);
    });
  }
  noStroke();
  for (let i = 0; i < SPEED; i++) {
    vfill(tracepoint);
    ellipse(tracepoint.e(1), tracepoint.e(2), 1.0/width, 1.0/width);
    step();
  }
}

function keyPressed() {
  if (key == "c") {
    seedAttractors();
    background(0);
  } else if (key == "p") {
    showPings = !showPings;
    background(0);
  } else if (key == "r") {
    if (attractors.length > 3)
      attractors = attractors.filter((a) => a != lastGrabbed);
    background(0);
  } else if (key == "=" || key == "+") {
    lerpDist += 0.01;
    background(0);
  } else if (key == "-" || key == "_") {
    lerpDist -= 0.01;
    background(0);
  } else if (key == " " && lastGrabbed != null) {
    lastGrabbed.elements[2] = random();
    lastGrabbed.elements[3] = random();
    lastGrabbed.elements[4] = random();
    background(0);
  }
}

function mouseClicked() {
  if (grabbable != null) return;
  let a = Vector.Random(5);
  a.elements[0] = mouseX/width;
  a.elements[1] = mouseY/height;
  attractors.push(a);
  background(0);
  tracepoint = Vector.Random(5);
  lastGrabbed = a;
}

function nearMouse() {
  let v = $V([mouseX/width, mouseY/height]);
  for (let i = 0; i < attractors.length; i++) {
    let av = attractors[i];
    let dv = $V([av.e(1), av.e(2)]);
    if (dv.distanceFrom(v) <= GRAB_RADIUS) {
      console.log("near mouse (", dv.e(1), dv.e(2), ")");
      return av;
    }
  }
  return null;
}

function mousePressed() {
  let nm = nearMouse();
  if (nm != null) {
    grabbed = nm;
    console.log("grabbed");
  }
}

function mouseReleased() {
  console.log("Released");
  lastGrabbed = grabbed;
  grabbed = null;
}

function mouseDragged() {
  if (grabbed != null) {
    console.log("moving");
    background(0);
    grabbed.elements[0] = mouseX/width;
    grabbed.elements[1] = mouseY/height;
  }
}

function mouseMoved() {
  grabbable = nearMouse();
}