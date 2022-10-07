const express =  require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const nunjucks = require('nunjucks');

dotenv.config();
const indexRouter = require('./routes');
const userRouter = require('./routes/user');

// express 모듈을 실행해 app 변수에 할당
// express 내부에 http 모듈이 내장되어있어 서버의 역할을 할 수 있음.
const app = express();

// app.set('port', 포트) : 서버가 실행될 포트를 설정.
// process.env 객체에 PORT 속성이 있다면 그 값을 사용하고, 없다면 기본값으로 3000번 포트를 이용함.
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

nunjucks.configure('views', {
  express: app,
  watch: true,
});

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  name: 'session-cookie',
}));

app.use('/', indexRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
  // res.status(404).send('Not Found');
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

const multer = require('multer');
const fs = require('fs');

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads/');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },

  }),
  limits: { fileSize : 5 * 1024 * 1024 },
});

app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'multipart.html'));
});

app.post('/upload',
  upload.fields([{ name : 'image1'}, { name : 'image2' }]),
  (req, res) => {
    console.log(req.files, req.body);
    res.send('ok');
  },
);

// 미들웨어 : 요청과 응답을 조작하여 기능을 추가하기도 하고 나쁜 요청을 걸러내기도 함. app.use와 함께 사용
app.use((req, res, next) => {
  console.log('모든 요청에 다 실행됩니다.');
  next();
});

app.get('/', (req, res, next) => {
  console.log('GET / 요청에서만 실행됩니다.');
  next();
}, (req, res) => {
  throw new Error('에러는 에러 처리 미들웨어로 갑니다.')
});

app.use((err, req, res, next) => {
  // console.error(err);
  // res.status(500).send(err.message);
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// app.get(주소, 라우터) : 주소에 대한 GET요청이 올 때 어떤 동작을 할지 적는 부분
// req는 요청에 관한 정보가 들어있는 객체이고, res는 응답에 관한 정보가 들어있는 객체
app.get('/', (req, res) => {
  // res.send('Hello, Express');
  // HTML로 응답하고 싶을 때 res.sendFile 메서드 사용. 단, 파일의 경로를 path 모듈을 사용해서 지정해야함.
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
})