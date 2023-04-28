/*
These functions handle parsing the chord-pro text format
*/

//PROBLEM 4
function parseChordProFormat(chordProLinesArray) {
  //parse the song lines with embedded
  //chord pro chords and add them to DOM

  console.log('type of input: ' + typeof chordProLinesArray)

  //add the lines of text to html <p> elements
  let textDiv = document.getElementById("text-area")
  textDiv.innerHTML = '' //clear the html

  //PROBLEM 4/5
  for (let i = 0; i < chordProLinesArray.length; i++) {
    let line = chordProLinesArray[i]
    let line2 = ""
    for (c in line){
      if(line[c] == '['){line2 += '<span class="chord">'}
      line2 += line[c]
      if(line[c] == ']'){line2 += '</span>'}
    }
    console.log(line2)
    textDiv.innerHTML = textDiv.innerHTML + `<p> ${line2}</p>`
  }
}
