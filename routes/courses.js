const express = require('express')
const router = express.Router({ mergeParams: true })

const {
  getAllCourses,
  getSingleCourse,
  addACourse,
  updateSelectedCourse,
  deleteCourse
} = require('../controllers/courses')

router.route('/').get(getAllCourses).post(addACourse)
router.route('/:id').get(getSingleCourse).put(updateSelectedCourse).delete(deleteCourse)

module.exports = router