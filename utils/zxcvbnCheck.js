const zxcvbn = require('zxcvbn');

exports.zxcvbnCheck = (password) => {
  const result = zxcvbn(password);
  return {
    strength: result.score,
    entropy: result.guesses_log10,
    crackTime: result.crack_times_display.offline_slow_hashing_1e4_per_second,
    feedback: result.feedback
  };
};
