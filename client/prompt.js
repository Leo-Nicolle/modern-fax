// const keypress = require('keypress');
  const readline = require('readline');

let message = "";
function readUserInput(sendMessage){ 

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  sendMessage(input);
});

/* 
// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);
 
// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
    if(!key)return;
    if(key.name =='f5' && message.length > 0){
      sendMessage(message);
      message =  "";
      return;
    }
    if(key.name=="backspace"){
      message =  message.slice(0,message.length-1);
      return;
    }
    if(key.sequence.length > 1)return;
    message+=key.sequence;
});
 
process.stdin.setRawMode(true);
process.stdin.resume();
*/
}

function stopReadUserInput(){
   // process.stdin.pause();
}

module.exports = {
  readUserInput,
};