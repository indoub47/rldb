const Validator = require("validator");
const isNonStringOrEmpty = require('../utilities/is-empty').isNonStringOrEmpty;

module.exports = function validateRegisterInput(data) {
  let errors = {};
  
  if (isNonStringOrEmpty(data.name)) {
	  errors.name = 'name is required';
  } else if (!Validator.isLength(data.name, {min: 2, max: 30})) {
    errors.name = 'name must be between 2 and 30 characters';
  }
  
  if (isNonStringOrEmpty(data.email)) {
	  errors.email = 'email is required';
  } else {
    if (!Validator.isLength(data.email, {min: 5, max: 200})) {
      errors.email = 'email can not be longer than 200 characters';
    }
    if (!Validator.isEmail(data.email)) {
      errors.email = 'email must be a valid email';
    }
  }  
  
  if (isNonStringOrEmpty(data.role)) {
	  errors.role = 'role is required';
  } else if (!Validator.isIn(data.role, ['dev', 'adm', 'superadm', 'oper', 'viewer'])) {
    errors.role = 'invalid role; allowed roles are: dev, adm, superadm, oper, viewer';
  }  
  
  if (isNonStringOrEmpty(data.region)) {
	  errors.region = 'region is region';
  } else if (!Validator.isIn(data.region, ['1', '2', '3', '4'])) {
    errors.region = 'invalid region; allowed regions are: 1, 2, 3, 4';
  }  
  
  if (isNonStringOrEmpty(data.password)) {
	  errors.password = 'password is required';
  } else if (!Validator.isLength(data.password, {min: 6, max: 30})) {
    errors.password = 'password must be between 6 and 30 characters';
  }  
  
  if (isNonStringOrEmpty(data.password2)) {
	  errors.password2 = 'confirm password is required';
  } else if (!Validator.equals(data.password, data.password2)) {
	  errors.password2 = 'passwords must match';
  }

  if (Object.keys(errors).length) return errors;
  return null;
}