const express = require('express')
const router = express.Router()

const {
  getAllBootcamps,
  getSingleBootcamp,
  createSingleBootcamp,
  updateSelectedBootcamp,
  deleteSelectedBootcamp,
  getBootcampsInRadius,
  uploadBootcampPhoto
} = require('../controllers/bootcamps')

//include other routes
const courseRouter = require('./courses')
//re-route
router.use('/:bootcampId/courses', courseRouter)

router
  .route('/radius/:zipcode/:distance')
  .get(getBootcampsInRadius)
  .post(createSingleBootcamp)

router
  .route('/:id/photo')
  .put(uploadBootcampPhoto)

router
  .route('/')
  .get(getAllBootcamps)
  .post(createSingleBootcamp)

router
  .route('/:id')
  .get(getSingleBootcamp)
  .put(updateSelectedBootcamp)
  .delete(deleteSelectedBootcamp)

module.exports = router