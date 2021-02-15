
function main(
    bucketName,
    filename,
    destination
  ) {
    // [START storage_upload_file]
    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
    // const bucketName = 'Name of a bucket, e.g. my-bucket';
    // const filename = 'Local file to upload, e.g. ./local/path/to/file.txt';
    // const destination = 'Destination object name, e.g. file.txt';
  
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
  
main('audio-vearch', '/nodejs2/files/youtubedl/aGa7FozbbNV.wav', 'aGa7FozbbNV.wav');