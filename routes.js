const fs = require('fs');
const requestHandler = (req,res) =>{
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
        return req.on('end', () => {
          const parsedBody = Buffer.concat(body).toString(); ////create a new Buffer and add all chunks in body, in it   
          console.log(parsedBody); 
          const message = parsedBody.split('=')[1]; // index[1] is the second element in resulting array which is the value(message)/ right element to the = sign
          fs.writeFile('message.txt', message,(err)=>{
     // err: error object , returns null if no error occured, else returns an error handling response
      // res.writeHead(302,{}) //302: redirection
      res.statusCode = 302;
      res.setHeader('Location', '/');
      return res.end();
        }); // after parsing incoming reques
      });
    }
      res.setHeader('Content-Type', 'text/html');
      res.write('<html>');
      res.write('<head><title>My First Page</title><head>');
      res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
      res.write('</html>');
      res.end();
};
//export method 1
// register function requestHandler
//module.exports = requestHandler; //global object module exposed by node,  with export property
//export method 2 , exporting many things
/*module.exports = {
    handler: requestHandler,
    someText: 'Some hard coded text'
};*/
//module export syntax 3
module.exports.handler = requestHandler;
module.exports.someText = 'Some hard coded text';