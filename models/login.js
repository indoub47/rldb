module.exports = {
  email: {type: 'string', required: true, validator: "wrongLength", params: {min: 6, max: 255}},
  password: {type: 'string', required: true, validator: "wrongLength", params: {min: 6, max: 16}},
};