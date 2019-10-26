const request = require("supertest");
const app = require("../server");
const token = require("./token");

function isArray(count) {
  return function(res) {
    // console.log("res.body", res.body);
    if (!Array.isArray(res.body)) {
      throw new Error("is not an array");
    }
    if (res.body.length !== count) {
      throw new Error(
        `wrong length: ${res.body.length} instead of expected ${count}`
      );
    }
  };
}

function notIsArray(res) {
  if (Array.isArray(res.body)) {
    throw new Error("is array when it shouldn't be");
  }
}

function hasMsg(text) {
  return function(res) {
    if (res.body.msg === undefined) {
      throw new Error("has no msg property");
    }
    if (res.body.msg !== text) {
      throw new Error(`wrong msg - "${res.body.msg}" instead of "${text}"`);
    }
  };
}

describe("Search items by location", () => {
  it("should return 2 items", async () => {
    const res = await request(app)
      .get("/api/items/search/location")
      .set("Authorization", token.adm8)
      .query({ itype: "defect", linija: "1", km: 367 })
      .expect(200)
      .expect(isArray(2));
  });
});

describe("Search items by location", () => {
  it("should return: no items", async () => {
    const res = await request(app)
      .get("/api/items/search/location")
      .set("Authorization", token.adm8)
      .query({ itype: "defect", linija: "1", km: 362 })
      .expect(200)
      .expect(notIsArray)
      .expect(hasMsg("Rezultatų nerasta."));
  });
});

describe("Search items by location", () => {
  it("should return: too many items", async () => {
    const res = await request(app)
      .get("/api/items/search/location")
      .set("Authorization", token.adm8)
      .query({ itype: "defect", linija: "17", km: 106 })
      .expect(200)
      .expect(notIsArray)
      .expect(hasMsg("Per daug rezultatų. Siaurinkite užklausą."));
  });
});

describe("Search items by location", () => {
  it("should return no collection", async () => {
    const res = await request(app)
      .get("/api/items/search/location")
      .set("Authorization", token.adm8)
      .query({ linija: "17", km: 106 })
      .expect(400)
      .expect(notIsArray)
      .expect(hasMsg("no collection: undefined"));
    expect(res.body.ok).toBe(0);
    expect(res.body.reason).toBe("no collection");
  });
});

describe("Search items by location", () => {
  it("should return no location", async () => {
    const res = await request(app)
      .get("/api/items/search/location")
      .set("Authorization", token.adm8)
      .query({ itype: "defect" })
      .expect(400)
      .expect(notIsArray)
      .expect(hasMsg("no location"));
    expect(res.body.ok).toBe(undefined);
    expect(res.body.reason).toBe(undefined);
  });
});

describe("Fetch all items", () => {
  it("should return all active items", async () => {
    const res = await request(app)
      .get("/api/items")
      .set("Authorization", token.adm8)
      .query({ itype: "defect" })
      .expect(200)
      .expect(isArray(2207))
  });
});

describe("Fetch all items", () => {
  it("should return all items", async () => {
    const res = await request(app)
      .get("/api/items")
      .set("Authorization", token.adm8)
      .query({ itype: "defect", all: 1 })
      .expect(200)
      .expect(isArray(15027))
  });
});

describe("Update item", () => {
  it("should return success", async () => {
    const res = await request(app)
      .post("/api/items/update")
      .set("Authorization", token.adm8)
      .query({ itype: "defect" })
      .send({
        "main": {"id": 43578, "regbit": 8, "linija": "23", "kelias": "7", "km": 10, "pk": 5, "m": 36, "siule": "9", "meistrija": 11, "kkateg": 5, "btipas": "60E1", "bgamykl": "ENS", "bmetai": 1989, "v": 2},
        "journal": {
          "insert": [
            {"data": "2019-07-21", "oper": 422, "dtermin": "2019-07-24", "apar": 822, "kodas": "27.2", "dh": 5, "dl": 10, "pavoj": "DP", "note": "mėginimas7"},
            {"data": "2019-07-22", "oper": 423, "apar": 823, "kodas": "27.3", "dh": 6, "dl": 11, "pavoj": "DP", "dtermin": "2019-07-25", "note": "mėginimas8"},
            {"data": "2019-07-23", "oper": 427, "apar": 825, "kodas": "53.1", "dh": 10, "pavoj": "ID", "dtermin": "2019-07-24", "note": "mėginimas9"}
          ],
          "update": [
            {
              "jid": 43578,
              "mainid": 43578,
              "data": "2019-07-16",
              "oper": 423,
              "apar": 823,
              "kodas": "27.2",
              "dh": 5,
              "dl": 10,
              "pavoj": "DP",
              "dtermin": "2019-07-18",
              "note": "mėginimas1"
            },
            {
              "jid": 43597,
              "mainid": 43578,
              "data": "2019-07-17",
              "oper": 424,
              "apar": 424,
              "kodas": "27.3",
              "dh": 6,
              "dl": 11,
              "pavoj": "DP",
              "dtermin": "2019-07-20",
              "note": "mėginimas2"
            }
          ],
          "delete": [43588]
        }
      })
      .expect(200)
      .expect(hasMsg("Įrašas sėkmingai redaguotas"));
      expect(res.body.ok).toBe(1);
      expect(res.body.item.journal.length).toBe(5);
  });
});

