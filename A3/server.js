/*
(c) 2023 Louis D. Nel
Based on:
https://socket.io
see in particular:
https://socket.io/docs/
https://socket.io/get-started/chat/

Before you run this app first execute
>npm install
to install npm modules dependencies listed in package.json file
Then launch this server:
>node server.js

To test open several browsers to: http://localhost:3000/chatClient.html

*/
const server = require('http').createServer(handler)
const io = require('socket.io')(server) //wrap server app in socket io capability
const fs = require('fs') //file system to server static files
const url = require('url'); //to parse url strings
const PORT = process.argv[2] || process.env.PORT || 3000 //useful if you want to specify port through environment variable
//or command-line arguments

const ROOT_DIR = 'html' //dir to serve static files from

const clients = new Map();

const MIME_TYPES = {
  'css': 'text/css',
  'gif': 'image/gif',
  'htm': 'text/html',
  'html': 'text/html',
  'ico': 'image/x-icon',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'js': 'application/javascript',
  'json': 'application/json',
  'png': 'image/png',
  'svg': 'image/svg+xml',
  'txt': 'text/plain'
}

function get_mime(filename) {
  for (let ext in MIME_TYPES) {
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return MIME_TYPES[ext]
    }
  }
  return MIME_TYPES['txt']
}

server.listen(PORT) //start http server listening on PORT

function handler(request, response) {
  //handler for http server requests including static files
  let urlObj = url.parse(request.url, true, false)
  console.log('\n============================')
  console.log("PATHNAME: " + urlObj.pathname)
  console.log("REQUEST: " + ROOT_DIR + urlObj.pathname)
  console.log("METHOD: " + request.method)

  let filePath = ROOT_DIR + urlObj.pathname
  if (urlObj.pathname === '/') filePath = ROOT_DIR + '/index.html'

  fs.readFile(filePath, function (err, data) {
    if (err) {
      //report error to console
      console.log('ERROR: ' + JSON.stringify(err))
      //respond with not found 404 to client
      response.writeHead(404);
      response.end(JSON.stringify(err))
      return
    }
    response.writeHead(200, {
      'Content-Type': get_mime(filePath)
    })
    response.end(data)
  })

}

//Socket Server
io.on('connection', function (socket) {
  console.log('client connected')

  //stores the id and the id username
  clients.set(socket.id, null);
  //console.dir(socket)

  socket.emit('serverSays', { sender: "server", message: 'You are connected to CHAT SERVER' })

  socket.clientName = null;

  socket.on('clientSays', function (data) {
    console.log("User \"" + socket.clientName + "\" sent: " + data)
    //to broadcast message to everyone including sender if sender name is not null:
    if (socket.clientName != null) {
      //test for private messages
      var msgRecipients = [];
      var message;
      if (data.includes(':')) {
        //get the strings seperated by ',' before the first colon
        msgRecipients = data.substring(0, data.indexOf(':')).split(',');
        //get the message
        message = data.substring(data.indexOf(':') + 1);
      }

      //trims everything in the array
      for (var i = 0; i < msgRecipients.length; i++) {
        msgRecipients[i] =  msgRecipients[i].trim();
      }

      for (const [key, value] of clients) {
        //check for named users
        if (value != null) {
          //if it is a private message
          if (msgRecipients.length > 0) {
            //if it attempts to send it back or if it is in the private message list
            //use modified data
            if (value == socket.clientName || msgRecipients.includes(value)) {
              io.to(key).emit("serverSays", { sender: socket.clientName, message: message, ownMessage: false, privateMessage: true });
            }
          } else {
            //if the server is sending the message back to the client who sent it, flag it as its own message
            //use raw message data
            if (value == socket.clientName) {
              io.to(key).emit("serverSays", { sender: socket.clientName, message: data, ownMessage: true, privateMessage: false });
            } else {
              io.to(key).emit("serverSays", { sender: socket.clientName, message: data, ownMessage: false, privateMessage: false });
            }
          }
        }
      }
    } else {
      socket.emit('serverSays', { sender: "server", message: 'Username not initialized.' });
    }
  })

  socket.on('clientNaming', function (data) {
    console.log('client new name: ' + data);
    console.log('RECEIVED: ' + data);

    //checks conditions for naming; alphanumeric and if it begins with a letter
    if (/^[a-zA-Z0-9]+$/.test(data) && /^[a-zA-Z]/.test(data)) {
      socket.emit('serverSays', { sender: "server", message: 'Your username is now ' + data });
      //updates the name in the map and client
      clients.set(socket.id, data);
      socket.clientName = data;
    } else {
      socket.emit('serverSays', { sender: "server", message: 'Username ' + data + ' not valid' });
    }
    console.log(clients)
  })

  socket.on('disconnect', function (data) {
    //event emitted when a client disconnects
    console.log('client disconnected')
  })
})

console.log(`Server Running at port ${PORT}  CNTL-C to quit`)
console.log(`To Test:`)
console.log(`Open several browsers to: http://localhost:${PORT}/chatClient.html`)
