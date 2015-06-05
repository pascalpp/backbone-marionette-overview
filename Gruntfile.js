module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          keepalive: true,
          port: 9090,
          hostname: '*',
        }
      }
    },

  });

  // define the default task
  grunt.registerTask('default', ['connect']);

};
