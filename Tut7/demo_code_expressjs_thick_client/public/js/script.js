function getWeather() {

    let cityName = document.getElementById('city').value
    if(cityName === '') {
        return alert('Please enter a city')
    }

    let cityDiv = document.getElementById('cityweather')
    cityDiv.innerHTML = ''

    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
 			cityDiv.innerHTML = cityDiv.innerHTML + `
			<h1>Weather for ${cityName} </h1>
			<ul>
			<li>Location: LON:${response.coord.lon}, LAT:${response.coord.lat}</li>
			<li>Main: ${response.weather[0].main}</li>
			<li>Desc: ${response.weather[0].description}</li>
			</ul>
      <p>${xhr.responseText}</p>
			`
        }
    }
    xhr.open('GET', `/weather?city=${cityName}`, true)
    xhr.send()
}



const ENTER=13

function handleKeyUp(event) {
event.preventDefault()
   if (event.keyCode === ENTER) {
      document.getElementById("submit_button").click()
  }
}


document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('submit_button').addEventListener('click', getWeather)

  //add key handler for the document as a whole, not separate elements.
  document.addEventListener('keyup', handleKeyUp)

})
