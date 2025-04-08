const express = require('express');
const router = express.Router();

const { zxcvbnCheck } = require('../utils/zxcvbnCheck');
const { commonCheck } = require('../utils/commonCheck');
const { varietyCheck } = require('../utils/varietyCheck');
const { lengthCheck } = require('../utils/lengthCheck');
const { personalInfoCheck } = require('../utils/personalInfoCheck');

// POST /api/entropy
router.post('/entropy', (req, res) => {
  const { password } = req.body;
  res.json(zxcvbnCheck(password));
});

// POST /api/common
router.post('/common', (req, res) => {
  const { password } = req.body;
  res.json(commonCheck(password));
});

// POST /api/variety
router.post('/variety', (req, res) => {
  const { password } = req.body;
  res.json(varietyCheck(password));
});

// POST /api/length
router.post('/length', (req, res) => {
  const { password } = req.body;
  res.json(lengthCheck(password));
});

// POST /api/personal
router.post('/personal', (req, res) => {
  const { password, name, birthYear, city } = req.body;
  res.json(personalInfoCheck(password, { name, birthYear, city }));
});

module.exports = router;