describe("Update item", () => {
  it("should return same place error", async () => {
    const res = await request(app)
      .post("/api/items/update")
      .set("Authorization", token.adm8)
      .query({ itype: "defect" })
      .send({
        "main": {"id": 43599, "linija": "23", "kelias": "7", "km": 10, "pk": 5, "m": 36, "siule": "9", "bmetai": 1990, "v": 0},
        "journal": {
          "insert": [
          ],
          "update": [
          ],
          "delete": []
        }
      })
      .expect(400)
      expect(res.body.reason).toBe("same place");
      expect(res.body.msg.substring(0, 14)).toBe("Šitoje vietoje");
  });
});

describe("Update item", () => {
  it("should return doesn't exist error", async () => {
    const res = await request(app)
      .post("/api/items/update")
      .set("Authorization", token.adm8)
      .query({ itype: "defect" })
      .send({
        "main": {"id": 43571, "bmetai": 1990, "v": 0},
        "journal": {
          "insert": [
          ],
          "update": [
          ],
          "delete": []
        }
      })
      .expect(404)
      expect(res.body).toEqual({        
        msg: "Operacija neatlikta, nes įrašas ištrintas iš db",
        reason: "not found",
        status: 404
      });
  });
});

describe("Update item", () => {
  it("should return versions don't match error", async () => {
    const res = await request(app)
      .post("/api/items/update")
      .set("Authorization", token.adm8)
      .query({ itype: "defect" })
      .send({
        "main": {"id": 43599, "bmetai": 1990, "v": 1},
        "journal": {
          "insert": [
          ],
          "update": [
          ],
          "delete": []
        }
      })
      .expect(409)
      expect(res.body).toEqual({        
        msg: "Operacija neatlikta, nes skiriasi versijos; galbūt jis ką tik buvo redaguotas kažkieno kito",
        reason: "wrong version",
        status: 409
      });
  });
});

describe("Update item", () => {
  it("should return validation errors", async () => {
    const res = await request(app)
      .post("/api/items/update")
      .set("Authorization", token.adm8)
      .query({ itype: "defect" })
      .send({
        "main": {"id": 43599, "bmetai": "xxx", "v": 0},
        "journal": {
          "insert": [
          ],
          "update": [
          ],
          "delete": []
        }
      })
      .expect(400)
      expect(res.body.msg).toBe(undefined);
      expect(!!res.body.reason).toBe(true);
      expect(res.body.reason).toBe("bad draft");
      expect(!!res.body.errors).toBe(true);
      expect(res.body.errors.length).toBe(1);
      expect(res.body.errors[0].key).toBe("bmetai");
  });
});

describe("Insert item", () => {
  it("should return success", async () => {
    const res = await request(app)
      .put("/api/items/insert")
      .set("Authorization", token.adm8)
      .send({
        "main": {"linija": "17", "kelias": "7", "km": 10, "pk": 5, "m": 44, "siule": "0", "meistrija": 11, "kkateg": 5, "btipas": "60E1", "bgamykl": "ENS", "bmetai": 1989, "v": 8},
        "journal": {"insert": [
            {"data": "2019-07-21", "oper": 422, "dtermin": "2019-07-24", "apar": 822, "kodas": "27.2", "dh": 5, "dl": 10, "pavoj": "DP", "note": "mėginimas7"},
            {"data": "2019-07-22", "oper": 423, "apar": 823, "kodas": "27.3", "dh": 6, "dl": 11, "pavoj": "DP", "dtermin": "2019-07-25", "note": "mėginimas8"},
            {"data": "2019-07-23", "oper": 427, "apar": 825, "kodas": "53.1", "dh": 10, "pavoj": "ID", "dtermin": "2019-07-24", "note": "mėginimas9"}
          ]}, 
        "itype":"defect"
      })
      .expect(200)
      expect(!!res.body.item).toBe(true);
      expect(!!res.body.msg).toBe(true);
      expect(res.body.msg.substring(0, 33)).toBe("Įrašas sėkmingai sukurtas, jo id:");
  });
});

