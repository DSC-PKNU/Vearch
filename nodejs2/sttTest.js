
var fs = require('fs');
var openApiURL = 'http://aiopen.etri.re.kr:8000/WiseASR/Recognition';
var access_key = '06269558-5d5e-4d67-b453-fdf42fc28626';
var languageCode = 'korean';
var audioFilePath = 'files/test.wav';
var audioData;
 
var audioData = fs.readFileSync(audioFilePath);
 
var requestJson = {
    'access_key': access_key,
    'argument': {
        'language_code': languageCode,
        'audio': audioData.toString('base64')
    }
};
 
var request = require('request');
var options = {
    url: openApiURL,
    body: JSON.stringify(requestJson),
    headers: {'Content-Type':'application/json; charset=UTF-8'}
};
request.post(options, function (error, response, body) {
    console.log('responseCode = ' + response.statusCode);
    console.log('responseBody = ' + body);
});