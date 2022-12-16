const rotate = (cx, cy, x, y, angle) => {
    let radians = (Math.PI / 180) * angle;
    cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}
const findCenter = (pts, nPts) =>{  // stolen from stack overflow by sze ting
    let off = pts[0];
    let twicearea = 0;
    let x = 0;
    let y = 0;
    let p1,p2;
    let f;
    for (let i = 0, j = nPts - 1; i < nPts; j = i++) {
        p1 = pts[i];
        p2 = pts[j];
        f = (p1.lat - off.lat) * (p2.lng - off.lng) - (p2.lat - off.lat) * (p1.lng - off.lng);
        twicearea += f;
        x += (p1.lat + p2.lat - 2 * off.lat) * f;
        y += (p1.lng + p2.lng - 2 * off.lng) * f;
    }
    f = twicearea * 3;
    return {
    X: x / f + off.lat,
    Y: y / f + off.lng
    };
}

//vector manipulation
const vector = (angle, magnitude) => {
  return ({ angle: angle * Math.PI / 180, magnitude })
}

const add2Vectors = (a) => {
  const x1 = Math.cos(a[0].angle) * a[0].magnitude
  const x2 = Math.cos(a[1].angle) * a[1].magnitude
  const y1 = Math.sin(a[0].angle) * a[0].magnitude
  const y2 = Math.sin(a[1].angle) * a[1].magnitude
  const angle = Math.atan2(y1 + y2, x1 + x2)
  const mag = Math.sqrt((x1 + x2) ** 2 + (y1 + y2) ** 2)
  return ({ angle, magnitude: mag })
}

const vectorMultiply = (o, n) => {
  if (n >= 0) {
    return ({ angle: o.angle, magnitude: o.magnitude * n })
  } else {
    return ({ angle: o.angle + Math.PI, magnitude: o.magnitude * -n })
  }
}
const addGrav = (obj, array) =>{
const gravAttraction = (o1, o2) => {
  const angle = Math.atan2(o2.centerY - o1.centerY, o2.centerX - o1.centerX)
  const distance = Math.hypot(Math.abs(o1.centerX - o2.centerX), Math.abs(o1.centerY - o2.centerY))
  if (distance === 0) return vector(0,0)
  else return vector(angle, (o1.mass * o2.mass * 6.6743e-11) / distance ** 2)
}
for (const element of array){
  obj.actingForce.push(gravAttraction(obj, element))
}
}
const addNumVectors = (a, mode) => {
  if (mode === 'degrees') {
    const r = a.reduce((acc, x) => add2Vectors([acc, x]), vector(0, 0))
    r.angle = r.angle * 180 / Math.PI
    return r
  } else {
    return a.reduce((acc, x) => add2Vectors([acc, x]), vector(0, 0))
  }
}

// shape/object manipulation
const ObjArray = []
let CoordsArray = []


// registerOn.. functions are in quotes as they will not work in this environment
registerOnclick((x,y) =>{
CoordsArray.push({x, y})
})


class Shape {
 constructor(mass, actingForces, coordArray){
   this.startingX = coordArray[0].x
   this.startingY = coordArray[0].y
   this.sides = createSides(coordArray)
   this.vertices = coordArray
   this.mass = mass
   // todo this.centerX =
   // todo this.centerY =  
   this.rotation = 0
   this.actingForce = [addNumVectors(actingForces)]
 }
 drawShape() {
    let currX = this.startingX;
    let currY = this.startingY;

    for (let i = 0; i < this.sidesCords.length; i++) {
      let coordSetStart = rotate(this.centerX, this.centerY, currX, currY, this.rotation)
      let coordSetEnd = rotate(this.centerX, this.centerY, currX + this.sidesCords[i].xAdd, currY + this.sidesCords[i].yAdd, this.rotation)
      drawLine(coordSetStart[0], coordSetStart[1], coordSetEnd[0], coordSetEnd[1], 'black', ctx);
      currX = currX + this.sidesCords[i].xAdd;
      currY = currY + this.sidesCords[i].yAdd;
    }
  }
  getBoundOfObject() {
    let currX = this.startingY;
    let currY = this.startingX;
    let array = []
    for (let i = 0; i < this.sidesCords.length; i++) {
      let coordSetStart = rotate(this.centerX, this.centerY, currX, currY, this.rotation)
      let coordSetEnd = rotate(this.centerX, this.centerY, currX + this.sidesCords[i].xAdd, currY + this.sidesCords[i].yAdd, this.rotation);
      let numOfSidePixels = Math.round(Math.sqrt(((coordSetStart[0]-coordSetEnd[0]) ** 2) + ((coordSetStart[1]-coordSetEnd[1]) ** 2)));

      drawLine(coordSetStart[0], coordSetStart[1], coordSetEnd[0], coordSetEnd[1])
      
      let xAddPerPix = (coordSetEnd[0] - coordSetStart[0])/numOfSidePixels
      let yAddPerPix = (coordSetEnd[1] - coordSetStart[1])/numOfSidePixels

      for(let n = 0; n<numOfSidePixels; n++){
        array.push({"x" : coordSetStart[0] + n*xAddPerPix, "y" : coordSetStart[1] + n*yAddPerPix})
      }
      
      currX = currX + this.sidesCords[i].xAdd;
      currY = currY + this.sidesCords[i].yAdd;
    }
    return array
  }
}


const createSides = (array) =>{
  const returnArray = []
  for (let v = 0; v<array.length-1; v++){
    returnArray.push({xAdd: array[v+1].x - array[v].x, yAdd: array[v+1].y - array[v].y})
  }
  returnArray.push({xAdd: array[0].x - array[array.length-1].x, yAdd: array[0].y - array[array.length-1].y})
  return returnArray
}
//registerOnKeyDown((Space)=>{
  const simulateSpacePress = (mass, actingforces) =>{
  ObjArray.push(new Shape(mass, actingforces, CoordsArray))
  CoordsArray.createSides.drawShape()
  CoordsArray = []
  }
//})

// draw on canvas and make changes to shapes

const drawFrame = (time) => {
  if (time > next) {
    
    clear();
    for (const element of ObjArray){
    addGravity(element, ObjArray)
    addNumVectors(element.actingForce)
    const objectBound = element.getBoundOfObject();
    console.log(objectBound);

    element.drawShape();
    element.rotation = countFrame*1;
    next += 10;
    countFrame++;
  }}
}
//animate(drawFrame)