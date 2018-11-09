var rq = require('request');
var fs = require('fs');

module.exports = function(siteName, token) {

  // Check the site name and token are usable
  if(siteName.search(/^[a-z0-9]+$/i)){
    console.log("Your site name is invalid or not set, check your entry in .env");
    return;
  } else if(token.search(/^[a-z0-9]+$/i)){
    console.log("Your token is invalid or not set, check your entry in .env");
    return;
  } else {
    rq('https://' + siteName + '.fogbugz.com/api.xml', function (error, response, body) {
      if (error || response.statusCode !== 200) {
        console.log("An error occurred requesting the API version");
        return;
      } else {
        console.log("Using FogBugz API version: " + body);  
      }
    });
  }
  
  var url = 'https://' + siteName + '.fogbugz.com/f/api/0/jsonapi';
  
  // A teensy promise wrapper around json requests
  function request(json, filePaths) {
    json.token = token;
    
        var rpOptions = {
        url: url + json.cmd,
        formData: {
          request: JSON.stringify(json),
          File1: filePaths ? fs.createReadStream( filePaths.attachment1 ) : '',
          File2: filePaths ? fs.createReadStream( filePaths.attachment2 ) : ''
        }
    };
    
    return new Promise(function (resolve, reject) {
      rq.post({url:url, json:json}, function(error, response, body) {
        if (error) {
          reject(error);
        } else if (response.statusCode > 299) {
          reject(body.errors);
        } else {
          resolve(body.data);
        }
      });
    });
  }

  return new Proxy({},{
    get: function(_, value) {
      return function() {
        var json = arguments[0];
        var filePaths = arguments[1];
        json.cmd = value;
        return request(json, filePaths);
      };
    }
  });
};