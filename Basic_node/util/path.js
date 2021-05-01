const path = require('path');
module.exports = path.dirname(process.mainModule.filename); // process.mainModule.fileName: gives us the path of the file that's running our app
