const Validator = require('validator');
const isNonStringOrEmpty = require('../utilities/is-empty').isNonStringOrEmpty;

module.exports = function validateLoginInput(data) {
  let errors = {};
  const email = data.email;
  const password = data.password;
  
  if (isNonStringOrEmpty(email)) {
    errors.email = 'email can not be empty';
  }
  
  if (isNonStringOrEmpty(password)) {
    errors.password = 'password can not be empty';
  }
  
  if (!Object.keys(errors).length &&
	  (!Validator.isLength(password, {min: 6, max: 30}) ||
	  !Validator.isLength(email, {min: 5, max: 200}))) {
	  errors.message = 'wrong email or password';
  }

  if (Object.keys(errors).length) return errors;
  return null;
}