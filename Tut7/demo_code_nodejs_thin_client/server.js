/*
(c) 2022 Louis Nel

Interacting with external API's

Simple example of node.js app serving contents based
on an available internet API service: api.openweathermap.org

***IMPORTANT NOTE***
Recently openweather requires that you provide an APPID
with your HTTP requests. You can get one by creating a
free account at: http://openweathermap.org/appid
and signing up for an API key

IMPORTANT: for this code to work you need to replace the
'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' string in the code with a valid
openweather.org API key

To Test: Use browser to view http://localhost:3000/
*/

const http = require('http')
const url = require('url')
const qstring = require('querystring')

const PORT = process.env.PORT || 3000
//Please register for your own key replace this with your own.
const API_KEY = 'a719fd6e9931b845782ef6ca09ea6df2'

function sendResponse(weatherData, res, city) {
  var page = '<html><head><title>API Example</title></head>' +
    '<body>' +
    '<form method="post">' +
    'City: <input name="city"><br>' +
    '<input type="submit" value="Get Weather">' +
    '</form>'
  if (weatherData) {
    page += '<h1>Weather Info for ' + city + '</h1><p>' + weatherData + '</p>'
  }
  page += '</body></html>'
  res.end(page)
}


function getWeather(city, res) {

  //Make an HTTP GET request to the openweathermap API

  //options object needed for http request to API server
  let options = {
    host: 'api.openweathermap.org',
    path: '/data/2.5/weather?q=' + city +
      '&appid=' + API_KEY
  }
  //create the actual http request and set up
  //its handlers
  http.request(options, function(apiResponse) {
    let weatherData = ''
    apiResponse.on('data', function(chunk) {
      weatherData += chunk
    })
    apiResponse.on('end', function() {
      sendResponse(weatherData, res, city)
    })
  }).end() //important to end the request
           //to actually send the message
}

http.createServer(function(req, res) {
  let requestURL = req.url
  let query = url.parse(requestURL).query //GET method query parameters if any
  let method = req.method
  console.log(`${method}: ${requestURL}`)
  console.log(`query: ${query}`) //GET method query parameters if any

  if (req.method == "POST") {
    let reqData = ''
    req.on('data', function(chunk) {
      reqData += chunk
    })
    req.on('end', function() {
      console.log(reqData);
      var queryParams = qstring.parse(reqData)
      console.log(queryParams)
      getWeather(queryParams.city, res)
    })
  }else if (req.method == "GET" && query != null) {
    let reqData = ''
    req.on('data', function(chunk) {
      reqData += chunk
    })
    req.on('end', function() {
      console.log(query);
      var queryParams = qstring.parse(query)
      console.log(queryParams)
      getWeather(queryParams.city, res)
    })
  } else {
    sendResponse(null, res)
  }
}).listen(PORT, (error) => {
  if (error)
    return console.log(error)
  console.log(`Server is listening on PORT ${PORT} CNTL-C to quit`)
  console.log(`To Test:`)
  console.log(`http://localhost:3000/`)
})
