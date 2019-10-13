const checkVersionMatch = require('../checkVersionMatch');

test('checkVersionMatch, 1=1, resolves to undefined', () => {
  expect.assertions(1);

  return checkVersionMatch(1, 1)
    .then(data => {
      expect(data).toBe(undefined);
    });
});

test('checkVersionMatch, 0=0, resolves to undefined', () => {
  expect.assertions(1);

  return checkVersionMatch(0, 0)
    .then(data => {
      expect(data).toBe(undefined);
    });
});

test('checkVersionMatch, 15=15, resolves to undefined', () => {
  expect.assertions(1);

  return checkVersionMatch(15, 15)
    .then(data => {
      expect(data).toBe(undefined);
    });
});

test('checkVersionMatch, 2=1, catches 409 error', () => {
  expect.assertions(3);

  return checkVersionMatch(2, 1)
    .catch(e => {
      expect(e.status).toBe(409);
      expect(e.reason).toBe("bad criteria");
      expect(e.msg.substring(0, 42)).toBe("Operacija neatlikta, nes skiriasi versijos");
    });
});

test('checkVersionMatch, 0=1, catches 409 error', () => {
  expect.assertions(3);

  return checkVersionMatch(0, 1)
    .catch(e => {
      expect(e.status).toBe(409);
      expect(e.reason).toBe("bad criteria");
      expect(e.msg.substring(0, 42)).toBe("Operacija neatlikta, nes skiriasi versijos");
    });
});