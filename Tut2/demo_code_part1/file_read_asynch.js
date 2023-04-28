
/*
Example of ASYNCHRONOUS file read.
Function readFile does not block (wait) for the file to be read.

Instead its argument function(err,data) will be called once the file has been read.
function(err,data) is the "call back" function that will be called when readFile's task is done.

Notice "DONE" gets written to the console before the file contents. Make
sure you understand why that is.
*/


const fs = require('fs')

let chords = "";
let lyrics = "";
let isChord = false;
let chordLength = 0;


fs.readFile('songs/sister_golden_hair.txt', function (err, data) {
  if (err) throw err
  for (let c of data.toString()) {
    if (c == '[') {
      isChord = true;
    } else if (c == ']') {
      isChord = false;
    } else if (c == '\n') {
      console.log(chords);
      console.log(lyrics);
      chords = "";
      lyrics = "";

    } else {
      if (isChord) {
        chords += c;
        chordLength++;
      } else {
        lyrics += c;
        if (chordLength > 0) {
          chordLength--;
        } else {
          chords += " ";
        }
      }
    }
  }
})

console.log("DONE")
