const express = require('express');
const app = express();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.set('view engine', 'ejs');
// app.set('views', `${__dirname}/views`);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({secret:'비밀코드', resave: true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: true,
  passReqToCallback: false, 
}, (email, password, done) => {
  // console.log(email, password);

  const userInfo = getUserInfoByEmail(email);

  if (!userInfo) {
    return done(null, false, { message: '회원정보 불일치' });
    // 로그인 실패 시 여기서 전달하는 message의 값을 가져다 쓸 수 없을까?
  }

  if (password !== userInfo.password) {
    return done(null, false, { message: '회원정보 불일치' });
  }

  return done(null, userInfo);
}));

passport.serializeUser((userInfo, done) => {
  done(null, userInfo.id);
});

passport.deserializeUser((id, done) => {
  // serializeUser에서 done의 두 번째 인자로 들어간 값이 
  // deserializeUser의 콜백 함수의 첫 번째 인자로 들어옴
  // 즉, serializeUser는 로그인 후 세션에 userInfo.id를 저장
  // 이후 어떤 호출에서나 deserializeUser 실행됨

  // console.log('deserializeUser :');
  // console.log('id: ', id);
  const userInfo = getUserInfoById(id);
  done(null, userInfo);
  // done의 두 번째 인자인 userInfo가 req.user에 저장되고
  // req.user 를 통해 userInfo에 접근할 수 있게된다.
})


app.get('/login', alreadyLoginCheckMiddleware, (req, res) => {
  res.render('login')
});

app.get('/mypage', loginCheckMiddleware, (req, res) => {
  // console.log('mypage 들어옴');
  // console.log('req.user: ');
  // console.log(req.user);
  res.render('mypage', { userInfo: req.user });
})

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/api/users/login', passport.authenticate('local', { failureRedirect: '/api/users/loginFail' }), (req, res) => {
  res.status(200).json({ message: '로그인 성공' });
});

app.get('/api/users/loginFail', (req, res) => {
  res.status(401).json({ message: '로그인 실패' });
});

app.listen(3000, () => {
  console.log('server on');
});

function getUserInfoByEmail(email) {
  return { id: 44, email: 'test@gmail.com', password: 'qwer1234', name: 'tester' };
}

function getUserInfoById(id) {
  return { id: 44, email: 'test@gmail.com', password: 'qwer1234', name: 'tester' };
}

function loginCheckMiddleware(req, res, next) {
  // console.log('loginMiddleware 들어옴');
  // console.log('req.user: ');
  // console.log(req.user);
  if (req.user) {
    next();
  } else {
    res.render('index', { message: '권한이 없습니다.' } );
  }
}

function alreadyLoginCheckMiddleware(req, res, next) {
  if (req.user) {
    res.render('index', { message: '이미 로그인된 상태입니다.' } );
  } else {
    next();
  }
}