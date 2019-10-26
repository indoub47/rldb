const checkSamePlace = require("../checkSamePlace");
const { Client, Pool } = require("pg");
const pool = new Pool();
const config = require("../../../config/collections").defect;

test('"checkSamePlace" - insert resolves to false', () => {
  const main = {
    linija: "1",
    kelias: "1",
    km: 322,
    pk: 8,
    m: 24,
    siule: "0",
    meistrija: "8",
    kkateg: 4,
    btipas: "R65",
    bgamykl: "T",
    bmetai: 1968
  };

  expect.assertions(1);

  return checkSamePlace(pool, config, "insert", main, 8)
    .then(data => {
      expect(data).toBe(false);
    });
});

test('"checkSamePlace" - update resolves to false', () => {
  const main = {
    linija: "1",
    kelias: "1",
    km: 322,
    pk: 8,
    m: 22,
    siule: "0",
    meistrija: "8",
    kkateg: 4,
    btipas: "R65",
    bgamykl: "T",
    bmetai: 1968,
    id: 1224 // šitas id ir yra toje vietoje
  };

  expect.assertions(1);

  return checkSamePlace(pool, config, "update", main, 8)
    .then(data => {
      expect(data).toBe(false);
    });
});

test('"checkSamePlace" - update returns same place error', () => {
  const main = {
    linija: "1",
    kelias: "1",
    km: 322,
    pk: 8,
    m: 22,
    siule: "0",
    meistrija: "8",
    kkateg: 4,
    btipas: "R65",
    bgamykl: "T",
    bmetai: 1968,
    id: 1225 // šitas id yra kitoje vietoje
  };

  expect.assertions(3);

  return checkSamePlace(pool, config, "update", main, 8)
    .catch(error => {
      expect(error.status).toBe(400)
      expect(error.reason).toBe("same place");
      expect(error.msg.substring(0, 29)).toBe("Šitoje vietoje jau yra įrašas");
    });
});

test('"checkSamePlace" - returns same place error', () => {
  const main = {
    linija: "1",
    kelias: "1",
    km: 322,
    pk: 8,
    m: 22,
    siule: "0",
    meistrija: "8",
    kkateg: 4,
    btipas: "R65",
    bgamykl: "T",
    bmetai: 1968
  };

  expect.assertions(3);

  return checkSamePlace(pool, config, "insert", main, 8)
    .catch(error => {
      expect(error.status).toBe(400)
      expect(error.reason).toBe("same place");
      expect(error.msg.substring(0, 29)).toBe("Šitoje vietoje jau yra įrašas");
    });
});

test('"checkSamePlace" - different region, resolves to false', () => {
  const main = {
    linija: "1",
    kelias: "1",
    km: 212,
    pk: 1,
    m: 8,
    siule: "0",
    meistrija: "6",
    kkateg: 2,
    btipas: "R65",
    bgamykl: "EN",
    bmetai: 2012
  };

  expect.assertions(1);
  return checkSamePlace(pool, config, "insert", main, 8)
    .then(data => {
      expect(data).toBe(false);
    });
});

test('"checkSamePlace" - item panaikintas, resolves to false', () => {
  const main = {
    linija: "23",
    kelias: "1",
    km: 50,
    pk: 7,
    m: 50,
    siule: "0",
    meistrija: "11",
    kkateg: 2,
    btipas: "R65",
    bgamykl: "A",
    bmetai: 1994
  };

  expect.assertions(1);
  return checkSamePlace(pool, config, "insert", main, 8)
    .then(data => {
      expect(data).toBe(false);
    });
});