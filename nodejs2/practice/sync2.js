var async = require('async'); 

async.waterfall([ 
    function(callback) { 
        console.log(1); 
        callback(null); 
    }, 
    function(callback) {
        console.log(2);
        callback(null); 
    }, 
    function(callback) { 
        console.log(3); 
        callback(null); 
    } 
], function(err) { 
    if (err) { 
        console.log('error:', err); 
    } 
});

