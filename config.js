// load environment variables from .env
require("dotenv").config();

const config = { 
    app:{
        port: process.env.PORT || 5000,
        secret: process.env.SECRET || 'defaultsecret'
    },
    database:{
        uri_test: process.env.uri_test,
        uri_dev: process.env.uri_dev
    },
    email:{
        from: process.env.FROM_EMAIL,
        sendgridApiKey: process.env.SENDGRID_API_KEY
    },
    token:{
        validAdminJwtToken:process.env.validAdminJwtToken
    },
    tinify:{
        apikey: process.env.TINIFY_API_KEY
    }
}
 
module.exports = config;