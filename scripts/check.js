'use strict';

const check = require('./lib/check');

const payload = JSON.parse(process.argv[2]);

check(payload)
  .then((versions) => console.log(versions))
  .catch((err) => console.error(err));
