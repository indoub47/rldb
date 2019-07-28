const isEmpty = value =>
  value === undefined ||
  value === null ||
  (value.hasOwnProperty("length") && value.length === 0) ||
  (value.constructor === Object && Object.keys(value).length === 0);

export default isEmpty;
