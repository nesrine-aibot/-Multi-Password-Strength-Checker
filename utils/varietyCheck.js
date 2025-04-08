exports.varietyCheck = (password) => {
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  
    const score = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
  
    return {
      hasLower,
      hasUpper,
      hasNumber,
      hasSymbol,
      varietyScore: score,
      message: score >= 3 ? 'Nice variety!' : 'Try mixing characters more!'
    };
  };
  