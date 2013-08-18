
var grunt = require('grunt')
  , rimraf = require('rimraf')
  , s3 = require('../tasks/lib/s3').init(grunt)
  , s3Config = grunt.config("s3")
  , _ = grunt.util._
  , async = grunt.util.async;

var common = module.exports = {
  config: _.extend({}, s3Config.options, s3Config.test.options),

  clean: function(cb) {
    rimraf(__dirname + '/../s3', cb);
  },

  setup: function(cb) {
    grunt.config.set('s3.changed', []);
    common.clean(cb);
  },

  upload: function(file) {
    return function(cb) {
      s3.upload(__dirname + '/files/a.txt', 'a.txt', common.config).done(cb);
    }
  }
}

