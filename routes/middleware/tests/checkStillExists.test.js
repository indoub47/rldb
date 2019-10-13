const checkStillExists = require('../checkStillExists');
const { Client, Pool } = require("pg");
const pool = new Pool();


test('"checkStillExists" returns object', () => {
  return checkStillExists(pool, "defects", 14, 8)
    .then(data => {
      expect(data.id).toBe(14);
      expect(data.linija).toBe("23");
      expect(data.v).toBe(0);
    });
});

test('"checkStillExists" returns item removed error', () => {
  expect.assertions(3);
  return checkStillExists(pool, "defects", 19, 8)
    .catch(error => {
      expect(error.status).toBe(404);
      expect(error.reason).toBe("bad criteria");
      expect(error.msg).toBe("Operacija neatlikta, nes įrašas ištrintas iš db");
    });
});

test('"checkStillExists" wrong region, returns item removed error', () => {
  expect.assertions(3);
  return checkStillExists(pool, "defects", 15020, 8)
    .catch(error => {
      expect(error.status).toBe(404);
      expect(error.reason).toBe("bad criteria");
      expect(error.msg).toBe("Operacija neatlikta, nes įrašas ištrintas iš db");
    });
});

test('"checkStillExists" wrong table, returns general error', () => {
  expect.assertions(1);
  return checkStillExists(pool, "defectss", 19, 8)
    .catch(error => {
      expect(error.message).toBe('relation "defectss" does not exist');
    });
});