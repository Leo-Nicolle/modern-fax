const io = require('socket.io-client');
const url = "http://"+(process.argv[3] === "localhost"
    ? process.argv[3]: "51.75.28.38")+ ":5000";

const printer = require("./printer");
const prompt = require("./prompt");

const username = "Bianca";

function getDate () {
    const options = { 
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: "numeric",
      minute: "numeric"
    };
    
    const date = new Date();
    return date.toLocaleDateString('en-EN', options);
}



function init(){
  const socket = io(url);
  console.log("username: ",username, " url: ", url);

  socket.on('message', (data) => {
    console.log("message received", data);

    if(process.argv[3] !=="debug"){
      printer.writeMessage(data).then(() => printer.write("\n"));
    }

    socket.on("connect_error", (error) => {
      console.log("connectError", error)
    });
    socket.on("connect_timeout", (error) => {
      console.log("connectTimeout", error)
    });


  });

  function sendMessage(text = "\n"){
    const message = {
      date: getDate(),
      message: text,
    }
    const string = JSON.stringify(message);
    printer.writeMessage(string).then(() => printer.write("\n"));
    socket.emit('message', JSON.stringify(message));

  }

  socket.on('connect', (data) => {
    console.log("connected to server");
    socket.emit('user-connect', username);
    prompt.readUserInput(sendMessage);
  });

  socket.on('disconnect', (data) => {
    console.log("unconnected from server");
    printer.write("connection lost: restart", {spaced: true});
  });
}

module.exports = {
  init,
};
