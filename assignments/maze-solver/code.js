//convenience functions
const degToRad = (radAngle) => radAngle * Math.PI / 180
const radToDeg = (degAngle) => degAngle * 180 / Math.PI
const vector = (angle, magnitude) => {angle, magnitude}
const avg = (array) => array.reduce((a,e) => a+e, 0)/array.length
const twoPointAngle = (a, b) => Math.atan2(b.y - a.y, b.x - a.x)
const twoPointDist = (a, b) => Math.hypot(Math.abs(a.x-b.x), Math.abs(a.y-b.y))
//vector manipulation
const add2Vectors = (a,b) => { // takes array containing 2 vectors
  const x1 = Math.cos(a.angle) * a.magnitude
  const x2 = Math.cos(b.angle) * b.magnitude
  const y1 = Math.sin(a.angle) * a.magnitude
  const y2 = Math.sin(b.angle) * b.magnitude
  const angle = Math.atan2(y1 + y2, x1 + x2)
  const mag = Math.sqrt((x1 + x2) ** 2 + (y1 + y2) ** 2)
  return ({ angle, magnitude: mag })
}
   
const addNumVectors = (a) => {
    return [a.reduce((acc, x) => add2Vectors(acc, x), vector(0, 0))]
}

const vectorMultiply = (o, n) => {
  if (n >= 0) {
    return ({ angle: o.angle, magnitude: o.magnitude * n })
  } else {
    return ({ angle: o.angle + Math.PI, magnitude: o.magnitude * -n })
  }
}

//global
let Theme = {background: 'black', draw: 'white', accents: 'red'}
let Density = 100 // measured in kg/pixel, redefine in REPL
drawFilledRect(0, 0, width, height, Theme.background) 
const ObjArray = []
let CircleCoords = []

//object
const evalCollisions = (object) =>{
  const returnObject = object;
  const collisions = [];
  let index = 0;
  for(const element of ObjArray){
    const distance = Math.hypot(Math.abs(object.x - element.x), Math.abs(object.y - element.y))
    if ((object.radius + element.radius > distance) && (distance != 0)){
      collisions.push({source: element, index: index, angle: Math.atan2(element.y - object.y, element.x - object.x)})
    }
    index++
  }
  console.log('collisions;',JSON.stringify(collisions))
  for (const element of collisions){
    returnObject.x = avg([object.x, element.source.x])
    returnObject.y = avg([object.y, element.source.y])
    returnObject.area += element.source.area
    returnObject.radius = Math.sqrt(object.area)/Math.PI
    returnObject.force.concat(element.force)
    ObjArray.splice(element.index,1)
  }
  return returnObject
}

class Shape{
  constructor(radius, activeForce, x,y){
    this.area = (Math.PI * radius) **2
    this.mass = this.area * Density
    this.x = x
    this.y = y
    this.force = activeForce
    this.radius = radius
  }

  draw(){
    drawCircle(this.x,this.y,this.radius,Theme.draw, 1)
    drawFilledCircle(this.x,this.y,2,Theme.accents)
  }
}

const initDraw = (coordArray) => {
  if (coordArray.length == 3){
    const radius = Math.hypot(Math.abs(coordArray[0].x-coordArray[1].x),Math.abs(coordArray[0].y-coordArray[1].y))
    const force = [vector(
    twoPointAngle(coordArray[0], coordArray[2]),
    twoPointDist(coordArray[0], coordArray[2])
    )]
    drawCircle(coordArray[0].x, coordArray[0].y, radius, Theme.draw)
    drawLine(coordArray[0].x, coordArray[0].y, coordArray[2].x, coordArray[2].y, 1, 'Theme.draw')
    ObjArray.push(new Shape(radius, force, CircleCoords[0].x, CircleCoords[0].y))
    CircleCoords = []
  }
}

registerOnclick((x, y) => {
  drawFilledCircle(x, y, 2, CircleCoords.length < 1 ? Theme.accents : Theme.draw)
  CircleCoords.push({ x, y })
  initDraw(CircleCoords)
})

const nextFrame = () =>{
  clear()
  drawFilledRect(0, 0, width, height, Theme.background)
  let index = 0
  for (let element of ObjArray){
    ObjArray[index] = evalCollisions(element)
    console.log('element', index, JSON.stringify(element))
    element.force = addNumVectors(element.force)
    element.draw()
    index++
  }
}