exports.lengthCheck = (password) => {
    const minLength = 8;
    return {
      length: password.length,
      isLongEnough: password.length >= minLength,
      message: password.length >= minLength ? 'Good length!' : 'Too short'
    };
  };
  