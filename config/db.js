const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    console.log('Mongoose Connected'.cyan.underline.bold);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`.red);
  }
};
module.exports = connectDB