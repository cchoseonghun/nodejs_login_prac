'use strict';

module.exports = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.render('index', { message: '권한이 없습니다.' });
  }
};
