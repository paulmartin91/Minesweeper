/*
TO DO...
- Make win/lose obvious
- clicking on a flag when flag isn't toggled should remove the flag and maybe add toggle flagged

*/

var flagged = 0,
  gameOver = false,
  mineFlagged = 0,
  wrongFlagged = 0,
  mineCount = 0,
  gameDifficulty = 0;

const toggleUserFlagging = () => {
  if (!flagged) {
    flagged = true;
    document.getElementById("flag").style.backgroundColor = "rgb(255,192,76)";
  } else {
    flagged = false;
    document.getElementById("flag").style.backgroundColor = "";
  }
};

difficultyText = [
  "Nice and easy",
  "Not too challenging",
  "Should be a few mines per row",
  "This is going to be tricky",
  "Probably won't go well",
  "Good luck!",
];

const changeDifficulty = (value) => {
  gameDifficulty = 1 + (value/2);
  $("#sliderValue").html(difficultyText[value]);
};

const newGameWarning = (value) => {
  if (value >= 100) {
    $("#buttonsText").css("display", "block");
  } else {
    $("#buttonsText").css("display", "none");
  }
};

const generateNewMinefield = () => {
  //init canvassize
  $('#resultText').html("")
  let canvasSize = document.getElementById("input").value;
  if (canvasSize >= 100) {
    let confirmation = confirm(
      "Boards over 100 may crash your browser, are you sure?"
    );
    if (confirm) return null;
  }
  gameOver = false;
  var flaggedMines = 0;
  mineCount = 0;
  //init gameboard
  let gameBoard = document.getElementById("gameCanvas");
  //remove all child nodes from gameboard
  while (gameBoard.firstChild) {
    gameBoard.removeChild(gameBoard.firstChild);
  }

  //canvas is square, each tile is ~30px^2 including shaddows
  let newCanvasSize = canvasSize * 33;

  //size the canvas according to the number of tiles
  document.getElementById("gameCanvas").style.width = newCanvasSize + "px";
  document.getElementById("gameCanvas").style.height = newCanvasSize + "px";

  //create temporary virtual gameboard
  let tempVirtualGameboard = [];
  for (let i = 0; i < canvasSize; i++) {
    // create x temporary arrays as rows
    let tempArr = [];
    for (let p = 0; p < canvasSize; p++) {
      //TODO
      //create ~n/10 mines per row [WILL BE BASED ON SET DIFFICULTY]
      if (Math.floor(Math.random() * 10) <= gameDifficulty) {
        //false == mine
        tempArr.push(true);
        //keep track of the number of mines
        mineCount++;
        console.log(mineCount)
      } else {
        //add 1 for non mines
        tempArr.push(0);
      }
    }
    //push rows to temporary virtual gameboard
    tempVirtualGameboard.push(tempArr);
  }

  //itterate over temporary virtual gameboard
  tempVirtualGameboard.forEach((row, rowIndex) => {
    row.forEach((tile, tileIndex) => {
      if (tile === true) {

        let firstRow = rowIndex == 0;
        let lastRow = rowIndex == canvasSize - 1;
        let firstTile = tileIndex == 0;
        let lastTile = tileIndex == canvasSize - 1;

        //left
        if (!firstTile && row[tileIndex - 1] !== true) row[tileIndex - 1]++;

        //right
        if (!lastTile && row[tileIndex + 1] !== true) row[tileIndex + 1]++;

        //up
        if (!firstRow && tempVirtualGameboard[rowIndex - 1][tileIndex] !== true)
          tempVirtualGameboard[rowIndex - 1][tileIndex]++;

        //down
        if (!lastRow && tempVirtualGameboard[rowIndex + 1][tileIndex] !== true)
          tempVirtualGameboard[rowIndex + 1][tileIndex]++;

        //up/left
        if (
          !firstRow &&
          !firstTile &&
          tempVirtualGameboard[rowIndex - 1][tileIndex - 1] !== true
        )
          tempVirtualGameboard[rowIndex - 1][tileIndex - 1]++;

        //up/right
        if (
          !firstRow &&
          !lastTile &&
          tempVirtualGameboard[rowIndex - 1][tileIndex + 1] !== true
        )
          tempVirtualGameboard[rowIndex - 1][tileIndex + 1]++;

        //down/left
        if (
          !lastRow &&
          !firstTile &&
          tempVirtualGameboard[rowIndex + 1][tileIndex - 1] !== true
        )
          tempVirtualGameboard[rowIndex + 1][tileIndex - 1]++;

        //down/right
        if (
          !lastRow &&
          !lastTile &&
          tempVirtualGameboard[rowIndex + 1][tileIndex + 1] !== true
        )
          tempVirtualGameboard[rowIndex + 1][tileIndex + 1]++;
      }
    });
  });

  console.log(tempVirtualGameboard)

  //iterate over final virtual gameboard
  tempVirtualGameboard.forEach((row, rowIndex) => {
    // finalVirtualGameboard.forEach((row, rowIndex)=>{
    //append a row with the id of the row's index
    $("#gameCanvas").append('<tr id = "row' + rowIndex + '"></tr>');
    row.forEach((tile) => {
      //if the tile is a mine, add on a mine tile
      if (tile === true)
        $("#row" + rowIndex).append(
          '<td class = "tile" onclick="tileClick(this)"> </td>'
        );
      //else add on the number in the tile
      else
        $("#row" + rowIndex).append(
          '<td class = "tile" onclick="tileClick(this)">' + tile + "</td>"
        );
    });
  });
};

