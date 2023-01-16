'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const UsersService = require('../services/users.service');
const usersService = new UsersService();

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: true,
      passReqToCallback: false,
    },
    (email, password, done) => {
      // console.log(email, password);

      const userInfo = usersService.getUserInfoByEmail(email);
      if (!userInfo) {
        return done(null, false, { message: '회원정보 불일치' });
        // 로그인 실패 시 여기서 전달하는 message의 값을 가져다 쓸 수 없을까?
      }
      if (password !== userInfo.password) {
        return done(null, false, { message: '회원정보 불일치' });
      }
      return done(null, userInfo);
    }
  )
);

passport.serializeUser((userInfo, done) => {
  done(null, userInfo.id);
});

passport.deserializeUser((id, done) => {
  const userInfo = usersService.getUserInfoById(id);
  done(null, userInfo);
});

module.exports = passport;
