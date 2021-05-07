process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'node_modules/jquery/dist/jquery.js',
      'lib/homespring.js',
      'test/helpers.js',
      'test/*.js'
    ],
    exclude: [
      'test/examples_*.js'
    ],
    preprocessors: {
      "lib/homespring.js": "coverage"
    },
    coverageReporter: {
      type: "lcov",
      dir: "coverage/"
    },
    reporters: ['coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: false,
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-coverage'
    ],
    browserNoActivityTimeout: 600000,
    client: {
      jasmine: {
        random: false
      }
    }
  })
}
