const request = require("supertest");
const app = require("../server");
const token = require("./token");
const objs = require("./operinputObjects");

describe("Supply operinput", () => {
  it("should return 200ok: 1", async () => {
    const res = await request(app)
      .post("/api/items/operinput/supply")
      .set("Authorization", token)
      .send({ itype: "defect", input: [objs.create.noError, objs.modify.noError]})
      .expect(200)
      expect(res.body.ok).toBe(1);
  });
});