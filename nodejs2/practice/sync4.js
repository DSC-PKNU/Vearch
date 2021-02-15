const downloader = require('youtube-dl/lib/downloader')
const youtubedl = require('youtube-dl');
const fs = require('fs');

downloader('path/to-binary')
.then((message) => {
    console.log(message);

    // var link = 'https://www.youtube.com/watch?v=wJ_JfMeHsvU';
    
    // var filename = link.slice(-11);
    // var output_path = `./files/youtubedl/${filename}.m4a`;

    // const audio = youtubedl(link, ['-f', 'bestaudio', '-x', '--audio-format', 'm4a'], {});

    // audio.on('info', function(info){
    //     console.log('Download started');
    //     console.log('filename: '+info._filename);
    //     console.log('size: '+info.size);
    // });

    // audio.pipe(fs.createWriteStream(output_path));
}).catch((err) => {
    console.log("err", err);
    exit(1);
});