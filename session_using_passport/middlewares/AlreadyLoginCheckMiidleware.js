'use strict';

module.exports = (req, res, next) => {
  if (req.user) {
    res.render('index', { message: '이미 로그인된 상태입니다.' });
  } else {
    next();
  }
};
