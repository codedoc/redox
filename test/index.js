/**
 * Module dependencies.
 */

var redox = require('../');
var should = require('should');
var fs = require('fs');

console.log('test');

function fixture(name, fn) {
  fs.readFile(__dirname + '/fixtures/' + name, 'utf8', fn);
}

module.exports = {
  'test a': function (done) {
    fixture('a.js', function (err, str) {
      var out = redox.parse(str);
      console.log(out);
      done();
    });
  },
  'test b': function (done) {
    fixture('b.js', function (err, str) {
      var out = redox.parse(str);
      console.log(out);
      done();
    });
  },
  'test c': function (done) {
    fixture('c.js', function (err, str) {
      var out = redox.parse(str);
      console.log(out);
      done();
    });
  },
  'test singleline': function (done) {
    fixture('singleline.js', function (err, str) {
      var out = redox.parse(str);
      console.log(out);
      done();
    });
  },
  'test titles': function (done) {
    fixture('titles.js', function (err, str) {
      var out = redox.parse(str);
      console.log(out);
      done();
    });
  },
  'test uncommented': function (done) {
    fixture('uncommented.js', function (err, str) {
      var out = redox.parse(str);
      console.log(out);
      done();
    });
  }
};