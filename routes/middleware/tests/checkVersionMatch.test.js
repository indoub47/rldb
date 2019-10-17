const checkVersionMatch = require('../checkVersionMatch');

const err = {
        status: 409,
        reason: "bad criteria",
        msg: `Operacija neatlikta, nes skiriasi versijos; galbūt jis ką tik buvo redaguotas kažkieno kito`
      };

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
  expect.assertions(1);

  return checkVersionMatch(2, 1)
    .catch(e => {
      expect(e).toEqual(err);
    });
});

test('checkVersionMatch, 0=1, catches 409 error', () => {
  expect.assertions(1);

  return checkVersionMatch(0, 1)
    .catch(e => {
      expect(e).toEqual(err);
    });
});