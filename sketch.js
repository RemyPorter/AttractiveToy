const N = 3;
const SPEED = 6000;
const GRAB_RADIUS=0.04;
const COLOR_MAP = {
  "1": "#ff0000",
  "2": "#00FF00",
  "3": "#0000FF",
  "4": "#FFFF00",
  "5": "#FF00FF",
  "6": "#00FFFF"
}
let grabbed = null;
let grabbable = null;
let lastGrabbed = null;
let showPings = true;
let lerpDist = 0.5;

function choice(arr) {
  return arr[Math.floor(Math.random()*arr.length)]
}

class AttractorGroup {
  constructor() {
    this.attractors = [
      Vector.Random(5), Vector.Random(5), Vector.Random(5)
    ];
    this.nextPoint = () => choice(this.attractors);
  }

  removeAttractor(a) {
    this.attractors = this.attractors.filter((att) => att != a);
  }
}

class GroupManager {
  constructor() {
    this.groups = {"1": new AttractorGroup()};
    this.editGroup = "1";
    this.activeGroup = "1";
    this.groupSwitchProbability = 0.25;
  }

  toggleGroup(id) {
    if (this.groups[id] && id == this.editGroup && Object.keys(this.groups).length > 1) {
      delete this.groups[id];
      this.editGroup = Object.keys(this.groups)[0];
    } else if (this.groups[id]) {
      this.editGroup = id;
    } else {
      this.groups[id] = new AttractorGroup();
      this.editGroup = id;
    }
  }

  groupNames() { return Object.keys(this.groups); }
  getGroup(id) { return this.groups[id]; }

  allAttractors() {
    let res = [];
    Object.keys(this.groups).forEach((k) => {
      if (this.groups[k]) {
        res = res.concat(this.groups[k].attractors);
      }
    });
    return res;
  }

  addAttractor(att) {
    this.groups[this.editGroup].attractors.push(att);
  }

  removeAttractor(att) {
    this.groups[this.editGroup].removeAttractor(att);
    this.switch();
  }

  onGrab(att) {
    Object.keys(this.groups).forEach((k) => {
      if (this.groups[k].attractors.indexOf(att) > -1) {
        this.editGroup = k;
      }
    })
  }

  switch() {
    let k = Object.keys(this.groups);
    this.activeGroup = choice(k);
  }

  nextPoint() {
    if (random() <= this.groupSwitchProbability) {
      this.switch();
    }
    if (!this.groups[this.activeGroup]) {
      this.switch();
    }
    return this.groups[this.activeGroup].nextPoint();
  }
}

function drawGroup(gm, id) {
  let g = gm.getGroup(id);
  if (g) {
    let attractors = g.attractors;
    if (showPings) {
      attractors.forEach((a) => {
        strokeWeight(1.0/width);
        stroke(COLOR_MAP[id]);
        if (a == grabbable) {
          stroke(255, 255, 255);
        }
        vfill(a);
        if (a == lastGrabbed) {
          strokeWeight(3.0/width);
          fill(255);
        }
        ellipse(a.e(1), a.e(2), 5.0/width, 5.0/height);
      });
      noFill();
    }
  }
}

function drawAttractors(gm) {
  let gs = gm.groupNames();
  if (showPings) {
    gs.forEach((id) => drawGroup(gm, id));
  }
}


let tracepoint = Vector.Random(5);
let gm = new GroupManager();

function step() {
  let dest = gm.nextPoint();
  let inv = dest.subtract(tracepoint);
  inv = inv.multiply(lerpDist);
  tracepoint = tracepoint.add(inv);
}

function seedAttractors() {
  gm = new GroupManager();
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
  drawAttractors(gm);
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
    gm.removeAttractor(lastGrabbed);
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
  } else if (Object.keys(COLOR_MAP).indexOf(key) > -1) {
    gm.toggleGroup(key);
    background(0);
  } else if (keyCode == UP_ARROW) {
    gm.groupSwitchProbability += 0.01;
    background(0);
  } else if (keyCode == DOWN_ARROW) {
    gm.groupSwitchProbability -= 0.01;
    background(0);
  }
}

function mouseClicked() {
  if (grabbable != null) return;
  let a = Vector.Random(5);
  a.elements[0] = mouseX/width;
  a.elements[1] = mouseY/height;
  gm.addAttractor(a);
  background(0);
  tracepoint = Vector.Random(5);
  lastGrabbed = a;
}

function nearMouse() {
  let v = $V([mouseX/width, mouseY/height]);
  let attractors = gm.allAttractors();
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
    gm.onGrab(nm);
  }
}

function mouseReleased() {
  lastGrabbed = grabbed;
  grabbed = null;
}

function mouseDragged() {
  if (grabbed != null) {
    background(0);
    grabbed.elements[0] = mouseX/width;
    grabbed.elements[1] = mouseY/height;
  }
}

function mouseMoved() {
  grabbable = nearMouse();
}