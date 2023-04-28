//connect to server and retain the socket
//connect to same host that served the document

//const socket = io('http://' + window.document.location.host)
const socket = io() //by default connects to same server that served the page

var clientName;

socket.on('serverSays', function (data) {

  let msgDiv = document.createElement('div')

  /*
  What is the distinction among the following options to set
  the content? That is, the difference among:
  .innerHTML, .innerText, .textContent
  */
  //msgDiv.innerHTML = message
  //msgDiv.innerText = message


  //server messages do not need any checking
  if(data.sender == "server"){
    msgDiv.innerHTML = `<p> <span> ${data.message}</span></p>`;
  }else if(data.ownMessage == true){
    msgDiv.innerHTML = `<p> <span class="ownMessage"> ${data.sender + ": " + data.message}</span></p>`;
  }else if(data.privateMessage == true){
    msgDiv.innerHTML = `<p> <span class="privateMessage"> ${data.sender + ": " + data.message}</span></p>`;
  }else{
    msgDiv.innerHTML = `<p> <span> ${data.sender + ": " + data.message}</span></p>`;
  }

  document.getElementById('messages').appendChild(msgDiv)
})

function sendMessage() {
  let message = document.getElementById('msgBox').value.trim()
  if (message === '') return //do nothing
  socket.emit('clientSays', message)
  document.getElementById('msgBox').value = ''
}

function connectUser() {
  let username = document.getElementById('idfier').value.trim();
  if (username === '') return; //do nothing
  socket.emit('clientNaming', username)
  document.getElementById('idfier').value = ''
}

function clear() {
  document.getElementById('messages').innerHTML = '';
}

function handleKeyDown(event) {
  const ENTER_KEY = 13 //keycode for enter key
  if (event.keyCode === ENTER_KEY) {
    sendMessage()
    return false //don't propogate event
  }
}

//Add event listeners
document.addEventListener('DOMContentLoaded', function () {
  //This function is called after the browser has loaded the web page

  //add listener to buttons
  document.getElementById('send_button').addEventListener('click', sendMessage)
  document.getElementById('connect_button').addEventListener('click', connectUser)
  document.getElementById('clear_button').addEventListener('click', clear)

  //add keyboard handler for the document as a whole, not separate elements.
  document.addEventListener('keydown', handleKeyDown)
  //document.addEventListener('keyup', handleKeyUp)
})
