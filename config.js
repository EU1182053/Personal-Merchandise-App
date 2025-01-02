// load environment variables from .env
require("dotenv").config();

const config = {
    app:{
        port: process.env.PORT || 5000,
        secret: process.env.SECRET || 'defaultsecret'
    },
    database:{
        uri: process.env.MONGO_URI
    },
    email:{
        from: process.env.FROM_EMAIL,
        sendgridApiKey: process.env.SENDGRID_API_KEY
    }
}

module.exports = config;