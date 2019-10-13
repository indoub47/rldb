const parse = require('../parseMainJournal');

// converter

test('parses main and journal 1, returns stritem item, no validation', () => {
  const item = {
    main: {id: 43578, regbit: 8, linija: "23", kelias: "7", km: 10, pk: 5, m: 36, siule: "9", meistrija: 11, kkateg: 5, btipas: "60E1", bgamykl: "ENS", bmetai: 1989, v: 3},
    journal: [
        {data: "2019-07-21", oper: 422, dtermin: "2019-07-24", apar: 822, kodas: "27.2", dh: 5, dl: 10, pavoj: "DP", note: "mėginimas7", jid: 1},
        {data: "2019-07-22", oper: 423, apar: 823, kodas: "27.3", dh: 6, dl: 11, pavoj: "DP", dtermin: "2019-07-25", note: "mėginimas8", jid: 2},
        {data: "2019-07-23", oper: 427, apar: 825, kodas: "53.1", dh: 10, pavoj: "ID", dtermin: "2019-07-24", note: "mėginimas9", jid: 3}
    ],
    andsomeshit: [1, "a", true]
  };

  const stritem = {
    main: JSON.stringify(item.main), 
    journal: JSON.stringify(item.journal), 
    andsomeshit: JSON.stringify(item.andsomeshit)
  };

  parse(stritem);
  expect(stritem.main).toBeDefined();
  expect(stritem.journal).toBeDefined();
  expect(stritem.andsomeshit).toBeDefined();
  expect(typeof stritem.andsomeshit).toBe("string");
  expect(stritem.validation).toBeUndefined();
  expect(stritem.main.id).toBe(43578);
  expect(stritem.journal.length).toBe(3);
  expect(stritem.journal[1].note).toBe("mėginimas8");
});

test('parses main and journal 2, returns stritem item, no validation', () => {
  const stritem = {
    main: "{id:43578,regbit:8,linija:\"23\",kelias:\"7\",km:10,pk:5,m:36,siule:\"9\",meistrija:11,kkateg:5,btipas:\"60E1\",bgamykl:\"ENS\",bmetai:1989,v:3}",
    journal: "[{data:\"2019-07-21\",oper:422,dtermin:\"2019-07-24\",apar:822,kodas:\"27.2\",dh:5,dl:10,pavoj:\"DP\",note:\"mėginimas7\",jid:1},{data:\"2019-07-22\",oper:423,apar:823,kodas:\"27.3\",dh:6,dl:11,pavoj:\"DP\",dtermin:\"2019-07-25\",note:\"mėginimas8\",jid:2},{data:\"2019-07-23\",oper:427,apar:825,kodas:\"53.1\",dh:10,pavoj:\"ID\",dtermin:\"2019-07-24\",note:\"mėginimas9\",jid:3}]",
    andsomeshit: "[1,\"a\",true]"};
  parse(stritem);
  expect(stritem.main).toBeDefined();
  expect(stritem.journal).toBeDefined();
  expect(stritem.andsomeshit).toBeDefined();
  expect(typeof stritem.andsomeshit).toBe("string");
  expect(stritem.validation).toBeUndefined();
  expect(stritem.main.id).toBe(43578);
  expect(stritem.journal.length).toBe(3);
  expect(stritem.journal[1].note).toBe("mėginimas8");
});
