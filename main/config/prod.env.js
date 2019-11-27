'use strict'
let BUILD_ENV = process.env.BUILD_ENV

let env = {
  NODE_ENV: '"production"'
}
if (BUILD_ENV == 'test') {
  env.BUILD_ENV = '"test"'
} else if (BUILD_ENV == 'production') {
  env.BUILD_ENV = '"production"'
}

module.exports = env
