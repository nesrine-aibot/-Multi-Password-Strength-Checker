const { analyzeEntropy } = require('../utils/entropyChecker');

exports.checkPasswordStrength = (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  const result = analyzeEntropy(password);
  return res.json(result);
};
