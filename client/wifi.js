const readline = require('readline');
const printer = require('./printer');
const {exec} = require('child-process-promise');

function init(){
    return tryToConnect();
}

function tryToConnect(){
  return amIConnected()
  .then(connected => {
    if(connected) return true;
    else return showConnections();
  })
}

function askForUser(question){
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve, reject) => {
    printer.write(question, {spaced: true});
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function showConnections(){
  let networkNames;
  let networkName;

  exec('iw dev wlan0 scan | grep SSID')
  .then(({stdout, stderr}) => {
      networkNames = stdout.split("\n").map(data => {
        const match = data.match(/(SSID: )(.*)/)
        return match && match.length >1 && match[2];
      }).filter(elt => elt)
  
     const text = networkNames
      .slice(0,5)
      .reduce((text, name, i) => `${text}${i}: ${name}\n`, "");
    printer.write(text, {spaced: true});
    return askForUser("Enter the number of the network you want to connect")
  })
  .then(number => {
    networkName = networkNames[number];
    if(!networkName){
        const text = "Network Number not in range";
        printer.write(text, {spaced: true});
        throw new Error(text)
        return showConnections();
    }
    return askForUser(`Try to connect to ${networkName}. Password ? `);
  })
  .then(password => updateSupplicantAndDHCP(ssid, password))
  .then(() => amIConnected())
  .then(connected => {
    if(connected){
      return true;
    }
    const text = "Not connected, wrong password ?";
    printer.write(text, {spaced: true});
    throw new Error(text);
  })
  .catch(error => {
      const text = "Error on connection";
      printer.write(text, {spaced: true});
      console.log(text);
      return showConnections();
  });
}

function updateSupplicantAndDHCP(ssid, password){
  return  
  exec(`wpa_passphrase ${ssid} ${password} > /etc/wpa_supplicant/wpa_supplicant.conf`)
  .then(({stdout, stderr}) => 
    exec(`iwlist scan`)
  )
  .then(({stdout, stderr}) => 
    exec(`dhclient -r`)
  )
  .then(({stdout, stderr}) => 
    exec(`dhclient wlan0`)
  );
}

function amIConnected(){
 return  exec(`iwconfig 2>&1 | grep ESSID`)
  .then(({stdout, stderr}) =>{ 
    const match = stdout.match(/(.*ESSID:)(.*)/);
    return match && match.length > 1 && match[2].length > 2;
  });
}

module.exports = {
  init
};
