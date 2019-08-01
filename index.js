var flagged = 0, gameOver = 0, mineEgged = 0, wrongFlagged = 0;

let flag = function(){
  if (!flagged){
    flagged = true
    document.getElementById("flag").style.backgroundColor = "rgb(255,192,76)";
  } else {
    flagged = false
    document.getElementById("flag").style.backgroundColor = ""
    }
}

let test = function(){
var flaggedMines = 0;
mineCount = 0
gameOver = 0;
var myNode = document.getElementById("gameCanvas");
while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
}
  
let canvasSize = document.getElementById("input").value
let newCanvasSize = (canvasSize * 30) + (canvasSize*2)
document.getElementById("gameCanvas").style.width = newCanvasSize+"px";
document.getElementById("gameCanvas").style.height = newCanvasSize+"px";

let mineArr = []
for (let i=0;i<canvasSize;i++){
let tempArr = []
for (let p=0;p<canvasSize;p++){
if (Math.floor(Math.random() * 10) == 1){
  tempArr.push(true)
  mineCount++
} else {
  tempArr.push(0)
}
}
  mineArr.push(tempArr)
}
  let newerArr = []
  mineArr.forEach((x, n)=>{
  newerArr.push([]);
  x.forEach((y, z)=>{
    newerArr[n].push(y)
    
    if (x[z-1]===true){if (newerArr[n][z] !== true) {newerArr[n][z]++}}
    if (x[z+1]===true){if (newerArr[n][z] !== true) {newerArr[n][z]++}}
    if (n !== 0){
    if (mineArr[n-1][z]===true){if (newerArr[n][z] !== true) {newerArr[n][z]++}}
    if (mineArr[n-1][z-1]===true){if (newerArr[n][z] !== true) {newerArr[n][z]++}}
    if (mineArr[n-1][z+1]===true){if (newerArr[n][z] !== true) {newerArr[n][z]++}} 
    }
    if (n !== mineArr.length-1){
    if (mineArr[n+1][z]===true){if (newerArr[n][z] !== true) {newerArr[n][z]++}}
    if (mineArr[n+1][z-1]===true){if (newerArr[n][z] !== true) {newerArr[n][z]++}}
    if (mineArr[n+1][z+1]===true){if (newerArr[n][z] !== true) {newerArr[n][z]++}}
    }
  })
}) 
       newerArr.forEach((g, x)=>{
       $("#gameCanvas").append("<tr id = \"row"+x+"\"></tr>")
       g.forEach((h, y)=>{
       if (h===true){ $("#row"+x).append("<td class = \"tile\" onclick=\"tileClick(this)\"> </td>")} 
       else { $("#row"+x).append("<td class = \"tile\" onclick=\"tileClick(this)\">"+h+"</td>")}
         })
       })
}

let zeroClicked = function(tile, x, y){//
let canvasSize = document.getElementById("input").value 
let canvas = document.getElementById("gameCanvas")
tile.innerHTML = ""
tile.style.backgroundColor = "rgb	(157,225,154)"
let up, down, left, right = ""
  
if (x !=0) { up = canvas.rows[x-1].cells[y]} else { up = tile}
if (y != canvasSize-1){ right = canvas.rows[x].cells[y+1]} else { right = tile}
if (x != canvasSize-1){ down = canvas.rows[x+1].cells[y]} else { down = tile}
if (y != 0){ left = canvas.rows[x].cells[y-1]} else { left = tile}

if (left.innerHTML != "" && down.innerHTML != ""){
canvas.rows[x+1].cells[y-1].style.color = "black"
canvas.rows[x+1].cells[y-1].style.backgroundColor = "rgb(157,225,154)"
}
  
if (left.innerHTML != "" && up.innerHTML != ""){
canvas.rows[x-1].cells[y-1].style.color = "black"
canvas.rows[x-1].cells[y-1].style.backgroundColor = "rgb(157,225,154)"
}
if (right.innerHTML != "" && up.innerHTML != ""){
canvas.rows[x-1].cells[y+1].style.color = "black"
canvas.rows[x-1].cells[y+1].style.backgroundColor = "rgb(157,225,154)"
}
if (right.innerHTML != "" && down.innerHTML != ""){
canvas.rows[x+1].cells[y+1].style.color = "black"
canvas.rows[x+1].cells[y+1].style.backgroundColor = "rgb(157,225,154)"
}
  
let directionArr = [up, down, left, right]

for (let i=0; i<4; i++) {
  if (directionArr[i].innerHTML === "0"){
  zeroClicked(directionArr[i], directionArr[i].parentNode.rowIndex, directionArr[i].cellIndex)
  }
  else {
    directionArr[i].style.color = "black"
    directionArr[i].style.backgroundColor = "rgb(157,225,154)"
    tile.style.color = "black"
    tile.style.backgroundColor = "rgb(157,225,154)"
}
}
  }

let tileClick = function(clickedTile){
if (!gameOver){
let rowIndex = clickedTile.parentNode.rowIndex
let cellIndex = clickedTile.cellIndex
let tileType = clickedTile.innerHTML
switch(tileType){
case " ": {
if (flagged) {
if (clickedTile.flagged){
clickedTile.classList.remove("flag")
clickedTile.flagged = 0;
mineEgged--
} else {
clickedTile.classList.add("flag")
clickedTile.flagged = 1;
mineEgged++
console.log(wrongFlagged)
if (mineEgged == mineCount && wrongFlagged == 0) {
document.getElementById("gameCanvas").childNodes.forEach(x=>x.childNodes.forEach(y=>y.style.color = "green"))
gameOver++
}
}
} else {
clickedTile.classList.add("ron")
gameOver = true;
document.getElementById("gameCanvas").childNodes.forEach(x=>x.childNodes.forEach(y=>{
if (y.innerHTML == " ") {y.classList.add("ron")}
y.style.color = "black"
}))
  }
}
    break;
  case "0":  {
       if (flagged) {      
    if (clickedTile.flagged){
clickedTile.classList.remove("flag")
clickedTile.flagged = 0;
wrongFlagged--
} else {
clickedTile.classList.add("flag")
clickedTile.flagged = 1;
wrongFlagged++
    } 
    }
    else {
    clickedTile.style.backgroundColor = "rgb(211,211,211)"
    zeroClicked(clickedTile, rowIndex, cellIndex)
  }
  }
    break;
  case "1":
  case "2":
  case "3": 
  case "4":
  case "5":
  case "6":
  case "7":
  case "8": 
    {
    if (flagged) {      
    if (clickedTile.flagged){
clickedTile.classList.remove("flag")
clickedTile.flagged = 0;
wrongFlagged--
} else {
clickedTile.classList.add("flag")
clickedTile.flagged = 1;
wrongFlagged++
    } 
    }
    else {
    clickedTile.style.color = "black";
    clickedTile.style.backgroundColor = "rgb(157,225,154)";
    }
}
    break;      
} 
}
}
