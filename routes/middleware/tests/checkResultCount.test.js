const checkResultCount = require('../checkResultCount');

const serverError = {
        status: 500,
        reason: "wrong count",
        msg: `Serverio klaida`
      }

test('checkResultCount.single, 1=1, resolves to result', () => {
  const result = {
    qualifier: "bbz",
    rowCount: 1
  };

  expect.assertions(1);

  return checkResultCount.single(result, 1)
    .then(data => {
      expect(data).toEqual(result);
    });
});

test('checkResultCount.single, 0=0, resolves to result', () => {
  const result = {
    qualifier: "bbz",
    rowCount: 0
  };

  expect.assertions(1);

  return checkResultCount.single(result, 0)
    .then(data => {
      expect(data).toEqual(result);
    });
});

test('checkResultCount.single, 1=undefined, resolves to result', () => {
  const result = {
    qualifier: "bbz",
    rowCount: 1
  };

  expect.assertions(1);

  return checkResultCount.single(result)
    .then(data => {
      expect(data).toEqual(result);
    });
});

test('checkResultCount.single, 10=10, resolves to result', () => {
  const result = {
    qualifier: "bbz",
    rowCount: 10
  };

  expect.assertions(1);

  return checkResultCount.single(result, 10)
    .then(data => {
      expect(data).toEqual(result);
    });
});

test('checkResultCount.single, 2=1, catches server error', () => {
  const result = {
    qualifier: "bbz",
    rowCount: 2
  };

  expect.assertions(1);

  return checkResultCount.single(result, 1)
    .catch(e => {
      expect(e).toEqual(serverError);
    });
});

test('checkResultCount.single, 2=undefined, catches server error', () => {
  const result = {
    qualifier: "bbz",
    rowCount: 2
  };

  expect.assertions(1);

  return checkResultCount.single(result)
    .catch(e => {
      expect(e).toEqual(serverError);
    });
});

test('checkResultCount.single, 0=undefined, catches server error', () => {
  const result = {
    qualifier: "bbz",
    rowCount: 0
  };

  expect.assertions(1);

  return checkResultCount.single(result)
    .catch(e => {
      expect(e).toEqual(serverError);
    });
});

test('checkResultCount.single, 10=15, catches server error', () => {
  const result = {
    qualifier: "bbz",
    rowCount: 10
  };

  expect.assertions(1);

  return checkResultCount.single(result, 15)
    .catch(e => {
      expect(e).toEqual(serverError);
    });
});

test('checkResultCount.multi, 1,1,2=4, resolves to result', () => {
  const result = [
    {qualifier: "bbz1", rowCount: 1},
    {qualifier: "bbz2", rowCount: 1},
    {qualifier: "bbz3", rowCount: 2},
  ];

  expect.assertions(1);

  return checkResultCount.multi(result, 4)
    .then(data => {
      expect(data).toEqual(result);
    });
});

test('checkResultCount.multi, 3=3, resolves to result', () => {
  const result = [
    {qualifier: "bbz1", rowCount: 3}
  ];

  expect.assertions(1);

  return checkResultCount.multi(result, 3)
    .then(data => {
      expect(data).toEqual(result);
    });
});

test('checkResultCount.multi, 0=0, resolves to result', () => {
  const result = [];

  expect.assertions(1);

  return checkResultCount.multi(result, 0)
    .then(data => {
      expect(data).toEqual(result);
    });
});

test('checkResultCount.multi, 1,1,2=3, catches server error', () => {
  const result = [
    {qualifier: "bbz1", rowCount: 1},
    {qualifier: "bbz2", rowCount: 1},
    {qualifier: "bbz3", rowCount: 2},
  ];

  expect.assertions(1);

  return checkResultCount.multi(result, 3)
    .catch(e => {
      expect(e).toEqual(serverError);
    });
});

test('checkResultCount.multi, 3=2, catches server error', () => {
  const result = [
    {qualifier: "bbz1", rowCount: 3}
  ];

  expect.assertions(1);

  return checkResultCount.multi(result, 2)
    .catch(e => {
      expect(e).toEqual(serverError);
    });
});

test('checkResultCount.multi, 0=2, catches server error', () => {
  const result = [];

  expect.assertions(1);

  return checkResultCount.multi(result, 2)
    .catch(e => {
      expect(e).toEqual(serverError);
    });
});

test('checkResultCount.multi, 0=undefined, catches server error', () => {
  const result = [];

  expect.assertions(1);

  return checkResultCount.multi(result)
    .catch(e => {
      expect(e).toEqual(serverError);
    });
});

test('checkResultCount.multi, 1=undefined, catches server error', () => {
  const result = [
    {qualifier: "bbz1", rowCount: 1}
  ];

  expect.assertions(1);

  return checkResultCount.multi(result)
    .catch(e => {
      expect(e).toEqual(serverError);
    });
});

test('checkResultCount.multi, 3=undefined, catches server error', () => {
  const result = [
    {qualifier: "bbz1", rowCount: 3}
  ];

  expect.assertions(1);

  return checkResultCount.multi(result)
    .catch(e => {
      expect(e).toEqual(serverError);
    });
});

test('checkResultCount.multi, 0,0,0=undefined, catches server error', () => {
  const result = [
    {qualifier: "bbz1", rowCount: 0},
    {qualifier: "bbz2", rowCount: 0},
    {qualifier: "bbz3", rowCount: 0}
  ];

  expect.assertions(1);

  return checkResultCount.multi(result)
    .catch(e => {
      expect(e).toEqual(serverError);
    });
});