describe("Insert item", () => {
  it("should return bad draft 1", async () => {
    const res = await request(app)
      .put("/api/items/insert")
      .set("Authorization", token.adm8)
      .send({
        "main": {"linija": "17", "kelias": "7", "km": "abc", "pk": -5, "m": true, "siule": "0", "meistrija": 11, "kkateg": 5, "btipas": "60E1", "bgamykl": "ENS", "bmetai": 1989, "v": 8},
        "journal": {"insert": [
            {"data": "2019-07-21", "oper": 422, "dtermin": "2019-07-24", "apar": 822, "kodas": "27.2", "dh": 7, "dl": 10, "pavoj": "DP", "note": "mėginimas7"},
            {"data": "2019-07-22", "oper": 423, "apar": 823, "kodas": "27.3", "dh": 6, "dl": 11, "pavoj": "DP", "dtermin": "2019-07-25", "note": "mėginimas8"},
            {"data": "2019-07-23", "oper": 427, "apar": 825, "kodas": "53.1", "dh": 10, "pavoj": "ID", "dtermin": "2019-07-24", "note": "mėginimas9"}
          ]}, 
        "itype":"defect"
      })
      .expect(400)
      expect(res.body.msg).toBe(undefined);
      expect(!!res.body.reason).toBe(true);
      expect(res.body.reason).toBe("bad draft");
      expect(!!res.body.errors).toBe(true);
      expect(res.body.errors.length).toBe(3);
  });
});


describe("Insert item", () => {
  it("should return bad draft 2", async () => {
    const res = await request(app)
      .put("/api/items/insert")
      .set("Authorization", token.adm8)
      .send({
        "main": {"linija": "17", "kelias": "7", "km": 56, "pk": 5, "m": 12, "siule": "0", "meistrija": 11, "kkateg": 5, "btipas": "60E1", "bgamykl": "ENS", "bmetai": 1989, "v": 8},
        "journal": {"insert": [
            {"data": "2019-07-21", "oper": 422, "dtermin": "2019-07-24", "apar": 822, "kodas": "27.2", "dh": 7, "dl": 10, "pavoj": "DP", "note": "mėginimas7"},
            {"data": "2019-07-22", "oper": 423, "apar": 823, "kodas": "27.3", "dh": 6, "dl": "xxx", "pavoj": "DP", "dtermin": "2019-07-25", "note": "mėginimas8"},
            {"data": "2019-07-23", "oper": 427, "apar": 825, "kodas": "53.1", "dh": 10, "pavoj": "ID", "dtermin": "2019-07-24", "note": "mėginimas9"}
          ]}, 
        "itype":"defect"
      })
      .expect(400)
      expect(res.body.msg).toBe(undefined);
      expect(!!res.body.reason).toBe(true);
      expect(res.body.reason).toBe("bad draft");
      expect(!!res.body.errors).toBe(true);
      expect(res.body.errors.length).toBe(1);
      expect(res.body.errors[0].key).toBe("dl");
  });
});

describe("Insert item", () => {
  it("should return same place error", async () => {
    const res = await request(app)
      .put("/api/items/insert")
      .set("Authorization", token.adm8)
      .send({
        "main": {"linija": "17", "kelias": "1", "km": 104, "pk": 2, "m": 60, "siule": "9", "meistrija": 14, "kkateg": 5, "btipas": "60E1", "bgamykl": "ENS", "bmetai": 1989, "v": 1},
        "journal": {"insert": [
            {"data": "2019-07-21", "oper": 422, "dtermin": "2019-07-24", "apar": 822, "kodas": "27.2", "dh": 5, "dl": 10, "pavoj": "DP", "note": "mėginimas7"}
          ]}, 
        "itype":"defect"
      })
      .expect(400)
      expect(!!res.body.reason).toBe(true);
      expect(res.body.reason).toBe("same place");
      expect(!!res.body.msg).toBe(true);
      expect(res.body.msg.substring(0, 37)).toBe("Šitoje vietoje jau yra įrašas, jo id:");
  });
});

