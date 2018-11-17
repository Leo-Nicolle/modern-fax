const fs = require("fs");
const path = "/dev/usb/lp0";


function _tryToWrite(text){
	return new Promise((resolve, reject) => {
		try{
		    fs.writeFile(path, text,"utf8", function(err) {
		        if (err) {
		        	console.log("did not manage to write");
		        	reject("did not managed to write" + err);
		        }
		        else {
		        	console.log("write successfull");
		        	resolve();
		        }
		    });			
		}catch(error){
		    reject(error);
		}
	});
}

function write(text, {nb = 0, spaced = false} = {}){

	const textToWrite = spaced 
		? `${text} \n \n \n`
		: text;
	if(nb > 2){
		throw new Error("10 atemps to wite not successfull")
	}

	return _tryToWrite(textToWrite)
	.then (()  => console.log("OK"+ text))	
	// .catch(error => {
	// 	return new Promise((resolve, reject) => {
 //       		console.log("timeout....");
	// 		setTimeout(() => resolve(), 1000)
	// 	}).then(() =>{ 
 //       		console.log("Retry");
	// 		return write(textToWrite, {nb: nb++})
	// 	});
	// });
}


function writeMessage(data){
	const {date, message} = JSON.parse(data);
	const dash = "\n ------------------------------\n";
	const lines = "\n \n \n ";
	const text = `${dash} ${date} ${dash} ${message} ${lines}`;

	return _tryToWrite(text)
	.catch(error => {
		return new Promise((resolve, reject) => {
       		console.log("timeout....");
			setTimeout(resolve(), 500)
		}).then(() =>{ 
       		console.log("Retry");
			 _tryToWrite(text);
		});
	});
}



module.exports = {
	write,
	writeMessage,
};