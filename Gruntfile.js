module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        ASCIIOnly: true
      },
      build: {
        src: 'lib/homespring.js',
        dest: 'lib/homespring.min.js'
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS'],
        logLevel: 'ERROR'
      },
      coverage: {
        configFile: 'karma-cover.conf.js',
        singleRun: true,
        browsers: ['PhantomJS'],
        logLevel: 'OFF'
      }
    },
    coveralls: {
      options: {
        debug: true,
        coverageDir: 'coverage/',
        dryRun: true,
        force: true,
        recursive: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-karma-coveralls');

  grunt.registerTask('default', ['uglify', 'karma:unit', 'karma:coverage']);
};
