import parseAndReplaceVk from "./parseAndReplaceVk";
/**
 * Returns filter function.
 * Takes a raw filter string and an object with field name replacement rules,
 * and returns a filter function which can be used for filtering object list.
 * @param {string} filterString - raw filter field string, may be trimmed.
 * @param {object} fnReplacements - object which keys are field names of
 * the object in the list to be filtered, and values are strings which should
 * be put instead of field names into the filterString.
 * @return {function} a function which takes an object as a parameter and
 * returns a boolean value indicating if the object passes the filter.
 */
export function getFilterFunc(filterString, fnReplacements) {
  if (!filterString || !filterString.trim()) {
    return x => true;
  }

  const filterFuncString =
    "return " + replaceFieldNames(filterString, fnReplacements);
  // console.log("filterFuncString", filterFuncString);
  // eslint-disable-next-line
  return new Function("x", filterFuncString);
}

/**
 * Replaces field names with corresponding object key names in filter string.
 * For the sake of simplicity filter string contains only bare field names of object,
 * which in order to access object field values should be replaced by real paths inside
 * the object ('id === 5' in filter text should be replaced by 'obj["id"] === 5' in filter
 * function text; additionaly, object may be not flat).
 * @param {string} filterString - raw filter field string, may be trimmed.
 * @param {object} fnReplacements - object which keys are field names of
 * the object in the list to be filtered, and values are strings which should
 * be put instead of field names into the filterString.
 * @return {string} a filter string where field names are replaced by real paths inside the object
 */
function replaceFieldNames(filterString, fnReplacements) {
  // replaces a.b.c with a*1000 + (b-1)*100 + z
  let filterText = parseAndReplaceVk(filterString);
  // replaces consecutive spaces, tabs, etc with one space
  // replaces all consecutive "=" with "==="
  filterText = filterText
    .replace(/=+/g, "===")
    .replace(/!=+/g, " !== ")
    .replace(/>=+/g, " >= ")
    .replace(/<=+/g, " <= ")
    //.replace(/===/g, " === ")
    .replace(/<>/g, " !== ")
    .replace(/&+/g, " && ")
    .replace(/\|+/g, " || ")
    .replace(/\s+/g, " ");

  // replaces field names with paths:
  // "fieldName" -> obj["inner_prop"]["fieldName"]
  Object.keys(fnReplacements).forEach(key => {
    const regex = new RegExp("(\\b[\\W]*)(" + key + ")([\\W]*\\b)", "g");
    filterText = filterText.replace(regex, "$1" + fnReplacements[key] + "$3");
  });
  // console.log("filterText", filterText);
  return filterText;
}

// SORTING

/**
 * Returns sorter function.
 * Takes a raw sort string and a function which can replace field names with
 * object values, and returns a sorter function which can be used for sorting
 * object list.
 * @param {string} sortString - raw sort field string, may be trimmed.
 * @param {function} getSortingReplacement - function which takes a field key
 * as a string parameter and returns a function which supplied with object
 * returns a value of corresponding field of that object.
 * @return {function} a sorter function which takes two objects of the same
 * type as a parameters and returns an integer indicating which of those
 * objects goes first in the sort.
 */
export function getSortFunc(sortString, getSortingReplacement) {
  if (!sortString || !sortString.trim()) {
    return (a, b) => 0;
  }

  return fieldSorter(splitString(sortString), getSortingReplacement);
}

/**
 * Splits a string on commas, semicolons or spaces.
 * @param {string} rawString - raw sort field string, may be trimmed.
 * @return {array<string>} an array of field names as strings.
 */
function splitString(rawString) {
  // sukapoja rawString i atskirus lauku pavadinimus
  const re = /[\s,;]/;
  return rawString.split(re).filter(x => x !== "");
}

/**
 * Returns sorter function.
 * Takes an array of object field names as strings and a function which can
 * replace field names with object values, and returns a sorter function
 * which can be used for sorting object list.
 * @param {array<string>} fields - array of object field names.
 * @param {function} fnToValue - function which takes a field key
 * as a string parameter and returns a function which supplied with object
 * returns a value of corresponding field of that object.
 * @return {function} a sorter function which takes two objects of the same
 * type as a parameters and returns an integer indicating which of those
 * objects goes first in the sort.
 */
function fieldSorter(fields, fnToValue) {
  return (a, b) => {
    return fields
      .map(field => {
        let fname = field;
        var dir = 1;
        if (field[0] === "-") {
          dir = -1;
          fname = field.substring(1);
        }
        if (fnToValue(fname, a) > fnToValue(fname, b)) return dir;
        if (fnToValue(fname, a) < fnToValue(fname, b)) return -dir;
        return 0;
      })
      .reduce((p, n) => {
        return p ? p : n;
      }, 0);
  };
}
