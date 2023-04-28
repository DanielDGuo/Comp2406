/*
(c) 2022 Louis. D. Nel and Daniel Guo

NOTE: You need to install the npm modules by executing >npm install
before running this server

To test:
http://localhost:3000
or
http://localhost:3000/songs?title=Body+And+Soul
to just set JSON response. (Note it is helpful to add a JSON formatter extension, like JSON Formatter, to your Chrome browser for viewing just JSON data.)
*/
const express = require('express') //express framework
const http = require('http')
const PORT = process.env.PORT || 3000 //allow environment variable to possible set PORT

const app = express()



//Middleware
app.use(express.static(__dirname + '/public')) //static server

//Routes
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

app.get('/songs', (request, response) => {
  console.log(request.query.title)
  let titleWithPlusSigns = request.query.title
  if(!titleWithPlusSigns) {
    //send json response to client using response.json() feature
    //of express
    response.json({message: 'Please enter a song name'})
    return
  }

  //replaces the whitespace with +
  titleWithPlusSigns = titleWithPlusSigns.replace(/\s+/g, "+");


  const options = {
    "method": "GET",
    "hostname": "itunes.apple.com",
    "port": null,
    "path": `/search?term=${titleWithPlusSigns}&entity=musicTrack&limit=3`,
    "headers": {
      "useQueryString": true
    }
  }
  //create the actual http request and set up
  //its handlers
  http.request(options, function(apiResponse) {
    let songData = ''
    apiResponse.on('data', function(chunk) {
      songData += chunk
    })
    apiResponse.on('end', function() {
      response.contentType('application/json').json(JSON.parse(songData))
    })
  }).end() //important to end the request
           //to actually send the message
})

//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
    console.log(`Server listening on port: ${PORT}`)
    console.log(`To Test:`)
    console.log(`http://localhost:3000/songs?title=Body+And+Soul`)
    console.log(`http://localhost:3000`)
  }
})
