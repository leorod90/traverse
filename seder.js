const fs = require('fs')
const colors = require('colors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')

dotenv.config({ path: './config/config.env' })

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'))


//read ƒiles
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps)
    await Course.create(courses)
    console.log('data imported'.green.inverse)
    process.exit()
  } catch (error) {
    console.log(error)
  }
}

const deleteAllBootcamps = async () => {
  try {
    await Bootcamp.deleteMany()
    await Course.deleteMany()
    console.log('data deleted'.red.inverse)
    process.exit()
  } catch (error) {
    console.log(error)
  }
}

if (process.argv[2] === '-i') {
  importData()
} else if (process.argv[2] === '-d') {
  deleteAllBootcamps()
}