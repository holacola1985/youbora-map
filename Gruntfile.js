'use strict';
var _ = require('lodash');

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  var packages = [
    'main'
  ];
  var config = {
    browserify: {
      options: {
        transform: [['babelify', {
          stage: 0
        }]],
        watch: true,
        browserifyOptions: {
          debug: true
        }
      }
    },
    less: {},
    uglify: {
      main: {
        files: {}
      }
    },
    watch: {}
  };

  _.each(packages, function(name) {
    var dest_js = 'public/js/' + name + '.js';

    // browserify
    config.browserify[name] = {
      dest: dest_js,
      src: 'app/front/js/' + name + '/index.js'
    };

    // less
    var less_files = {};
    less_files['public/css/' + name + '.css'] = 'app/front/less/' + name + '/index.less';
    config.less[name + '_dev'] = {
      options: {
        sourceMap: true
      },
      files: less_files
    };
    config.less[name + '_prod'] = {
      options: {
        sourceMap: true
      },
      files: less_files
    };

    // uglify
    config.uglify.main.files[dest_js] = dest_js;

    // watch
    config.watch[name] = {
      files: ['app/front/less/' + name + '/*.less'],
      tasks: ['less:' + name + '_dev']
    };
  });

  grunt.initConfig(config);

  var less_dev_task = _.map(packages, function(name) {
    return 'less:' + name + '_dev';
  });
  var less_prod_task = _.map(packages, function(name) {
    return 'less:' + name + '_dev';
  });

  grunt.registerTask('dev', ['browserify'].concat(less_dev_task).concat(['watch']));
  grunt.registerTask('prod', ['browserify', 'uglify'].concat(less_prod_task));



};
