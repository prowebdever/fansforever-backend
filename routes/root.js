const express = require('express');
const { healthCheckRouteHandler } = require('../controllers/rootController');
const cors = require('cors');
const router = express.Router();

router.get('/',cors(), healthCheckRouteHandler);

module.exports = router;
