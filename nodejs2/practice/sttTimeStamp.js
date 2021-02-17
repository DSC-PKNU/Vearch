var transcript = '';

async function asyncRecognizeGCSWords(
    gcsUri,
    encoding,
    sampleRateHertz,
    languageCode
  ) {
    // [START speech_transcribe_async_word_time_offsets_gcs]
    // Imports the Google Cloud client library
    const speech = require('@google-cloud/speech');
  
    // Creates a client
    const client = new speech.SpeechClient();
  
    const config = {
      enableWordTimeOffsets: true,
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
    response.results.forEach(result => {

        console.log(`Transcription: ${result.alternatives[0].transcript}`);
        transcript += `${result.alternatives[0].transcript}` + '\n';

        result.alternatives[0].words.forEach(wordInfo => {
            // NOTE: If you have a time offset exceeding 2^32 seconds, use the
            // wordInfo.{x}Time.seconds.high to calculate seconds.
            const startSecs =
            `${wordInfo.startTime.seconds}` +
            '.' +
            wordInfo.startTime.nanos / 100000000;
            const endSecs =
            `${wordInfo.endTime.seconds}` +
            '.' +
            wordInfo.endTime.nanos / 100000000;
            console.log(`Word: ${wordInfo.word}`);
            console.log(`\t ${startSecs} secs - ${endSecs} secs`);
        });

    });
    // [END speech_transcribe_async_word_time_offsets_gcs]
    console.log(`AAAAA => ${transcript}`);
}

const gcsUri = 'gs://audio_vearch/IYeZT5tKs9w.wav';
asyncRecognizeGCSWords(gcsUri, 'LINEAR16', 16000, 'ko-KR');