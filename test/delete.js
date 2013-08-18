
var grunt = require('grunt')
  , fs = require('fs')

var hashFile = require('../tasks/lib/common').hashFile
  , s3 = require('../tasks/lib/s3').init(grunt)
  , _ = grunt.util._
  , async = grunt.util.async
  , s3Config = grunt.config("s3")
  , common = require('./common')
  , config = common.config;

module.exports = {
  setUp: function(cb) {
    async.series([
      common.setup,
      common.upload('a.txt')
    ], function() {
      cb();
    });
  },

  testDelete: function(test) {
    test.expect(5);

    var dest = 'a.txt';
    var client = s3.makeClient(config);

    async.series([
      function(next) {
        client.getFile(dest, function (err, res) {
          test.ifError(err);
          test.equal(res.statusCode, 200, 'File exists.');
          next();
        });
      },
      function(next) {
        s3.del(dest, config).done(function() {
          next();
        });
      },
      function(next) {
        client.getFile(dest, function (err, res) {
          test.ifError(err);
          test.equal(res.statusCode, 404, 'File does not exist.');
          test.deepEqual(grunt.config('s3.changed'), ['a.txt']);
          next();
        }, 500);
      }
    ], function(err) {
      test.done();
    });
  }
};