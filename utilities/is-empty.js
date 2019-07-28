const isEmpty = value => 
  value === undefined ||
  value === null ||
  (value.hasOwnProperty('length') && value.length === 0) ||
  (value.constructor === Object && Object.keys(value).length === 0);

module.exports.isEmpty = isEmpty;

const isNonStringOrEmpty = value =>
  typeof value !== 'string' || 
  value.trim().length === 0;

module.exports.isNonStringOrEmpty = isNonStringOrEmpty;
