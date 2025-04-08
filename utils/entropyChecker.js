const zxcvbn = require('zxcvbn');

exports.analyzeEntropy = (password) => {
  const result = zxcvbn(password);

  return {
    password,
    entropy: result.guesses_log10.toFixed(2),  // estimated entropy
    crackTime: result.crack_times_display.offline_slow_hashing_1e4_per_second,
    strength: result.score === 4 ? 'Strong' :
              result.score === 3 ? 'Good' :
              result.score === 2 ? 'Medium' : 'Weak',
    feedback: result.feedback,
  };
};
