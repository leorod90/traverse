//@desc     Logs request to console
const logger = (req, res, next) => {
  // console.log('logger')
  next()
}

module.exports = logger