const defect = require("./defect");
const loginModel = require("./login");
const welding = require("./welding");

module.exports = {
  defect: {journal: defect.journal, main: defect.main},
  login: loginModel,
  welding: {journal: welding.journal, main: welding.main},
}