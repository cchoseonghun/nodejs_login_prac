'use strict';

class UsersService {
  getUserInfoByEmail = (email) => {
    return { id: 44, email: 'test@gmail.com', password: 'qwer1234', name: 'tester' };
  };

  getUserInfoById = (id) => {
    return { id: 44, email: 'test@gmail.com', password: 'qwer1234', name: 'tester' };
  };
}

module.exports = UsersService;
