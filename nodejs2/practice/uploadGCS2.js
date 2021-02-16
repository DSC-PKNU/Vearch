const {Storage} = require('@google-cloud/storage');

const storage = new Storage({
  projectId: 'dotted-embassy-302111',
  keyFilename: '../nodejs2/5babea53e123.json'
});

// const bucket = storage.bucket('audio-vearch');

// bucket.upload('../nodejs2/files/youtubedl/aGa7FozbbNV.wav', (err, file) => {
//   if (err) throw new Error(err);
// })

const bucketName = 'audio-vearch';

async function createBucket() {
  // Creates the new bucket
  await storage.createBucket(bucketName);
  console.log(`Bucket ${bucketName} created.`);
}

createBucket().catch(console.error);