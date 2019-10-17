const checkStillExists = require("../checkStillExists");
const { Client, Pool } = require("pg");
const pool = new Pool();

const err = {
  status: 404,
  reason: "bad criteria",
  msg: `Operacija neatlikta, nes įrašas ištrintas iš db`
};

test('"checkStillExists" returns object', () => {
  expect.assertions(3);
  return checkStillExists(pool, "defects", 14, 8).then(data => {
    expect(data.id).toBe(14);
    expect(data.linija).toBe("23");
    expect(data.v).toBe(0);
  });
});

test('"checkStillExists" object is inactive, returns object', () => {
  expect.assertions(3);
  return checkStillExists(pool, "defects", 43580, 8).then(data => {
    expect(data.id).toBe(43580);
    expect(data.linija).toBe("22");
    expect(data.v).toBe(0);
  });
});

test('"checkStillExists" returns item removed error', () => {
  expect.assertions(1);
  return checkStillExists(pool, "defects", 19, 8).catch(error => {
    expect(error).toEqual(err);
  });
});

test('"checkStillExists" wrong region, returns item removed error', () => {
  expect.assertions(1);
  return checkStillExists(pool, "defects", 15020, 8).catch(error => {
    expect(error).toEqual(err);
  });
});

test('"checkStillExists" wrong table, returns general error', () => {
  expect.assertions(1);
  return checkStillExists(pool, "defectss", 19, 8).catch(error => {
    expect(error.message).toBe('relation "defectss" does not exist');
  });
});
