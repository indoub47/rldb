function trimStrings(data) {
  if (typeof data === 'string') {
    return data.trim();
  }  

  if (typeof data === 'object') {
    if (data.length) {
      return data.map(member => trimStrings(member));
    } else {
      var aCopy = {}
      Object.keys(data).forEach(key => {
        aCopy[key] = trimStrings(data[key]);
      });
      return aCopy;
    }
  }
  return data;
}

module.exports = trimStrings;