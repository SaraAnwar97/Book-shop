const http = require('http');
const express = require('express');
const app = express(); // initialize a new object where express.js will store and manager our app
const server = http.createServer(app); // app is a valid requestHandler
server.listen(3000);