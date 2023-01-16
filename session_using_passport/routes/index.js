'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');

const LoginCheckMiddleware = require('../middlewares/LoginCheckMiidleware');
const AlreadyLoginCheckMiddleware = require('../middlewares/AlreadyLoginCheckMiidleware');

router.get('/login', AlreadyLoginCheckMiddleware, (req, res) => {
  res.render('login');
});

router.get('/mypage', LoginCheckMiddleware, (req, res) => {
  res.render('mypage', { userInfo: req.user });
});

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/api/users/login', passport.authenticate('local', { failureRedirect: '/api/users/loginFail' }), (req, res) => {
  res.status(200).json({ message: '로그인 성공' });
});

// passport.authenticate의 실패 상황에 대해서 여기로 리다이렉트 하는게 최선이라 생각
// 나중에 더 좋은 방법이 있으면 개선 필요
router.get('/api/users/loginFail', (req, res) => {
  res.status(401).json({ message: '로그인 실패' });
});

// router를 더 세분화시킬 수 있지만 참고하기엔 이정도가 적당하다고 생각해 분리하지 않는다.
module.exports = router;
