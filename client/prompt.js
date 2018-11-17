const keypress = require('keypress');

let message = "";
function readUserInput(sendMessage){ 
 
// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);
 
// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
  console.log(key);
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

}

function stopReadUserInput(){
   process.stdin.pause();
}

module.exports = {
  readUserInput,
};