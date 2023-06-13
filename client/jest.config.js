module.exports = {
    preset: 'ts-jest',
    transform: {
      '^.+\\.(ts|tsx)?$': 'ts-jest',
      "^.+\\.(js|jsx)$": "babel-jest",
    },
        "moduleNameMapper": {
      "\\.(css|less|sass|scss)$": "<rootDir>/config/CSSStub.js"
    },
    "globals": {
      "window": {}
    }
  };