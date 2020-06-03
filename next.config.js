const withPWA = require('next-pwa')
require('dotenv').config()
 
module.exports = withPWA({
    pwa: {
        dest: 'public'
    },
    env: {
        DEVELOPMENT_URL: process.env.DEVELOPMENT_URL,
        PRODUCTION_URL: process.env.PRODUCTION_URL,
    },
})