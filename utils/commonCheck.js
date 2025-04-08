const fs = require('fs');


const commonPasswords = fs
  .readFileSync('./common-passwords.txt', 'utf-8')
  .split('\n')
  .map(pwd => pwd.trim().toLowerCase()) 
  .filter(pwd => pwd.length > 0); 

exports.commonCheck = (password) => {
  const normalizedPassword = password.trim().toLowerCase();
  const isCommon = commonPasswords.includes(normalizedPassword);

  return {
    isCommon,
    message: isCommon ? ' Password is too common!' : 'Not a common password '
  };
};
