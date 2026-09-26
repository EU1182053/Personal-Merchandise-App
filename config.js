// load environment variables from .env
require("dotenv").config();
 
const config = { 
    app:{
        port: process.env.PORT || 5000,
        secret: process.env.SECRET || 'defaultsecret'
    },
    database:{
        uri_test: process.env.MONGO_URI_TEST,
        uri_dev: process.env.MONGO_URI
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