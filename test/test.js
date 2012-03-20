#!/usr/bin/env node

/**
 * Module dependencies.
 */

var redox = require('../').redox
  , fs = require('fs')
  ;

fs.readFile('../lib/redox.js', 'utf8', function (err, data) {
  if (err) throw err;
  console.log(JSON.stringify(redox.parse(data)));
});