let zeroClicked = (tile, rowIndex, cellIndex) => {
  let canvasSize = document.getElementById("input").value;
  let canvas = document.getElementById("gameCanvas");
  tile.innerHTML = "";
  tile.style.backgroundColor = "rgb	(157,225,154)";
  let up = null,
    down = null,
    left = null,
    right = null;

  //get surrounding tile values
  if (rowIndex != 0) {
    up = canvas.rows[rowIndex - 1].cells[cellIndex];
  } 
  // else {
  //   up = tile;
  // }
  if (cellIndex != canvasSize - 1) {
    right = canvas.rows[rowIndex].cells[cellIndex + 1];
  } 
  // else {
  //   right = tile;
  // }
  if (rowIndex != canvasSize - 1) {
    down = canvas.rows[rowIndex + 1].cells[cellIndex];
  } 
  // else {
  //   down = tile;
  // }
  if (cellIndex != 0) {
    left = canvas.rows[rowIndex].cells[cellIndex - 1];
  } 
  // else {
  //   left = tile;
  // }

  //reveal corners if they are not mines

  if (
    //if left and down arent mines
    left &&
    down &&
    left.innerHTML != "" &&
    down.innerHTML != "" 
  ) {
    //reveal down/left
    canvas.rows[rowIndex + 1].cells[cellIndex - 1].style.color = "black";
    canvas.rows[rowIndex + 1].cells[cellIndex - 1].style.backgroundColor =
      "rgb(157,225,154)";
  }

  if (
    left &&
    up &&
    left.innerHTML != "" &&
    up.innerHTML != ""
  ) {
    canvas.rows[rowIndex - 1].cells[cellIndex - 1].style.color = "black";
    canvas.rows[rowIndex - 1].cells[cellIndex - 1].style.backgroundColor =
      "rgb(157,225,154)";
  }
  if (
    right &&
    up &&
    right.innerHTML != "" &&
    up.innerHTML != ""
  ) {
    canvas.rows[rowIndex - 1].cells[cellIndex + 1].style.color = "black";
    canvas.rows[rowIndex - 1].cells[cellIndex + 1].style.backgroundColor =
      "rgb(157,225,154)";
  }
  if (
    right &&
    down &&
    right.innerHTML != "" &&
    down.innerHTML != ""
  ) {
    canvas.rows[rowIndex + 1].cells[cellIndex + 1].style.color = "black";
    canvas.rows[rowIndex + 1].cells[cellIndex + 1].style.backgroundColor =
      "rgb(157,225,154)";
  }

  let directionArr = [up, down, left, right];

  directionArr.forEach(direction => {
    if (direction) {
      if (direction.innerHTML === "0") {
        //repeat function with 0
        zeroClicked(
          direction,
          direction.parentNode.rowIndex,
          direction.cellIndex
        );
      } else {
        direction.style.color = "black";
        direction.style.backgroundColor = "rgb(157,225,154)";
        tile.style.color = "black";
        tile.style.backgroundColor = "rgb(157,225,154)";
      }
    }
  })
};

//when the userclicks on a tile
let tileClick = function (clickedTile) {
  //do nothing if game is over
  if (!gameOver) {
    let rowIndex = clickedTile.parentNode.rowIndex;
    let cellIndex = clickedTile.cellIndex;
    let tileType = clickedTile.innerHTML;
    switch (tileType) {
      //if mine is clicked
      case " ":
        {
          //if user is in flagging mode
          if (flagged) {
            //if tile is already flagged
            if (clickedTile.flagged) {
              //remove the flag
              clickedTile.classList.remove("flag");
              //mark the tile as unflagged
              clickedTile.flagged = false;
              //count the number of mines flagged
              mineFlagged--;
            } else {
              //if tile not already flagged
              clickedTile.classList.add("flag");
              //mark the tile as flagged
              clickedTile.flagged = true;
              //count the number of mines flagged
              console.log(mineFlagged)
              mineFlagged++;
              console.log(mineFlagged, mineCount)
              //if all mines are accounted for and no tiles are wrongly flagged
              //console.log(mineFlagged, mineCount, wrongFlagged)
              if (mineFlagged == mineCount && wrongFlagged == 0) {
                //TODO
                //GAME WON EVENT
                document
                  .getElementById("gameCanvas")
                  .childNodes.forEach((x) => {
                    x.childNodes.forEach((y) => (y.style.color = "green"));
                  });
                  $('#resultText').html("WINNER!")
                //game is over
                gameOver = true;
              }
            }
          } else {
            clickedTile.classList.add("ron");
            gameOver = true;
            document.getElementById("gameCanvas").childNodes.forEach((row) =>
              row.childNodes.forEach((tile) => {
                if (tile.innerHTML == " ") {
                  //show all mines
                  tile.classList.add("ron");
                } else if (tile.innerHTML == "0") {
                  //hide 0's
                  tile.style.color = "rgb(164,197,234)";
                } else {
                  //show all numbers
                  tile.style.color = "black";
                }
              })
            );
            $('#resultText').html("TOO BAD")
          }
        }
        break;
      case "0":
        {
          if (flagged) {
            if (clickedTile.flagged) {
              clickedTile.classList.remove("flag");
              clickedTile.flagged = false;
              wrongFlagged--;
            } else {
              clickedTile.classList.add("flag");
              clickedTile.flagged = true;
              wrongFlagged++;
            }
          } else {
            clickedTile.style.backgroundColor = "rgb(211,211,211)";
            zeroClicked(clickedTile, rowIndex, cellIndex);
          }
        }
        break;
      default:
        {
          if (flagged) {
            if (clickedTile.flagged) {
              clickedTile.classList.remove("flag");
              clickedTile.flagged = 0;
              wrongFlagged--;
            } else {
              clickedTile.classList.add("flag");
              clickedTile.flagged = 1;
              wrongFlagged++;
            }
          } else {
            clickedTile.style.color = "black";
            clickedTile.style.backgroundColor = "rgb(157,225,154)";
          }
        }
        break;
    }
  }
};
