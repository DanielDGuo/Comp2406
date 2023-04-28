/*
Javascript example using an html <canvas> as the main
app client area.
The application illustrates:
-handling mouse dragging and release
to drag a strings around on the html canvas
-Keyboard arrow keys are used to move a moving box around

Here we are doing all the work with javascript.
(none of the words are HTML, or DOM, elements.
The only DOM element is just the canvas on which
where are drawing and a text field and button where the
user can type data

Mouse event handlers are being added and removed.

Keyboard keyDown handler is being used to move a "moving box" around
Keyboard keyUP handler is used to trigger communication with the
server via POST message sending JSON data

*/

//DATA MODELS
//Use javascript array of objects to represent words and their locations
let words = []
const TOLERANCE = 20;

const canvas = document.getElementById('canvas1') //our drawing canvas

function getWordAtLocation(aCanvasX, aCanvasY) {
  for (let i = 0; i < words.length; i++) {
    if (Math.abs(words[i].x - aCanvasX) < words[i].stringWidth && words[i].x - aCanvasX < 0
      && Math.abs(words[i].y - aCanvasY) < 20) {
      return words[i]
    }
  }
  return null
}


function drawCanvas() {
  /*
  Call this function whenever the canvas needs to be redrawn.
  */

  const context = canvas.getContext('2d')

  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height) //erase canvas

  context.font = '20pt Arial'
  context.fillStyle = 'cornflowerblue'
  context.strokeStyle = 'blue'

  for (let i = 0; i < words.length; i++) {

    let data = words[i]
    context.fillText(data.word, data.x, data.y)
    context.strokeText(data.word, data.x, data.y)
    data.stringWidth = context.measureText(data.word).width

  }

  context.stroke()
}

function randomizeWordLocs() {
  //tried to add some tolarances to the word "spawn" location. Didn't seem like it worked
  for (let i = 0; i < words.length; i++) {
    words[i].x = 2 * TOLERANCE + Math.floor(Math.random() * (canvas.width - 4 * TOLERANCE));
    words[i].y = 2 * TOLERANCE + Math.floor(Math.random() * (canvas.height - 4 * TOLERANCE));
  }
}