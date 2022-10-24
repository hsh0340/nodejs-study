# 6. 익스프레스 웹 서버 만들기
## 6.1 익스프레스 프로젝트 시작하기
npm init 명령어를 호출하여 package.json 생성한다.<br>
```
$ npm i express
$ npm i -D nodemon
```
![screenshot](/img/5.png)<br>
nodemon app을 하면 app.js를 nodemon으로 실행한다. 코드에 수정사항이 생기면 nodemon 모듈이 서버를 자동으로 재시작한다.
```
const express = require('express');
const app = express();
```
Express 모듈을 실행해 app 변수에 할당한다. 익스프레스 내부에 http 모듈이 내장되어 있어 서버의 역할을 할 수 있다.
```
app.set('port', process.env.PORT || 3000);
```
app.set('port', 포트)로 서버가 실행될 포트를 설정한다. process.env 객체에 PORT 속성이 있다면 그 값을 사용하고, 없다면 3000번 포트를 이용한다. app.set(키, 값)으로 데이터를 저장할 수 있다. 나중에 데이터를 app.get(키)로 가져올 수 있다.
```
app.get('/', (req, res) => {
  res.send('Hello, Express');
})
```
app.get(주소, 라우터)는 주소에 대한 GET 요청이 올 때 어떤 동작을 할지 적는 부분이다.<br>
- req : 요청에 관한 정보가 들어있는 객체
- res : 응답에 관한 정보가 들어있는 객체
express에서는 res.write나 res.end 대신 res.send를 사용한다.
```
const path = require('path');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
})
```
문자열 대신 HTML로 응답하고 싶다면 res.sendFile 메서드를 사용한다. 단, 파일의 경로를 path 모듈을 사용해서 지정해야한다.
## 6.2 자주 사용하는 미들웨어
> <strong>미들웨어</strong>란? <br> 요청 오브젝트(req), 응답 오브젝트(res), 그리고 애플리케이션의 요청-응답 주기 중 그 다음의 미들웨어 함수에 대한 액세스 권한을 갖는 함수<br>
-> 요청과 응답의 중간에 위치한 함수. 미들웨어는 요청과 응답을 조작하여 기능을 추가하기도 하고, 나쁜 요청을 걸러내기도 한다.

미들웨어는 app.use() 와 함께 사용한다. app.use(미들웨어) 형태로 사용한다.
```
app.use((req, res, next) => {
  console.log('모든 요청에 다 실행됩니다.');
});
```
 app.use에 매개변수가 req, res, next인 함수를 넣는다.<br>
 미들웨어는 위에서 아래로 실행되면서 요청과 응답 사이에 특별한 기능을 추가할 수 있다. 주소를 첫번 째 인수로 넣어주지 않는다면 미들웨어는 모든 요청에서 실행되고, 주소를 넣는다면 해당하는 요청에서만 실행된다.<br> 
 <br>
 (미들웨어가 실행되는 경우)
 | | |
|------|---|
|app.use(미들웨어)|모든 요청에서 미들웨어 실행|
|app.use('/abc', 미들웨어)|abc로 시작하는 요청에서 미들웨어 실행|
|app.post('/abc', 미들웨어)|abc로 시작하는 POST 요청에서 미들웨어 실행|
```
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});
```
에러처리 미들웨어는 매개변수가 err, req, res, next로 네 개 이다. 모든 매개변수를 사용하지 않더라도 매개변수가 반드시 네 개여야 한다.
- err 매개변수에는 에러에 관한 정보가 담겨있다. 
- res.status메서드로 HTTP 상태 코드를 지정할 수 있다. 에러 처리 미들웨어를 직접 연결하지 않아도 기본적으로 익스프레스가 에러를 처리해주지만 실무에서는 직접 연결해주는 것이 좋다.
- 에러처리 미들웨어는 가장 아래에 위치하도록 한다.

