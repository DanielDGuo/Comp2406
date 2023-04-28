//KEY CODES
//should clean up these hard-coded key codes
const ENTER = 13
//code pertaining to following values was removed
const RIGHT_ARROW = 39
const LEFT_ARROW = 37
const UP_ARROW = 38
const DOWN_ARROW = 40

let puzzle = {}


function handleKeyDown(e) {

}

function handleKeyUp(e) {
  if (e.which == ENTER) {
    handleGetPuzzle() //treat ENTER key like you would a get
  }

  e.stopPropagation()
  e.preventDefault()
}

function handleGetPuzzle() {

  let userText = document.getElementById('userTextField').value

  if (userText && userText != '') {

    //outputs user input
    let textDiv = document.getElementById("text-area")
    textDiv.innerHTML = `<p> ${userText}</p>`

    let userRequestObj = { text: userText }
    let userRequestJSON = JSON.stringify(userRequestObj)
    document.getElementById('userTextField').value = ''
    //alert ("You typed: " + userText);


    const data = { username: 'example' }

    fetch('/userText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: userRequestJSON,
    })
      .then((response) => response.json())
      .then((data) => {
        words = [] //clear drag-able words array
        if (data.puzzleLines) {
          puzzle.puzzleLines = data.puzzleLines
        } else {
          puzzle.puzzleLines = []
        }

        //read the lines of the puzzle
        for (let i = 0; i < puzzle.puzzleLines.length; i++) {
          let line = puzzle.puzzleLines[i]
          let currentWord = ""
          for (c in line) {
            //for every space that signals the end of a character, add it to the words array
            if (line[c] == ' ') {
              words.push({ word: currentWord, x: Math.floor(Math.random() * canvas.width), y: Math.floor(Math.random() * canvas.height) })
              currentWord = ""
            } else {
              //otherwise build on the current word
              currentWord += line[c]
            }
          }
          //push in the last word that doesn't have a trailing space
          words.push({ word: currentWord, x: Math.floor(Math.random() * canvas.width), y: Math.floor(Math.random() * canvas.height) })
        }
        drawCanvas()

      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }
}

function handleSolvePuzzle() {

  //clears the html
  let textDiv = document.getElementById("text-area")
  textDiv.innerHTML = ''

  //store the order of the words of the solution. Near identical to adding new words
  var puzzleSolution = []
  if (puzzle.puzzleLines) {
    for (let i = 0; i < puzzle.puzzleLines.length; i++) {
      let line = puzzle.puzzleLines[i]
      let currentWord = ""
      for (c in line) {
        if (line[c] == ' ') {
          puzzleSolution.push(currentWord)
          currentWord = ""
        } else {
          currentWord += line[c]
        }
      }
      puzzleSolution.push(currentWord)
    }
    drawCanvas()
  }

  //scan the canvas 40 pixels at a time
  const lineTolerance = 40;

  //find the word with the lowest y value, then move up half the tolerance to begin scanning
  var highestWordY = canvas.height * 2;
  for (let i = 0; i < words.length; i++) {
    if (words[i].y < highestWordY) {
      highestWordY = words[i].y;
    }
  }
  highestWordY -= lineTolerance / 2;

  var output = [];
  var userSol = [];
  for (let y = highestWordY; y < canvas.height + 2 * lineTolerance; y += lineTolerance) {
    var lineWords = [];
    var line = "";
    //check each words to see if its in the line
    for (let i = 0; i < words.length; i++) {
      if (words[i].y > y && words[i].y < y + lineTolerance) {
        //for each word in the line, add it in sorted order in order of word.x to lineWords
        var curIndex = 0;
        for (let j = 0; j < lineWords.length; j++) {
          if (words[i].x > lineWords[j].x) {
            curIndex++;
          } else {
            break;
          }
        }
        lineWords.splice(curIndex, 0, words[i])
        words[i].y = y + lineTolerance / 2;
      }
    }

    //contcatenates strings in lineWords and adds string to userSol
    for (let i = 0; i < lineWords.length; i++) {
      line += lineWords[i].word + " "
      userSol.push(lineWords[i].word)
    }
    //adds the line to the output
    output.push(line)
  }

  //iterate and check over the user solution. Sets a flag if it is/isnt correct
  var correct = true;
  for (let i = 0; i < userSol.length; i++) {
    if (userSol[i] != words[i].word) {
      correct = false;
    }
  }
  //redraws the html dependent on the state of correctness
  if (correct) {
    for (let i = 0; i < output.length; i++) {
      textDiv.innerHTML = textDiv.innerHTML + `<p> <span class="correct"> ${output[i]}</span></p>`
    }
  } else {
    for (let i = 0; i < output.length; i++) {
      textDiv.innerHTML = textDiv.innerHTML + `<p> <span class="incorrect"> ${output[i]}</span></p>`
    }
  }
  drawCanvas()
}


