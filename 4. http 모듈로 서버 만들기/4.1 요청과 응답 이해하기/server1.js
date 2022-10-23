const http = require('http');

http.createServer((req, res) => {
   // 어떻게 응답할지 작성
  res.writeHead(200, { 'Content-Type' : 'text/html; charset=utf-8'});
  res.write('<h1>Hi</h1>');
  res.end('<h1>Bye</h1>');   
})
  .listen(8080, () => {
    console.log('8080 포트에서 서버 대기중');
  })