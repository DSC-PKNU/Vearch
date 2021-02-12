const http  = require('http');
const qs = require('querystring');
const youtubedl = require('youtube-dl');
const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
const gstt = require('./googlestt.js');


const app = http.createServer((request, response)=>{

    if(request.url===`/link`){
        var body='';
        request.on('data', (data)=>{
            body+=data;
        });
        request.on('end', ()=>{
            var post = qs.parse(body);
            var link = post.link;
            
            var filename = link.slice(-11);
            var output_path = `./files/youtubedl/${filename}.m4a`;
            

            const audio = youtubedl(link, ['-f', 'bestaudio', '-x', '--audio-format', 'm4a'], {});

            audio.on('info', function(info){
                console.log('Download started');
                console.log('filename: '+info._filename);
                console.log('size: '+info.size);
            });

            audio.pipe(fs.createWriteStream(output_path));

           
            setTimeout(()=>{
                ffmpeg(`./files/youtubedl/${filename}.m4a`)
                .toFormat('wav')
                .audioChannels(1)
                .on('error', (err) => {
                    console.log('An error occurred: ' + err.message);
                })
                .on('progress', (progress) => {
                    // console.log(JSON.stringify(progress));
                    console.log('Processing: ' + progress.targetSize + ' KB converted');
                })
                .on('end', () => {
                    console.log('Processing finished !');
                })
                .save(`./files/youtubedl/${filename}.wav`);//path where you want to save your file
            }, 5000);

            setTimeout(()=>{
                gstt.stt(`./files/youtubedl/${filename}.wav`, 'LINEAR16', 44100, 'ko-KR')
                response.writeHead(200);
                response.end(`<h1>success</h1>${link}`); 
            }, 5000);
            

            // new Promise((r1, r2) => {
            //     audio = youtubedl(link, ['-f', 'bestaudio', '-x', '--audio-format', 'm4a'], {});
            //     r1();
            // }).then(() => {
            //     audio.on('info', function(info){
            //         console.log('Download started');
            //         console.log('filename: '+info._filename);
            //         console.log('size: '+info.size);
            //     });
            // }).then(() => {
            //     audio.pipe(fs.createWriteStream(output_path));
            // }).then(() => {
            //     response.writeHead(200);
            //     response.end(`<h1>success</h1>${link}`); 
            // })
            

            
            // new Promise((r1, r2) => {
            //     const audio = youtubedl(link, ['-f', 'bestaudio', '-x', '--audio-format', 'm4a'], {});
                
            //     audio.on('info', function(info){
            //         console.log('Download started');
            //         console.log('filename: '+info._filename);
            //         console.log('size: '+info.size);
            //     });

            //     audio.pipe(fs.createWriteStream(output_path));

            //     r1();
            // }).then(() => {
            //     response.writeHead(200);
            //     response.end(`<h1>success</h1>${link}`); 
            // })
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