const express = require('express');

const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require('./config');

module.exports = (app) => {
  // config.isLocal && app.use(cors());
  app.use(cors({origin: '*', optionSuccessStatus:200}));
  app.options('*', cors({origin: '*', optionSuccessStatus:200}));
  app.use(helmet());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(morgan('dev'));
};
