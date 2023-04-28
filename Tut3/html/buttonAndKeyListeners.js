//KEY CODES
//should clean up these hard-coded key codes
const ENTER = 13
const RIGHT_ARROW = 39
const LEFT_ARROW = 37
const UP_ARROW = 38
const DOWN_ARROW = 40

let song = {}


function handleKeyDown(e) {

  //console.log("keydown code = " + e.which)

  let dXY = 5; //amount to move in both X and Y direction
  if (e.which == UP_ARROW && movingBox.y >= dXY)
    movingBox.y -= dXY //up arrow
  if (e.which == RIGHT_ARROW && movingBox.x + movingBox.width + dXY <= canvas.width)
    movingBox.x += dXY //right arrow
  if (e.which == LEFT_ARROW && movingBox.x >= dXY)
    movingBox.x -= dXY //left arrow
  if (e.which == DOWN_ARROW && movingBox.y + movingBox.height + dXY <= canvas.height)
    movingBox.y += dXY //down arrow

  let keyCode = e.which
  if (keyCode == UP_ARROW | keyCode == DOWN_ARROW) {
    //prevent browser from using these with text input drop downs
    e.stopPropagation()
    e.preventDefault()
  }

}

function handleKeyUp(e) {
  //  console.log("key UP: " + e.which)
  if (e.which == RIGHT_ARROW | e.which == LEFT_ARROW | e.which == UP_ARROW | e.which == DOWN_ARROW) {
    let dataObj = {
      x: movingBox.x,
      y: movingBox.y
    }
    //create a JSON string representation of the data object
    let jsonString = JSON.stringify(dataObj)
    //DO NOTHING WITH THIS DATA FOR NOW


  }
  if (e.which == ENTER) {
    handleSubmitButton() //treat ENTER key like you would a submit
    document.getElementById('userTextField').value = ''

  }

  e.stopPropagation()
  e.preventDefault()

}

function handleSubmitButton() {

  let userText = document.getElementById('userTextField').value
  if (userText && userText != '') {

    let textDiv = document.getElementById("text-area")
    textDiv.innerHTML = textDiv.innerHTML + `<p> ${userText}</p>`

    let userRequestObj = { text: userText }
    let userRequestJSON = JSON.stringify(userRequestObj)
    document.getElementById('userTextField').value = ''
    //alert ("You typed: " + userText);

    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log("data: " + this.responseText)
        console.log("typeof: " + typeof this.responseText)
        //we are expecting the response text to be a JSON string
        let responseObj = JSON.parse(this.responseText)
        if (responseObj.text.includes("NOT FOUND")) {
          movingString.word = responseObj.text
        } else {
          movingString.word = 'FOUND'
        }

        words = [] //clear drag-able words array;
        if (responseObj.songLines) {
          song.songLines = responseObj.songLines
        }else{
          song.songLines = []
        }

        for (let i = 0; i < song.songLines.length; i++) {
          let line = song.songLines[i]
          let currentWord = ""
          for (c in line) {
            if (line[c] == ' ') {
              words.push({ word: currentWord, x: Math.floor(Math.random() * canvas.width), y: Math.floor(Math.random() * canvas.height) })
              currentWord = ""
            } else {
              currentWord += line[c]
            }
          }
          words.push({ word: currentWord, x: Math.floor(Math.random() * canvas.width), y: Math.floor(Math.random() * canvas.height) })
        }
        drawCanvas()
      }

    }
    xhttp.open("POST", "userText") //API .open(METHOD, URL)
    xhttp.send(userRequestJSON) //API .send(BODY)
  }
}

function handleSubmitWithFetchButton() {

  let userText = document.getElementById('userTextField').value
  if (userText && userText != '') {

    let textDiv = document.getElementById("text-area")
    textDiv.innerHTML = textDiv.innerHTML + `<p> ${userText}</p>`

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
        console.log('Success:', data)

        console.log("data: " + data.text)
        console.log("typeof: " + typeof data.text)
        //we are expecting the response text to be a JSON string
        if (data.text.includes("NOT FOUND")) {
          movingString.word = data.text
        } else {
          movingString.word = 'FOUND'
        }

        words = [] //clear drag-able words array;
        if (data.songLines) {
          song.songLines = data.songLines
        }else{
          song.songLines = []
        }

        for (let i = 0; i < song.songLines.length; i++) {
          let line = song.songLines[i]
          let currentWord = ""
          for (c in line) {
            if (line[c] == ' ') {
              words.push({ word: currentWord, x: Math.floor(Math.random() * canvas.width), y: Math.floor(Math.random() * canvas.height) })
              currentWord = ""
            } else {
              currentWord += line[c]
            }
          }
          words.push({ word: currentWord, x: Math.floor(Math.random() * canvas.width), y: Math.floor(Math.random() * canvas.height) })
        }
        drawCanvas()

    })
    .catch((error) => {
        console.error('Error:', error)
    })








  }
}
