const http  = require('http');
const fs = require('fs');
const url = require('url');
const formidable = require('formidable');
const qs = require('querystring');
const youtubedl = require('youtube-dl')


const app = http.createServer((request, response)=>{

    if(request.url===`/link`){
        var body='';
        request.on('data', (data)=>{
            body+=data;
        });
        request.on('end', ()=>{
            var post = qs.parse(body);
            var link = post.link;
            response.writeHead(200);
            response.end(`<h1>success</h1>${link}`); 
            
            var url = link;
            var filename = link.slice(-11);
            var output_path = `./files/${filename}.m4a`;
            youtubedl.exec(url, ['-f', 'bestaudio', '-o', output_path, '-x', '--audio-format', 'm4a'], {}, function(err, output) {
                if (err) throw err;
                console.log(output.join('\n'));
              });
        });
        
    } else { // 기본 페이지
        let mainScript = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="wresponse.writeHead(200);
        response.end(mainScript);   idth=device-width, initial-scale=1.0">
            <title>Youtube Download</title>
        </head>
        <body>
            <h1>File Upload & Convert</h1>
            <form action="/link" method="post">
                <input type="text" name="link"><br>
                <input type="submit" name="upload">
            </form>
        </body>
        </html>
        `;
        response.writeHead(200);
        response.end(mainScript); 
    }

});

app.listen(3001);