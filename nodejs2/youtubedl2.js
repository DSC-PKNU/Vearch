const fs = require('fs');
const youtubedl = require('youtube-dl');

var url =  'https://www.youtube.com/watch?v=bxWoi_txmNw';
var filename = url.slice(-11);
var output_path = `./files/youtubedl/${filename}.m4a`;

const audio = youtubedl(url, ['-f', 'bestaudio', '-x', '--audio-format', 'm4a'], {});

audio.on('info', function(info){
    console.log('Download started');
    console.log('filename: '+info._filename);
    console.log('size: '+info.size);
});

audio.pipe(fs.createWriteStream(output_path));
