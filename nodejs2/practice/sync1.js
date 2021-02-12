new Promise((resolve, reject) => {
    console.log('Hello Promise');
    resolve();
}).then(() => {
    console.log('Then!');
}).catch(() => {
    console.log('Error!');
})