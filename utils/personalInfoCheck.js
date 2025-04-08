const levenshtein = require('fast-levenshtein');

const personalInfoCheck = (password, { name, birthYear, city }) => {
  const lowerPassword = password.toLowerCase();
  const birthYearStr = birthYear?.toString() || "";

  const isSimilar = (value) => {
    if (!value) return false;
    const lowerValue = value.toLowerCase();
    return levenshtein.get(lowerPassword, lowerValue) <= 2; 
  };

  const containsName = isSimilar(name);
  const containsCity = isSimilar(city);
  const containsBirthYear = lowerPassword.includes(birthYearStr);

  const containsPersonalInfo = containsName || containsCity || containsBirthYear;

  return {
    containsPersonalInfo,
    message: containsPersonalInfo
      ? 'Password contains or closely matches personal info'
      : 'Looks unique'
  };
};

module.exports = { personalInfoCheck };
