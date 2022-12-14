const getX = (obj) => {
  return obj.x
}
const point = (x, y) =>{
  return {x, y}
}
const emptyObject = () =>{
  return {}
}
const distance = (p1, p2) =>{
  return Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2)
}
const midpoint = (p1, p2) =>{
  return {x: ((p1.x) + (p2.x-p1.x)/2), y: ((p1.y) + (p2.y - p1.y)/2)}
}
/*const sumSalaries = (arr) =>{
  let acc = 0;
  for (const element of arr){
    acc += element.salary
  }
  return acc
}*/
const sumSalaries = (a) => {
  return a.reduce((acc, element)=> acc + element.salary, 0)
}

const newHighScore = (currHigh, arr)=>{
  let nhs = currHigh
  for (const element of arr){
    if (element.score > nhs) nhs = element.score;
  }
  return nhs
}
const summarizeBooks = (arr) =>{
  const summary = {titles: [], pages: 0};
  for (const element of arr){
    summary.titles.push(element.title)
    summary.pages+= element.pages
  }
  return summary
}