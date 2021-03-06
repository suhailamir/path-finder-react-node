// ESLint configuration
// http://eslint.org/docs/user-guide/configuring
module.exports = {
    
    "extends": "airbnb",  
    "parser": "babel-eslint",  
    "env": 
      {    
        "node": true,    
        "es6": true,    
        "browser": true  
      },  
    "rules": 
      {    
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],    
        "implicit-arrow-linebreak": "off",    
        "comma-dangle": "off",    
        "indent": "off",    
        "no-trailing-spaces": "off"  
      }
    
};
