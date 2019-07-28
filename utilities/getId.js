const getId = () => (Date.now() - new Date('2018-12-24').getTime() + Math.random()).toString(36).replace('.', '');

module.exports = getId;