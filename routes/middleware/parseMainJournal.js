module.exports = item => {
  let errors = [];
  try {
    item.main = JSON.parse(item.main);
  } catch (err) {
    errors.push(err);
  }
  try {
    item.journal = JSON.parse(item.journal);
  } catch (err) {
    errors.push(err);
  }
  if (errors.length > 0) {
    item.validation = {reason: "JSON.parse", errors}
  }
}