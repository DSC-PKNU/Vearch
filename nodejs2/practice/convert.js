var ffmpeg = require('fluent-ffmpeg');

function convertFileFormat(file, destination, error, progressing, finish) {

ffmpeg(file)
    .on('error', (err) => {
        console.log('An error occurred: ' + err.message);
        if (error) {
            error(err.message);
        }
    })
    .on('progress', (progress) => {
        // console.log(JSON.stringify(progress));
        console.log('Processing: ' + progress.targetSize + ' KB converted');
        if (progressing) {
            progressing(progress.targetSize);
        }
    })
    .on('end', () => {
        console.log('converting format finished !');
        if (finish) {
            finish();
        }
    })
    .save(destination);

}
convertFileFormat('./files/test.m4a', './files/test.wav', (errorMessage) => {}, null, () => {console.log("success");});
// convertFileFormat('file.m4a', 'file.wav', function (errorMessage) {
//     }, null, function () {
//         console.log("success");
//     }
// );