import React, { useState } from 'react';
import zxcvbn from 'zxcvbn';
import generatePassword from 'generate-password-browser';
import './PasswordEvaluator.css';

const PasswordEvaluator = () => {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(null);
  const [personalAnswers, setPersonalAnswers] = useState({
    isPersonal: false,
    isReused: false,
    isWrittenDown: false,
    isSharedWithOthers: false,
    isDefaultPassword: false,
    isOlderThanYear: false
  });
  const [generatedPassword, setGeneratedPassword] = useState('');

  const getPasswordScore = () => {
    if (!strength) return 0;
    return (strength.score / 4) * 100;
  };

  const getPasswordIssues = () => {
    if (!password) return [];
    
    const issues = [];
    
    // Check length
    if (password.length < 8) {
      issues.push('Password is too short (minimum 8 characters)');
    }
    if (password.length < 12) {
      issues.push('Consider using at least 12 characters for better security');
    }

    // Check character types
    if (!/\d/.test(password)) {
      issues.push('Missing numbers');
    }
    if (!/[a-z]/.test(password)) {
      issues.push('Missing lowercase letters');
    }
    if (!/[A-Z]/.test(password)) {
      issues.push('Missing uppercase letters');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      issues.push('Missing special characters');
    }

    // Add zxcvbn feedback
    if (strength) {
      if (strength.feedback.warning) {
        issues.push(strength.feedback.warning);
      }
      issues.push(...strength.feedback.suggestions);
    }

    return issues;
  };

  const getPasswordStrengthLabel = (score) => {
    const labels = {
      0: 'Very Weak',
      1: 'Weak',
      2: 'Fair',
      3: 'Strong',
      4: 'Very Strong'
    };
    return labels[score] || 'Very Weak';
  };

  const generateStrongPassword = () => {
    const newPassword = generatePassword.generate({
      length: 16,
      numbers: true,
      symbols: true,
      uppercase: true,
      lowercase: true,
      strict: true
    });
    setGeneratedPassword(newPassword);
  };

  const getStrengthColor = () => {
    if (!strength) return '';
    const colors = ['#ff0000', '#ff4500', '#ffa500', '#9acd32', '#008000'];
    return colors[strength.score];
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
  };

  const calculateRiskScore = () => {
    const weights = {
      isPersonal: 15,
      isReused: 20,
      isWrittenDown: 10,
      isSharedWithOthers: 20,
      isDefaultPassword: 25,
      isOlderThanYear: 10
    };

    let score = 0;
    Object.entries(personalAnswers).forEach(([key, value]) => {
      if (value === true) {
        score += weights[key];
      }
    });

    return Math.min(score, 100);
  };

  const getRiskColor = (score) => {
    if (score < 20) return '#28a745';
    if (score < 40) return '#ffc107';
    if (score < 60) return '#fd7e14';
    if (score < 80) return '#dc3545';
    return '#dc3545';
  };

  const getRiskLevel = (score) => {
    if (score < 20) return 'Low Risk';
    if (score < 40) return 'Moderate Risk';
    if (score < 60) return 'High Risk';
    if (score < 80) return 'Very High Risk';
    return 'Critical Risk';
  };

  return (
    <div className="password-evaluator">
      <div className="password-input-section">
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            // Only evaluate if there's input
            if (e.target.value) {
              const result = zxcvbn(e.target.value);
              setStrength(result);
            } else {
              setStrength(null);
            }
          }}
          placeholder="Enter your password"
          className="password-input"
        />
        <button onClick={() => {}} className="check-button">
          Check Security
        </button>
      </div>

      {password && strength && (
        <div className="password-analysis">
          <div className="strength-meter">
            <div className="meter-label">
              <span>Password Strength</span>
              <span>{getPasswordStrengthLabel(strength.score)}</span>
            </div>
            <div className="meter-bar">
              <div 
                className="meter-fill"
                style={{ 
                  width: `${getPasswordScore()}%`,
                  backgroundColor: getStrengthColor()
                }}
              />
            </div>
            <div className="strength-score">
              Score: {getPasswordScore()}%
            </div>
          </div>

          <div className="password-issues">
            <h4>Password Analysis:</h4>
            {getPasswordIssues().length > 0 ? (
              <ul className="issues-list">
                {getPasswordIssues().map((issue, index) => (
                  <li key={index} className="issue-item">
                    <span className="issue-icon">⚠️</span>
                    {issue}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-issues">No issues found - your password follows good security practices!</p>
            )}
          </div>
        </div>
      )}

      {password && strength && (
        <div className="strength-section" style={{ color: getStrengthColor() }}>
          <h3>Password Strength: {['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'][strength.score]}</h3>
          {strength.feedback.warning && (
            <p className="warning">{strength.feedback.warning}</p>
          )}
          {strength.feedback.suggestions.map((suggestion, index) => (
            <p key={index} className="suggestion">{suggestion}</p>
          ))}
        </div>
      )}

      {password && strength && Object.values(personalAnswers).some(answer => answer !== null) && (
        <div className="personal-quiz">
          <h3>Password Security Assessment</h3>
          <div className="quiz-container">
            {[
              {
                id: 'isPersonal',
                question: 'Is this password related to your personal information (name, birthday, pet, etc.)?',
                risk: 'High risk: Personal information can be easily guessed'
              },
              {
                id: 'isReused',
                question: 'Do you use this password on other websites?',
                risk: 'High risk: Password reuse can lead to multiple account compromises'
              },
              {
                id: 'isWrittenDown',
                question: 'Have you written this password down somewhere?',
                risk: 'Medium risk: Written passwords can be physically compromised'
              },
              {
                id: 'isSharedWithOthers',
                question: 'Have you shared this password with anyone else?',
                risk: 'High risk: Shared passwords are no longer secure'
              },
              {
                id: 'isDefaultPassword',
                question: 'Is this a default password or similar to one?',
                risk: 'Critical risk: Default passwords are widely known'
              },
              {
                id: 'isOlderThanYear',
                question: 'Have you been using this password for more than a year?',
                risk: 'Medium risk: Passwords should be changed periodically'
              }
            ].map(({ id, question, risk }) => (
              <div key={id} className="quiz-question">
                <div className="question-header">
                  <p>{question}</p>
                  {personalAnswers[id] && (
                    <div className="risk-indicator">
                      {risk}
                    </div>
                  )}
                </div>
                <div className="quiz-options">
                  <button
                    className={personalAnswers[id] ? 'selected' : ''}
                    onClick={() => setPersonalAnswers(prev => ({ ...prev, [id]: true }))}
                  >
                    Yes
                  </button>
                  <button
                    className={personalAnswers[id] === false ? 'selected' : ''}
                    onClick={() => setPersonalAnswers(prev => ({ ...prev, [id]: false }))}
                  >
                    No
                  </button>
                </div>
              </div>
            ))}
          </div>

          {Object.values(personalAnswers).some(answer => answer !== null) && (
            <div className="risk-score">
              <h4>Risk Assessment Score</h4>
              <div className="score-meter">
                <div 
                  className="score-fill" 
                  style={{ 
                    width: `${calculateRiskScore()}%`,
                    backgroundColor: getRiskColor(calculateRiskScore())
                  }}
                />
              </div>
              <p className="score-text">
                Risk Level: {getRiskLevel(calculateRiskScore())}
              </p>
            </div>
          )}
        </div>
      )}

      {(strength?.score < 3 || Object.values(personalAnswers).some(answer => answer === true)) && (
        <div className="suggestion-section">
          <p className="weak-message">Your password is weak or potentially compromised</p>
          <button onClick={generateStrongPassword} className="generate-button">
            Generate a Strong Password
          </button>
          {generatedPassword && (
            <div className="generated-password">
              <input
                type="text"
                value={generatedPassword}
                readOnly
                className="generated-input"
              />
              <button onClick={copyToClipboard} className="copy-button">
                Copy
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordEvaluator;
