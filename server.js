// server.js
// Already set up for express

var express = require('express');
var app = express();

app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/whoami", userInfo);

function userInfo (request, response) {
  
  let returnObj = {"ipaddress": null, "language": null, "software": null}
  
  returnObj.language = parseLang(request.header('accept-language'));
  returnObj.software = parseSoftware(request.header('user-agent'));
  returnObj.ipaddress = parseIp(request.ip);
  
  response.send(returnObj);
  
}

function parseLang(langString) {
  
  let lang = '';
  
  for (let i in langString) {
    if (langString[i] != ',') lang += langString[i];
    else return lang;
  }
  
}

function parseSoftware (softString) {
  
  let inside = false; //inside first set of parens
  let software  = '';
  for (let i in softString) {
    if (!inside) {
      if (softString[i] === "(") inside = true;
    } else {
      if (softString[i] != ")") {
        software += softString[i];
      } else {
        return software;
      }
    }
  }
  
}

function parseIp (ip) { 

  //example ip ::ffff:127.0.0.1
  
  let returnIp = '';
  let hitNum = false;
  
  for (let i in ip) {
    //if ip is a number
    if (!isNaN(ip[i])) hitNum = true;
    
    if (hitNum) returnIp += ip[i];
  }
  
  return returnIp;
}

// open port with a callback
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
