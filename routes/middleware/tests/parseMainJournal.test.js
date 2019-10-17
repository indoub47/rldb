const parse = require("../parseMainJournal");


const item = {
  main: {
    id: 43578, regbit: 8, linija: "23",
    kelias: "7", km: 10, pk: 5,
    m: 36, siule: "9", meistrija: 11,
    kkateg: 5, btipas: "60E1", bgamykl: "ENS",
    bmetai: 1989, v: 3
  },
  journal: [
    {
      data: "2019-07-21", oper: 422, dtermin: "2019-07-24",
      apar: 822, kodas: "27.2", dh: 5, dl: 10,
      pavoj: "DP", note: "mėginimas7", jid: 1
    },
    {
      data: "2019-07-22", oper: 423, apar: 823,
      kodas: "27.3", dh: 6, dl: 11, pavoj: "DP",
      dtermin: "2019-07-25", note: "mėginimas8", jid: 2
    },
    {
      data: "2019-07-23", oper: 427, apar: 825,
      kodas: "53.1", dh: 10, pavoj: "ID",
      dtermin: "2019-07-24", note: "mėginimas9", jid: 3
    }
  ],
  andsomeshit: [1, "a", true]
};

const goodResult = {
  main: {
    id: 43578, regbit: 8, linija: "23",
    kelias: "7", km: 10, pk: 5, m: 36,
    siule: "9", meistrija: 11, kkateg: 5,
    btipas: "60E1", bgamykl: "ENS", bmetai: 1989,
    v: 3
  },
  journal: [
    {
      data: "2019-07-21", oper: 422, dtermin: "2019-07-24",
      apar: 822, kodas: "27.2", dh: 5, dl: 10,
      pavoj: "DP", note: "mėginimas7", jid: 1
    },
    {
      data: "2019-07-22", oper: 423, apar: 823,
      kodas: "27.3", dh: 6, dl: 11, pavoj: "DP",
      dtermin: "2019-07-25", note: "mėginimas8", jid: 2
    },
    {
      data: "2019-07-23", oper: 427, apar: 825,
      kodas: "53.1", dh: 10, pavoj: "ID",
      dtermin: "2019-07-24", note: "mėginimas9", jid: 3
    }
  ],
  andsomeshit: '[1,"a",true]'
};

const good = {
  main:
    '{"id":43578,"regbit":8,"linija":"23","kelias":"7","km":10,"pk":5,"m":36,"siule":"9","meistrija":11,"kkateg":5,"btipas":"60E1","bgamykl":"ENS","bmetai":1989,"v":3}',
  journal:
    '[{"data":"2019-07-21","oper":422,"dtermin":"2019-07-24","apar":822,"kodas":"27.2","dh":5,"dl":10,"pavoj":"DP","note":"mėginimas7","jid":1},{"data":"2019-07-22","oper":423,"apar":823,"kodas":"27.3","dh":6,"dl":11,"pavoj":"DP","dtermin":"2019-07-25","note":"mėginimas8","jid":2},{"data":"2019-07-23","oper":427,"apar":825,"kodas":"53.1","dh":10,"pavoj":"ID","dtermin":"2019-07-24","note":"mėginimas9","jid":3}]',
  andsomeshit: '[1,"a",true]'
};

const badMain = '{"id":43578,"regbit":8,"linija":"23","kelias":"7","km":10,"pk":5,"m":36,"siule":"9",meistrija":11,"kkateg":5,"btipas":"60E1","bgamykl":"ENS","bmetai":1989,"v":3}';

const badJournal = '[{"data":"2019-07-21","oper":422,"dtermin":"2019-07-24","apar":822,"kodas":"27.2","dh":5,"dl":10,"pavoj":"DP","note":"mėginimas7","jid":1},{"data":"2019-07-22","oper":423,"apar":823,"kodas":"27.3","dh":6,"dl":11,"pavoj":"DP","dtermin":"2019-07-25","note":"mėginimas8,"jid":2},{"data":"2019-07-23","oper":427,"apar":825,"kodas":"53.1","dh":10,"pavoj":"ID","dtermin":"2019-07-24","note":"mėginimas9","jid":3}]';

const badSomeShit = '[1,"a,true]';

test("stringifies object then parses main and journal, returns item, no validation", () => {
  const mj = {
    main: JSON.stringify(item.main),
    journal: JSON.stringify(item.journal),
    andsomeshit: JSON.stringify(item.andsomeshit)
  };

  parse(mj);
  expect.assertions(1);
  expect(mj).toEqual(goodResult);
});

test("parses stringified main and journal, returns item, no validation", () => {
  const mj = good;
  parse(mj);
  expect.assertions(1);
  expect(mj).toEqual(goodResult);
});
/*
test("parses stringified badMain, returns item with validation1", () => {
  const mj = {
    main: badMain,
    journal: good.journal,
    andsomeshit: good.andsomeshit
  };
  parse(mj);
  console.log("mj", mj.validation.errors);
  expect.assertions(6);
  expect(mj.main).toEqual(badMain);
  expect(mj.journal).toEqual(goodResult.journal);
  expect(mj.andsomeshit).toEqual(goodResult.andsomeshit);
  expect(mj.validation).toBeDefined();
  expect(mj.validation.reason).toBe("JSON.parse");
  expect(mj.validation.errors.length).toBe(1);
});

test("parses stringified badJournal, returns item with validation1", () => {
  const mj = {
    main: good.main,
    journal: badJournal,
    andsomeshit: good.andsomeshit
  };
  parse(mj);
  expect.assertions(6);
  expect(mj.main).toEqual(goodResult.main);
  expect(mj.journal).toEqual(badJournal);
  expect(mj.andsomeshit).toEqual(goodResult.andsomeshit);
  expect(mj.validation).toBeDefined();
  expect(mj.validation.reason).toBe("JSON.parse");
  expect(mj.validation.errors.length).toBe(1);
});

test("parses stringified badMainJournal, returns item with validation2", () => {
  const mj = {
    main: badMain,
    journal: badJournal,
    andsomeshit: good.andsomeshit
  };
  parse(mj);
  expect.assertions(6);
  expect(mj.main).toEqual(badMain);
  expect(mj.journal).toEqual(badJournal);
  expect(mj.andsomeshit).toEqual(goodResult.andsomeshit);
  expect(mj.validation).toBeDefined();
  expect(mj.validation.reason).toBe("JSON.parse");
  expect(mj.validation.errors.length).toBe(2);
});
*/
