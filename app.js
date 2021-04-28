const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    //console.log(req.url, req.method, req.headers);
//proces.exit(); or ctrl +c
  const url = req.url;
  const method = req.method;
  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>Enter Message</title><head>');
    res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
    //form takes request and adds all input data into request body as key-value pairs, key(name="message") = value"message user enetred"
    res.write('</html>');
    return res.end();
  }
  if (url === '/message' && method === 'POST') {
    const body = [];
    //getting request data
    req.on('data', (chunk) => {
      console.log(chunk);
      body.push(chunk);
    }); // event listener
    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString(); ////create a new Buffer and add all chunks in body, in it   
      //console.log(parsedBody); 
      const message = parsedBody.split('=')[1]; // index[1] is the second element in resulting array which is the value(message)/ right element to the = sign
      fs.writeFileSync('message.txt', message); // Sync: synchronous, blocks code execution of next line until file is created
    }); // after parsing incoming reques

    // res.writeHead(302,{}) //302: redirection
    res.statusCode = 302;
    res.setHeader('Location', '/');
    return res.end();
  }
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My First Page</title><head>');
  res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
  res.write('</html>');
  res.end();
});

server.listen(3000);
