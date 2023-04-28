function getSongs() {

  let songName = document.getElementById('song').value
  if (songName === '') {
    return alert('Please enter a song name')
  }

  let songDiv = document.getElementById('songData')
  songDiv.innerHTML = ''

  let xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let response = JSON.parse(xhr.responseText)

      songDiv.innerHTML += `<h1>Results for ${songName} </h1>`

      //TODO
      // for (let i = 0; i < response.resultCount; i++) {
      //   songDiv.innerHTML += `
			//     <ul>
			//     <li>${response.results[i]}</li>
			//     </ul>
			// `
      // }
      songDiv.innerHTML += `<p>${xhr.responseText}</p> </h1>`
    }
  }
  xhr.open('GET', `/songs?title=${songName}`, true)
  xhr.send()
}



const ENTER = 13

function handleKeyUp(event) {
  event.preventDefault()
  if (event.keyCode === ENTER) {
    document.getElementById("submit_button").click()
  }
}


document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('submit_button').addEventListener('click', getSongs)

  //add key handler for the document as a whole, not separate elements.
  document.addEventListener('keyup', handleKeyUp)

})
