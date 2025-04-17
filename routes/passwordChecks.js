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


// Helper function to generate random characters for suggestions
const generateRandomChar = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  return chars.charAt(Math.floor(Math.random() * chars.length));
};

// Helper function to generate random number-based transformations
const generateRandomNumber = () => Math.floor(Math.random() * 100);

// Helper function to generate random password suggestions based on entropy
const addRandomChanges = (pwd) => {
  const newPwd = [...pwd].map((char) => (Math.random() > 0.5 ? generateRandomChar() : char)).join('');
  return newPwd + generateRandomNumber();
};

// Helper function to handle more complex password improvements
const enhancePassword = (pwd) => {
  let enhancedPwd = pwd;
  const strategies = [
    () => enhancedPwd.replace(/([a-zA-Z])/, '$1@'),
    () => enhancedPwd.split('').map((c) => (Math.random() > 0.5 ? c.toUpperCase() : c)).join(''),
    () => enhancedPwd + generateRandomNumber(),
  ];
  strategies.forEach((strategy) => {
    enhancedPwd = strategy();
  });
  return enhancedPwd;
};

// Helper function to replace personal info in the password
const replacePersonalInfo = (pwd, name, city, birthYear) => {
  let modified = pwd;
  if (name && modified.toLowerCase().includes(name.toLowerCase())) {
    modified = modified.replace(new RegExp(name, 'ig'), 'Xx');
  }
  if (city && modified.toLowerCase().includes(city.toLowerCase())) {
    modified = modified.replace(new RegExp(city, 'ig'), 'Yy');
  }
  if (birthYear && modified.includes(birthYear.toString())) {
    modified = modified.replace(birthYear.toString(), '1234');
  }
  return modified;
};


router.post('/listSuggestion', async (req, res) => {
  const { password, name, birthYear, city } = req.body;
  const suggestions = new Set();

  // Run all checks asynchronously
  const [entropy, common, variety, length, personal] = await Promise.all([
    zxcvbnCheck(password),
    commonCheck(password),
    varietyCheck(password),
    lengthCheck(password),
    personalInfoCheck(password, { name, birthYear, city }),
  ]);

  // Apply improvements based on results
  if (entropy.score < 3) {
    suggestions.add(addRandomChanges(password)); // Improve entropy by adding random changes
  }

  if (common.isCommon) {
    suggestions.add(password + '!Secure'); // If password is common, add extra secure elements
  }

  if (!variety.hasUpperCase) {
    suggestions.add(password.split('').map((char) => (Math.random() > 0.5 ? char.toUpperCase() : char)).join('')); // Ensure uppercase letter
  }

  if (!variety.hasSymbols) {
    suggestions.add(password + '!' + generateRandomChar()); // Ensure symbols are included
  }

  if (!length.isLongEnough) {
    suggestions.add(password + generateRandomNumber()); // Increase length by adding numbers
  }

  if (personal.containsPersonalInfo) {
    suggestions.add(replacePersonalInfo(password, name, city, birthYear)); // Replace personal info in the password
  }

  // Check if password is strong
  const isStrong = suggestions.size === 0;

  // Prepare and return suggestions
  res.json({
    originalPassword: password,
    suggestions: Array.from(suggestions),
    isStrong,
  });
});

module.exports = router;
