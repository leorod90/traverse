const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/response')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder');

// @desc       Get All bootcamps
// @routes     GET /api/v1/bootcamps
// @access     Public   
exports.getAllBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query }

  const removeFields = ['select', 'sort', 'page', 'limit']

  removeFields.forEach(param => delete reqQuery[param])

  let queryStr = JSON.stringify(reqQuery)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in\b)/g, match => `$${match}`)

  query = Bootcamp.find(JSON.parse(queryStr)).populate('courses')

  //SELECT FIELDS
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  //pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 100
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Bootcamp.countDocuments()

  query = query.skip(startIndex).limit(limit)

  const bootcamps = await query

  //pagination result
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page + 1,
      limit
    }
  }

  res.statusCode = 200
  res.json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
    msg: 'Show all bootcamp',
  })
})

// @desc       Get a single bootcamps
// @routes     GET /api/v1/bootcamps/:id
// @access     Public   
exports.getSingleBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  const bootcamp = await Bootcamp.findById(id).populate('courses')

  if (!bootcamp) {
    throw new Error
  }

  res.statusCode = 200
  res.json({
    success: true,
    data: bootcamp,
    msg: 'Get Single',
  })
})

// @desc       crate a single bootcamps
// @routes     POST /api/v1/bootcamps/:id
// @access     Private   
exports.createSingleBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body)

  res.statusCode = 201
  res.json({
    success: true,
    data: bootcamp,
    msg: 'Create a new bootcamp'
  })
})

// @desc       update selected bootcamp
// @routes     PUT /api/v1/bootcamps/:id
// @access     Private   
exports.updateSelectedBootcamp = asyncHandler(async (req, res, next) => {
  const { body } = params
  const { id } = req.params

  const bootcamp = await Bootcamp.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  })

  if (!bootcamp) {
    throw new Error
  }

  res.statusCode = 200
  res.json({
    success: true,
    data: bootcamp,
    msg: 'updated bootcamp',
  })
})

// @desc       delete selected bootcamp
// @routes     DELETE /api/v1/bootcamps/:id
// @access     Private   
exports.deleteSelectedBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  const bootcamp = await Bootcamp.findOne({ _id: id });
  if (!bootcamp) {
    throw new Error
  }

  await bootcamp.deleteOne();

  res.statusCode = 200
  res.json({
    success: true,
    data: {},
    msg: 'delete bootcamp',
  })
})

// @desc       get bootcamps in a radius
// @routes     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access     Private   
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params

  //get lat/lng
  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude
  const lng = loc[0].longitude

  const radius = distance / 3963

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  })

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
    msg: 'get bootcamp near you',
  })
})

// @desc       upload photo for bootcamp
// @routes     PU /api/v1/bootcamps/:id/photo
// @access     Private   
exports.uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
  console.log('erere')
  // const { bootcampId } = req.params

  // const bootcamp = await Bootcamp.findOne({ _id: bootcampId });
  // if (!bootcamp) {
  //   throw new Error
  // }

  // if (!req.files) {
  //   return next(new ErrorResponse(`Please upload a photo`))
  // }
})