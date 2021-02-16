const http  = require('http');
const qs = require('querystring');
const youtubedl = require('youtube-dl');
const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
var transcript = '';

/**
 * 1분 이상의 음성파일
 * Flow
 * youtube-dl => ffmpeg => gc storage upload => gc speech api 
 */

/**
 * gc speech api
 */
async function asyncRecognizeGCS(
    gcsUri,
    encoding,
    sampleRateHertz,
    languageCode
    ) {
    // [START speech_transcribe_async_gcs]
    // Imports the Google Cloud client library
    const speech = require('@google-cloud/speech');
  
    // Creates a client
    const client = new speech.SpeechClient();
  
    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
    // const gcsUri = 'gs://my-bucket/audio.raw';
    // const encoding = 'Encoding of the audio file, e.g. LINEAR16';
    // const sampleRateHertz = 16000;
    // const languageCode = 'BCP-47 language code, e.g. en-US';
  
    const config = {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode,
    };
  
    const audio = {
      uri: gcsUri,
    };
  
    const request = {
      config: config,
      audio: audio,
    };
  
    // Detects speech in the audio file. This creates a recognition job that you
    // can wait for now, or get its result later.
    const [operation] = await client.longRunningRecognize(request);
    // Get a Promise representation of the final result of the job
    const [response] = await operation.promise();
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);

    transcript = transcription;
    // [END speech_transcribe_async_gcs]
}

/**
 * gcs upload
 */
function gcs_upload(
    bucketName,
    filename,
    destination
  ) {
    // [START storage_upload_file]
  
    // Imports the Google Cloud client library
    const {Storage} = require('@google-cloud/storage');
  
    // Creates a client
    const storage = new Storage();
  
    async function uploadFile() {
      // Uploads a local file to the bucket
      await storage.bucket(bucketName).upload(filename, {
        // By setting the option `destination`, you can change the name of the
        destination: destination,
        // object you are uploading to a bucket.
        metadata: {
          // Enable long-lived HTTP caching headers
          // Use only if the contents of the file will never change
          // (If the contents will change, use cacheControl: 'no-cache')
          cacheControl: 'public, max-age=31536000',
        },
      });
  
      console.log(`${filename} uploaded to ${bucketName}.`);
    }
  
    uploadFile().catch(console.error);
    // [END storage_upload_file]
}

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
            
            /**
             * youtube-dl 라이브러리 사용
             * 다운로드 하는 부분
             * 동기 처리 필요
             */

            const audio = youtubedl(link, ['-f', 'bestaudio', '-x', '--audio-format', 'm4a'], {});

            audio.on('info', function(info){
                console.log('Download started');
                console.log('filename: '+info._filename);
                console.log('size: '+info.size);
            });

            audio.pipe(fs.createWriteStream(output_path));

            /**
             * ffmpeg 라이브러리 사용
             * wav, mono, 16000 변환
             * 
             */
            setTimeout(()=>{
                ffmpeg(`./files/youtubedl/${filename}.m4a`)
                .toFormat('wav')
                .audioChannels(1)
                .audioFrequency(16000)
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
            }, 5*1000);

            /**
             * Google Cloud Storage upload
             */

            setTimeout(()=>{
                gcs_upload('audio_vearch', `./files/youtubedl/${filename}.wav`, `${filename}.wav`);
            }, 10*1000);

            /**
             * Google Speech API 
             */
            setTimeout(()=>{
                asyncRecognizeGCS(`gs://audio_vearch/${filename}.wav`, 'LINEAR16', 16000, 'ko-KR');
            }, 10*1000);

            /**
             * 화면 표시, 스크립트 표시
             * 위의 작업들이 끝나면 표시 되도록 동기처리 필요
             */
            setTimeout(()=>{
                linkScript = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="wresponse.writeHead(200);
                response.end(mainScript);   idth=device-width, initial-scale=1.0">
                    <title>Youtube loading</title>
                </head>
                <body>
                    <h1>success</h1>
                    ${transcript}
                </body>
                </html>
                `
                response.writeHead(200);
                response.end(linkScript); 
            }, 40*1000);
            

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