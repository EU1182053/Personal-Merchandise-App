require('dotenv').config({path:process.env.SECRET})
const authRoute = require('./routes/auth')
const cors = require('cors')
const userRoute = require('./routes/user')
const cateRoute = require('./routes/category')
const orderRoute = require('./routes/order')

const productRoute = require('./routes/product')
const paymentRoute = require('./routes/paymentBRoutes')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()
mongoose.connect(process.env.DATABASE,
                         {useNewUrlParser: true, 
                            useUnifiedTopology: true,
                            useCreateIndex: true,
                            useFindAndModify: false
                        })
                        .then( () => {
                            console.log("DB succeed")
                            }
                        )
                        .catch( () => {
                                console.log("DB stopped working")
                            }
                        )
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())
app.use('/api', authRoute)
app.use('/api', userRoute)
app.use('/api', cateRoute)
app.use('/api', productRoute)
app.use('/api', paymentRoute)
app.use('/api', orderRoute)




const port = 8000
app.get('/', (req, res) => res.send('hello there'))

app.listen(port, () => {
    console.log(`${port}`)
})
