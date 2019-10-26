const validateSupplied = require('../validateSupplied');
const { Pool } = require("pg");
const pool = new Pool();
const config = require("../../../config/collections").defect;
const rb = 8;
const objects = require("./operinputObjects");


test('"validateSupplied.toCreate" - bad main', () => {
  let obj = objects.create.badDraft.badMain;
  expect.assertions(4);
  return validateSupplied.toCreate(obj, rb, config, pool).then(() => {
    expect(obj.validation).toBeDefined();
    expect(obj.validation.reason).toBe("bad draft");
    expect(obj.validation.errors).toBeDefined();
    expect(obj.validation.errors.length).toBe(2);
  });
});

test('"validateSupplied.toCreate" - bad journal', () => {
  let obj = objects.create.badDraft.badJournal;
  expect.assertions(4);
  return validateSupplied.toCreate(obj, rb, config, pool).then(() => {
    expect(obj.validation).toBeDefined();
    expect(obj.validation.reason).toBe("bad draft");
    expect(obj.validation.errors).toBeDefined();
    expect(obj.validation.errors.length).toBe(3);
  });
});

test('"validateSupplied.toCreate" - bad main and journal', () => {
  let obj = objects.create.badDraft.badMainJournal;
  expect.assertions(4);
  return validateSupplied.toCreate(obj, rb, config, pool).then(() => {
    expect(obj.validation).toBeDefined();
    expect(obj.validation.reason).toBe("bad draft");
    expect(obj.validation.errors).toBeDefined();
    expect(obj.validation.errors.length).toBe(6);
  });
});

test('"validateSupplied.toCreate" - same place', () => {
  let obj = objects.create.samePlace;
  expect.assertions(5);
  return validateSupplied.toCreate(obj, rb, config, pool).then(() => {
    expect(obj.validation).toBeDefined();
    expect(obj.validation.reason).toBe("same place");
    expect(obj.validation.errors).toBeDefined();
    expect(obj.validation.errors.length).toBe(1);
    expect(obj.validation.errors[0].substring(0, 29)).toBe("Šitoje vietoje jau yra įrašas");
  });
});

test('"validateSupplied.toCreate" - no error', () => {
  let obj = objects.create.noError;
  expect.assertions(3);
  return validateSupplied.toCreate(obj, rb, config, pool).then(() => {
    expect(obj.validation).toBeUndefined();
    expect(obj.main).toBeDefined();
    expect(obj.journal).toBeDefined();
  });
});



test('"validateSupplied.toModify" - bad main but ok', () => {
  let obj = objects.modify.badDraft.badMainButOk;
  expect.assertions(3);
  return validateSupplied.toModify(obj, rb, config, pool).then(() => {
    expect(obj.validation).toBeUndefined();
    expect(obj.main).toBeDefined();
    expect(obj.journal).toBeDefined();
  });
});

test('"validateSupplied.toModify" - bad journal', () => {
  let obj = objects.modify.badDraft.badJournal;
  expect.assertions(4);
  return validateSupplied.toModify(obj, rb, config, pool).then(() => {
    expect(obj.validation).toBeDefined();
    expect(obj.validation.reason).toBe("bad draft");
    expect(obj.validation.errors).toBeDefined();
    expect(obj.validation.errors.length).toBe(3);
  });
});

test('"validateSupplied.toModify" - bad main and journal', () => {
  let obj = objects.modify.badDraft.badMainJournal;
  expect.assertions(4);
  return validateSupplied.toModify(obj, rb, config, pool).then(() => {
    expect(obj.validation).toBeDefined();
    expect(obj.validation.reason).toBe("bad draft");
    expect(obj.validation.errors).toBeDefined();
    expect(obj.validation.errors.length).toBe(4);
  });
});

test('"validateSupplied.toModify" - non exists', () => {
  let obj = objects.modify.stillExists.nonExists;
  expect.assertions(3);
  return validateSupplied.toModify(obj, rb, config, pool).then(() => {
    expect(obj.validation).toBeDefined();
    expect(obj.validation.reason).toBe("not found");
    expect(obj.validation.errors).toEqual(["Operacija neatlikta, nes įrašas ištrintas iš db"]);
  });
});

test('"validateSupplied.toModify" - different region', () => {
  let obj = objects.modify.stillExists.differentRegion;
  expect.assertions(3);
  return validateSupplied.toModify(obj, rb, config, pool).then(() => {
    expect(obj.validation).toBeDefined();
    expect(obj.validation.reason).toBe("not found");
    expect(obj.validation.errors).toEqual(["Operacija neatlikta, nes įrašas ištrintas iš db"]);
  });
});

test('"validateSupplied.toModify" - bad version v_eq_0', () => {
  let obj = objects.modify.badVersion.veq0;
  expect.assertions(3);
  return validateSupplied.toModify(obj, rb, config, pool).then(() => {
    expect(obj.validation).toBeDefined();
    expect(obj.validation.reason).toBe("wrong version");
    expect(obj.validation.errors).toEqual(["Operacija neatlikta, nes skiriasi versijos; galbūt jis ką tik buvo redaguotas kažkieno kito"]);
  });
});

test('"validateSupplied.toModify" - bad version v_gt_0', () => {
  let obj = objects.modify.badVersion.vgt0;
  expect.assertions(3);
  return validateSupplied.toModify(obj, rb, config, pool).then(() => {
    expect(obj.validation).toBeDefined();
    expect(obj.validation.reason).toBe("wrong version");
    expect(obj.validation.errors).toEqual(["Operacija neatlikta, nes skiriasi versijos; galbūt jis ką tik buvo redaguotas kažkieno kito"]);
  });
});

test('"validateSupplied.toModify" - no error', () => {
  let obj = objects.modify.noError;
  expect.assertions(3);
  return validateSupplied.toModify(obj, rb, config, pool).then(() => {
    expect(obj.validation).toBeUndefined();
    expect(obj.main).toBeDefined();
    expect(obj.journal).toBeDefined();
  });
});