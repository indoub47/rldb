// A function that splits item into main and journal parts
module.exports = (input, model) => {
  let main = {};
  Object.keys(model.main).forEach(key => main[key] = input[key]);

  let journal = {};
  Object.keys(model.journal).forEach(key => journal[key] = input[key]);
  journal.note = "";

  if (input.id > 0) {
    journal.mainid = input.id;
  }

  return { main, journal };
}