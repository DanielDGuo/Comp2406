/*
These functions handle parsing the chord-pro text format
*/

function parseChordProFormat(chordProLinesArray, transposedByNSemitones) {
  //constants for chord transitions
  const chordLetters = ["A", "B", "C", "D", "E", "F", "G"]
  const chordTransV1 = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]
  const chordTransV2 = ["A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"]


  let textDiv = document.getElementById("text-area")
  textDiv.innerHTML = '' //clear the html

  //loops through each line of the given text file
  for (let i = 0; i < chordProLinesArray.length; i++) {

    let line = chordProLinesArray[i]
    //text with only chords
    let chords = ""
    //text with only lyrics
    let lyrics = ""

    //the current chord being transposed
    let currentChord = ""
    //the transposed chord. If there are multiple chords, holds one at a time
    let transposedChordPortion = ""
    //the fully transposed chord
    let fullChord = ""

    //signals if the next character is part of a chord
    let isChord = false
    //signals how out of sync the chords and lyrics are
    let chordLength = 1
    //signals if the current character is part of a larger chord, i.e C in C#
    let skipNext = false

    //loops through each character in a line
    for (c in line) {
      //colours a chord appropriately when one is detected
      if (line[c] == '[') {
        if (transposedByNSemitones % 12 == 0) {
          chords += '<span class="chord">';
        } else {
          chords += '<span class="chordTransposed">';
        }
        isChord = true;
      } else if (line[c] == ']') {//signals the end of a chord, transposing the currentChord into fullChord then adding it to chords
        fullChord = ""
        skipNext = false

        for (var c = 0; c < currentChord.length; c++) {
          transposedChordPortion = ""
          if (skipNext) {
            skipNext = false
            continue
          }
          //if it finds a chord letter
          if (chordLetters.includes(currentChord[c])) {
            transposedChordPortion += currentChord[c]
            //check if it is part of a 2 character chord
            if (currentChord[c + 1] == '#' || currentChord[c + 1] == 'b') {
              transposedChordPortion += currentChord[c + 1]
              skipNext = true
            }
            //transposes the chord portion
            if (chordTransV1.indexOf(transposedChordPortion) >= 0) {
              transposedChordPortion = chordTransV1[(((chordTransV1.indexOf(transposedChordPortion) + transposedByNSemitones) % 12) + 12) % 12]
            } else {
              transposedChordPortion = chordTransV2[(((chordTransV2.indexOf(transposedChordPortion) + transposedByNSemitones) % 12) + 12) % 12]
            }
            //adds the portion to fullChord
            fullChord += transposedChordPortion
          } else {
            //if its not a chord, then it must be something that seperates a chord or a modifier
            fullChord += currentChord[c]
          }
        }
        //adds fullChord to the chords line
        chords += fullChord
        //ends the coloration
        chords += '</span>'
        //keeps track of sync
        chordLength = fullChord.length
        isChord = false;
        currentChord = ""
      } else {
        if (isChord) {
          //stores chords in currentChord to transpose later
          currentChord += line[c];
        } else {
          //if it's not a chord add to the lyrics, and add a space to the chords if necessary
          lyrics += line[c];
          if (chordLength > 0) {
            chordLength--;
          } else {
            chords += " ";
          }
        }
      }
    }
    //add everything to the html
    textDiv.innerHTML = textDiv.innerHTML + `<pre> ${chords + "\n" + lyrics}</pre>`
  }
}

