const request = require("supertest");
const app = require("../server");

let idToDelete = 0;
let vToDelete = 0;

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

const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbTRAZW1haWwuY29tIiwibmFtZSI6IkFkbTQiLCJyb2xlIjoiYWRtIiwia29kYXMiOm51bGwsInJlZ2lvbiI6IjQiLCJpYXQiOjE1NzA5NDI2OTAsImV4cCI6MTU3MTMwMjY5MH0.vL3PWtyNvdEDPIWALtIN8o9ZN6PegEpKPkMUfbNAfXw";

describe("Search items by location", () => {
  it("should return 2 items", async () => {
    const res = await request(app)
      .get("/api/items/search/location")
      .set("Authorization", token)
      .query({ itype: "defect", linija: "1", km: 367 })
      .expect(200)
      .expect(isArray(2));
  });
});

describe("Search items by location", () => {
  it("should return: no items", async () => {
    const res = await request(app)
      .get("/api/items/search/location")
      .set("Authorization", token)
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
      .set("Authorization", token)
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
      .set("Authorization", token)
      .query({ linija: "17", km: 106 })
      .expect(400)
      .expect(notIsArray)
      .expect(hasMsg("no collection: undefined"));
    expect(res.body.ok).toBe(0);
    expect(res.body.reason).toBe("bad criteria");
  });
});

describe("Search items by location", () => {
  it("should return no collection", async () => {
    const res = await request(app)
      .get("/api/items/search/location")
      .set("Authorization", token)
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
      .set("Authorization", token)
      .query({ itype: "defect" })
      .expect(200)
      .expect(isArray(2207))
  });
});

describe("Fetch all items", () => {
  it("should return all items", async () => {
    const res = await request(app)
      .get("/api/items")
      .set("Authorization", token)
      .query({ itype: "defect", all: 1 })
      .expect(200)
      .expect(isArray(15027))
  });
});

describe("Update item", () => {
  it("should return success", async () => {
    const res = await request(app)
      .post("/api/items/update")
      .set("Authorization", token)
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
      vToDelete = res.body.item.main.v;
      expect(res.body.item.journal.length).toBe(5);
  });
});

describe("Update item", () => {
  it("should return same place error", async () => {
    const res = await request(app)
      .post("/api/items/update")
      .set("Authorization", token)
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
      expect(res.body.reason).toBe("bad draft");
      expect(res.body.msg.substring(0, 14)).toBe("Šitoje vietoje");
  });
});

describe("Update item", () => {
  it("should return doesn't exist error", async () => {
    const res = await request(app)
      .post("/api/items/update")
      .set("Authorization", token)
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
      .expect(hasMsg("Operacija neatlikta, nes įrašas ištrintas iš db"))
      expect(res.body.reason).toBe("bad criteria");
  });
});

describe("Update item", () => {
  it("should return versions don't match error", async () => {
    const res = await request(app)
      .post("/api/items/update")
      .set("Authorization", token)
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
      .expect(hasMsg("Operacija neatlikta, nes skiriasi versijos; galbūt jis ką tik buvo redaguotas kažkieno kito"))
      expect(res.body.reason).toBe("bad criteria");
  });
});

describe("Update item", () => {
  it("should return validation errors", async () => {
    const res = await request(app)
      .post("/api/items/update")
      .set("Authorization", token)
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
      .set("Authorization", token)
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
      idToDelete = res.body.item.main.id;
      expect(!!res.body.msg).toBe(true);
      expect(res.body.msg.substring(0, 33)).toBe("Įrašas sėkmingai sukurtas, jo id:");
  });
});

describe("Insert item", () => {
  it("should return bad draft 1", async () => {
    const res = await request(app)
      .put("/api/items/insert")
      .set("Authorization", token)
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
      .set("Authorization", token)
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
      .set("Authorization", token)
      .send({
        "main": {"linija": "17", "kelias": "7", "km": 10, "pk": 5, "m": 44, "siule": "0", "meistrija": 12, "kkateg": 5, "btipas": "60E1", "bgamykl": "ENS", "bmetai": 1989, "v": 8},
        "journal": {"insert": [
            {"data": "2019-07-21", "oper": 422, "dtermin": "2019-07-24", "apar": 822, "kodas": "27.2", "dh": 5, "dl": 10, "pavoj": "DP", "note": "mėginimas7"}
          ]}, 
        "itype":"defect"
      })
      .expect(400)
      expect(!!res.body.reason).toBe(true);
      expect(res.body.reason).toBe("bad draft");
      expect(!!res.body.msg).toBe(true);
      expect(res.body.msg.substring(0, 37)).toBe("Šitoje vietoje jau yra įrašas, jo id:");
  });
});

describe("Delete item", () => {
  it("should return success", async () => {
    const res = await request(app)
      .delete("/api/items/delete")
      .set("Authorization", token)
      .query({ itype: "defect", id: idToDelete, v: 0 })
      .expect(200)
  });
});

describe("Delete item", () => {
  it("should return not deleted error (doesn't exist)", async () => {
    const res = await request(app)
      .delete("/api/items/delete")
      .set("Authorization", token)
      .query({ itype: "defect", id: idToDelete, v: 0 })
      .expect(400)
  });
});

describe("Delete item", () => {
  it("should return not deleted error (wrong version)", async () => {
    const res = await request(app)
      .delete("/api/items/delete")
      .set("Authorization", token)
      .query({ itype: "defect", id: 43578, v: vToDelete + 1 })
      .expect(400)
  });
});




describe("Update item unquoted", () => {
  it("should return success", async () => {
    const res = await request(app)
      .post("/api/items/update")
      .set("Authorization", token)
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