describe("Delete item", () => {
  it("should return success", async () => {
    const res = await request(app)
      .delete("/api/items/delete")
      .set("Authorization", token.adm8)
      .query({ itype: "defect", id: 17048, v: 0 })
      .expect(200)
  });
});

describe("Delete item", () => {
  it("should return not deleted error (doesn't exist)", async () => {
    const res = await request(app)
      .delete("/api/items/delete")
      .set("Authorization", token.adm8)
      .query({ itype: "defect", id: 17050, v: 0 })
      .expect(400)
  });
});

describe("Delete item", () => {
  it("should return not deleted error (wrong version)", async () => {
    const res = await request(app)
      .delete("/api/items/delete")
      .set("Authorization", token.adm8)
      .query({ itype: "defect", id: 17256, v: 2 })
      .expect(400)
  });
});




describe("Update item unquoted", () => {
  it("should return success", async () => {
    const res = await request(app)
      .post("/api/items/update")
      .set("Authorization", token.adm8)
      .query({ itype: "defect" })
      .send({
        main: {id: 43578, regbit: 8, linija: "23", kelias: "7", km: 10, pk: 5, m: 36, siule: "9", meistrija: 11, kkateg: 5, btipas: "60E1", bgamykl: "ENS", bmetai: 1989, v: 3},
        journal: {
          insert: [
            {data: "2019-07-21", oper: 422, dtermin: "2019-07-24", apar: 822, kodas: "27.2", dh: 5, dl: 10, pavoj: "DP", note: "mėginimas7"},
            {data: "2019-07-22", oper: 423, apar: 823, kodas: "27.3", dh: 6, dl: 11, pavoj: "DP", dtermin: "2019-07-25", note: "mėginimas8"},
            {data: "2019-07-23", oper: 427, apar: 825, kodas: "53.1", dh: 10, pavoj: "ID", dtermin: "2019-07-24", note: "mėginimas9"}
          ],
          update: [
            {
              jid: 43578,
              mainid: 43578,
              data: "2019-07-16",
              oper: 423,
              apar: 823,
              kodas: "27.2",
              dh: 5,
              dl: 10,
              pavoj: "DP",
              dtermin: "2019-07-18",
              note: "mėginimas1"
            },
            {
              jid: 43597,
              mainid: 43578,
              data: "2019-07-17",
              oper: 424,
              apar: 424,
              kodas: "27.3",
              dh: 6,
              dl: 11,
              pavoj: "DP",
              dtermin: "2019-07-20",
              note: "mėginimas2"
            }
          ],
          delete: [43588]
        }
      })
      .expect(200)
      .expect(hasMsg("Įrašas sėkmingai redaguotas"));
      expect(res.body.ok).toBe(1);
      vToDelete = res.body.item.main.v;
      expect(res.body.item.journal.length).toBe(8);
  });
});



const objs = require("./operinputObjects");

describe("Supply operinput", () => {
  it("should return 200 ok:1", async () => {
    const res = await request(app)
      .post("/api/operinput/supply")
      .set("Authorization", token.oper8)
      .send({ itype: "defect", input: [
        objs.create.badDraft.badMain,
        objs.create.badDraft.badJournal,
        objs.create.badDraft.badMainJournal,
        objs.create.samePlace,
        objs.create.incomplete.noMain, //skip
        objs.create.incomplete.noMainId, //skip
        objs.create.incomplete.mainIdNotInteger, //skip
        objs.create.incomplete.noJournal, //skip
        objs.create.incomplete.noMainJournal, //skip
        undefined, //skip
        null, //skip
        objs.create.noError,
        objs.modify.badDraft.badMainButOk,
        objs.modify.badDraft.badJournal,
        objs.modify.badDraft.badMainJournal,
        objs.modify.stillExists.nonExists,
        objs.modify.stillExists.differentRegion,
        objs.modify.badVersion.veq0,
        objs.modify.badVersion.vgt0,
        objs.modify.noError
      ]})
      .expect(200)
      expect(res.body.ok).toBe(1);

    
    const res1 = await request(app)
      .get("/api/operinput/count")
      .set("Authorization", token.oper8)
      .query({ itype: "defect"})
      .expect(200)
      expect(res1.body.count).toBe("13");
  });
});


describe("Fetch operinput", () => {
  it("should return 200 ok:1", async () => {
    const res = await request(app)
      .get("/api/operinput/supplied")
      .set("Authorization", token.adm8)
      .query({itype: 'defect'})
      .expect(200);
      expect(res.body.length).toBe(13);
  });
});
