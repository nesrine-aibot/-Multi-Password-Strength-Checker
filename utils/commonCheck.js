const fs = require('fs');

// Read and clean up common passwords
const commonPasswords = fs
  .readFileSync('./common-passwords.txt', 'utf-8')
  .split('\n')
  .map(pwd => pwd.trim().toLowerCase()) // trim and lowercase each line
  .filter(pwd => pwd.length > 0); // remove empty lines

exports.commonCheck = (password) => {
  const normalizedPassword = password.trim().toLowerCase();
  const isCommon = commonPasswords.includes(normalizedPassword);

  return {
    isCommon,
    message: isCommon ? ' Password is too common!' : 'Not a common password '
  };
};
