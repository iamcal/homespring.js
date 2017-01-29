module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'node_modules/jquery/dist/jquery.js',
      'lib/homespring.min.js',
      'test/helpers.js',
      'test/*.js',
      {
        pattern: 'examples/*.hs',
        included: false,
        served: true
      }
    ],
    exclude: [
    ],
    reporters: ['story'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: false,
    plugins: [
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-story-reporter',
    ],
    browserNoActivityTimeout: 60000
  })
}
