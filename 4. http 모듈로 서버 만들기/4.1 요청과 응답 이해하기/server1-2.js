const http = require('http');

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.write("<h1>Hi</h1>");
  res.end("<h1>Bye</h1>");
})
  .listen(8080, () => {
    console.log('8080에서 대기중')
  });

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.write("<h1>Hi</h1>");
  res.end("<h1>Bye</h1>");
})
.listen(8081, () => {
  console.log('8081에서 대기중')
});