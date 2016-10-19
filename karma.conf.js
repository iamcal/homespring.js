module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'lib/homespring.min.js',
      'test/*.js'
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
    ]
  })
}
