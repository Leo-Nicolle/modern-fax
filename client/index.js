
const prompt = require("./prompt");
const wifi = require("./wifi");
const client = require("./client");
const printer = require("./printer");

// tryes to connect:
wifi.init()
.then((connected) => {
  const text = 'Connected';
  printer.write(text, {spaced: true});
  console.log(text);
  client.init();  
})
.catch(e => console.log(e));