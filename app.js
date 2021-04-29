const http = require('http');
const routes = require('./routes') // ./: cause routes is not a global module
const server = http.createServer(routes);
server.listen(3000);
