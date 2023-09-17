const express = require('express')
const dotenv = require('dotenv')
const logger = require('./middleware/logger')
const errHandler = require('./middleware/error')
const morgan = require('morgan')
const connectDB = require('./config/db')
const colors = require('colors')
const bootcamps = require('./routes/bootcamp')
const courses = require('./routes/courses')
const fileUpload = require('express-fileupload')

//Load ENV
dotenv.config({ path: './config/config.env' })

const PORT = process.env.PORT || 3000
const ENV = process.env.NODE_ENV

connectDB()
const app = express()

app.use(express.json())

if (ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(logger)
app.use(fileUpload())

app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)

app.use(errHandler)

const server = app.listen(PORT, console.log(`Server running in ${ENV} on port ${PORT}`.yellow.bold))

process.on('unhandledRejection', (err, promise) => {
  console.log(`Err: ${err}`.red)
  server.close(() => process.exit(1))
})