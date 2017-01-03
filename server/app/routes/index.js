'use strict';

const router = require('express').Router();
module.exports = router;

router.use('/upload', require('./upload'));
router.use('/user', require('./user'));


// Make sure this is after all of
// the registered routes!
router.use((req, res) => {
  res.status(404).end();
});