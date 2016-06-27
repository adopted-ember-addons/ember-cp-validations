/*jshint node:true*/
module.exports = {
  "framework": "qunit",
  "test_page": "tests/index.html?coverage",
  "disable_watching": true,
  "phantomjs_debug_port": 9000,
  "launch_in_ci": [
    "Chrome"
  ],
  "launch_in_dev": [
    "Chrome"
  ]
};
