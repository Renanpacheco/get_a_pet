const router = require('express').Router();

const petController = require('../controllers/petController')

router.post('/create', petController.create)

module.exports = router