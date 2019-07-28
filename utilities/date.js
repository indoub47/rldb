function addToDate(date, years, months, days) {
  let result = new Date(date);
  result.setFullYear(result.getFullYear() + (years || 0));
  result.setMonth(result.getMonth() + (months || 0));
  result.setDate(result.getDate() + (days || 0));
  return result.toISOString().slice(0, 10);
}

module.exports.addToDate = addToDate;