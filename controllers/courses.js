const Course = require('../models/Course')
const ErrorResponse = require('../utils/response')
const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp');

// @desc       Get All courses
// @routes     GET /api/v1/courses
// @routes     GET /api/v1/:bootcampId/courses
// @access     Public   

exports.getAllCourses = asyncHandler(async (req, res, next) => {
  let query

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId })
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description'
    })
  }

  const courses = await query

  res.statusCode = 200
  res.json({
    success: true,
    count: courses.length,
    // pagination,
    data: courses,
    msg: 'Show all courses',
  })
})

exports.getSingleCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  })

  if (!course) {
    return next(new ErrorResponse(`No course with id of ${req.params.id}`))
  }

  res.statusCode = 200
  res.json({
    success: true,
    data: course,
  })
})

// @desc       Get All courses
// @routes     POST /api/v1/bootcamps/:bootcampId/courses
// @access     Private   
exports.addACourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId
  console.log(req.body.bootcamp)
  const bootcamp = await Bootcamp.findById(req.params.bootcampId)

  if (!bootcamp) {
    return next(new ErrorResponse(`No bootcamp with id of ${req.params.id}`))
  }

  const course = await Course.create(req.body)

  res.statusCode = 200
  res.json({
    success: true,
    data: course,
  })
})

// @desc       Get All courses
// @routes     PUT /api/v1/bootcamps/:bootcampId/courses
// @access     Private   
exports.updateSelectedCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id)

  if (!course) {
    return next(new ErrorResponse(`No course with id of ${req.params.id}`))
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  res.statusCode = 200
  res.json({
    success: true,
    data: course,
  })
})

// @desc       Get All courses
// @routes     DELETE /api/v1/bootcamps/:bootcampId/courses
// @access     Private   
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id)

  if (!course) {
    return next(new ErrorResponse(`No course with id of ${req.params.id}`))
  }

  await course.deleteOne();

  res.statusCode = 200
  res.json({
    success: true,
    data: course,
  })
})