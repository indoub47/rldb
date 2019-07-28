const getDTString = timestamp =>
  new Date(timestamp).toLocaleString("lt-LT").slice(0, -3);

const addSupplied = (obj, oper, timestamp) => ({
  ...obj,
  supplied: { by: oper, when: getDTString(timestamp) }
});

const parseArray = {
  supplied: rec =>
    JSON.parse(rec.input).map(item =>
      addSupplied(item, rec.oper, rec.timestamp)
    ),

  unapproved: rec => JSON.parse(rec.input)
};

const unpack = (data, which) => {
  const getParsedArray = parseArray[which];
  return data.reduce((acc, rec) => acc.concat(getParsedArray(rec)), []);
};

export { unpack };
