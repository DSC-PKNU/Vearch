const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const filename = 'wJ_JfMeHsvU'
let audio = `../files/youtubedl/${filename}.m4a`;

ffmpeg(audio)
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
.save(`../files/youtubedl/${filename}.wav`);//path where you want to save your file