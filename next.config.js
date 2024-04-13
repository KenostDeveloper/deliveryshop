const path = require('path')
 
module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  env: {
    URL_IMAGE: process.env.URLIMAGE,
  }
}