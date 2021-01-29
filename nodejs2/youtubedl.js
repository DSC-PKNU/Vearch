// audio download using youtube-dl

// export function youtubedl(url){
//     const youtubedl = require('youtube-dl');

//     // var url =  'https://www.youtube.com/watch?v=bxWoi_txmNw';
//     var filename = url.slice(-11);
//     var output_path = `./files/youtubedl/${filename}.m4a`;
//     youtubedl.exec(url, ['-f', 'bestaudio', '-o', output_path, '-x', '--audio-format', 'm4a'], {}, function(err, output) {
//         if (err) throw err;
//         console.log(output.join('\n'));
//     });
// }

// youtubedl('https://www.youtube.com/watch?v=ykfhcNRx_UM');

module.exports = {
    ytdl: async function youtubedl(url){
        const youtubedl = require('youtube-dl');
    
        // var url =  'https://www.youtube.com/watch?v=bxWoi_txmNw';
        var filename = url.slice(-11);
        var output_path = `./files/youtubedl/${filename}.m4a`;
        youtubedl.exec(url, ['-f', 'bestaudio', '-o', output_path, '-x', '--audio-format', 'm4a'], {}, function(err, output) {
            if (err) throw err;
            console.log(output.join('\n'));
        });
        
    }
}