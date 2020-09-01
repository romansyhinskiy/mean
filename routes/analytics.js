const express = require('express')
const router = express.Router()
const controller = require('../controllers/analytics')

router.post('/overview', controller.overview)
router.post('/analytics', controller.analytics)

module.exports = router
