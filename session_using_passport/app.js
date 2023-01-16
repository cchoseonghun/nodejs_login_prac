'use strict';

const express = require('express');
const app = express();

const passport = require('./utils/Passport');
const session = require('express-session');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({ secret: '비밀코드', resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

const router = require('./routes');
app.use('/', router);
app.get('/*', (req, res) => res.redirect('/'));

module.exports = app;
