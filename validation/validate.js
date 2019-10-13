const modelProvider = require("../models/modelProvider");
// parenka kaip konvertuoti duomens į tipą, kuris nurodytas model[prop].type
const converter = {

  string: {
    convert: value => {
      // null, undefined
      if (value == null) return "";
      // object, array, function, class, NaN
      if (value !== value || Object(value) === value)
        throw { message: "bad value" };
      // any primitive
      return value.toString().trim()
    } 
  },

  integer: {
    convert: value => {
      // null, undefined, NaN, object, array, function, class
      if (value == null || value !== value || Object(value) === value)
        throw { message: "value must be an integer" };
      let int = parseInt(value);
      if (isNaN(int))
        throw { message: "value must be an integer" };
      return int;
    }
  },

  number: {
    convert: value => {
      // true, false, '', null, undefined, NaN, object, array, function, class
      if (
        (typeof value !== 'string' && typeof value !== 'number') ||
        (typeof value === 'string' && value.trim() === '')
      )
        throw { message: "value must be a number" };
      let nr = Number(value);
      if (isNaN(nr))
        throw { message: "value must be a number" };
      return nr;
    }
  }
};

// patikrina, ar data yra leistinose ribose - kad nebūtų, pvz. 2019-02-31
function hasDateOverflow(shortDateString) {
  const numbers = shortDateString.split("-").map(num => parseInt(num));
  const data = new Date(shortDateString);
  return (
    numbers[0] !== data.getFullYear() ||
    numbers[1] !== data.getMonth() + 1 ||
    numbers[2] !== data.getDate()
  );
}

// funkcijos, kurios atlieka tikrinimą, ir
// klaidos pranešimai, jeigu tikrinant gaunama true
const validators = {

  isEmptyString: {
    func: value => value.length === 0,
    msg: () => "must be not empty"
  },

  wrongLength: {
    func: (value, params) =>
      value.length < params.min || value.length > params.max,
    msg: params => `length must be ${params.min}-${params.max} characters`
  },

  isNegative: {
    func: value => value < 0,
    msg: () => "must be not negative"
  },

  outOfLimits: {
    func: (value, params) => value < params.min || value > params.max,
    msg: params => `must be ${params.min}-${params.max} `
  },

  isNotYear: {
    func: value => value < 1900,
    msg: () => "must be four-digit year"
  },

  isNotShortDate: {
    func: value => {
      return (
        !/^\d\d\d\d-\d\d-\d\d$/.test(value) ||
        isNaN(Date.parse(value)) ||
        hasDateOverflow(value)
      );
    },
    msg: () => "must be valid date (yyyy-mm-dd)"
  },

  isNeitherEmptyStringNorShortDate: {
    func: value => {
      return (
        value.length > 0 &&
        (!/^\d\d\d\d-\d\d-\d\d$/.test(value) ||
          isNaN(Date.parse(value)) ||
          hasDateOverflow(value))
      );
    },
    msg: () => "must be valid short date (yyyy-mm-dd) or empty"
  },

  isNotInSet: {
    func: (value, set) => {
      //console.log("value, set:", value, set);
      return !set.includes(value);
    },
    msg: (set) => "out of allowed values set: " + set
  }
};

function emptyValue(val) {
  // null, undefined or ''
  return (
    val == null || val === ''
  );
}

function validateProp(key, draft, model, insert) {
  // Garantuotai model turi šitą key.
  // Jeigu insert, tai key yra iš model.
  // Jeigu update, tai key yra iš draft.

  // patikrina ar prop/prop reikšmė yra apskritai
  // jeigu insert, tai required prop reikšmė yra privaloma
  if (model[key].required) { // jeigu privalomas
    if ( // draft neturi (kai insert) arba turi tuščią (ir insert, ir update)
      (!draft.hasOwnProperty(key) && insert) ||
      (draft.hasOwnProperty(key) && emptyValue(draft[key]))
    ) {
      return {error: "is required"};
    }
  } else { // jeigu nėra privalomas
    if (!draft.hasOwnProperty(key)) { // ir jeigu draft neturi
      return null;
    }
  }

  // mėgina konvertuoti
  // grąžina {value: dfasdf} arba {error: dfasdfa}
  let value;
  try {
    value = converter[model[key].type].convert(draft[key]);
  } catch (err) { 
    return {error: err.message};
  }

  // tikrina pagal modelyje nurodytą validatorių
  // jeigu validatorius nenurodytas - netikrina
  //console.log("key, model.key", key, model[key]);
  if (model[key].validator) {
    const validator = validators[model[key].validator];
    const params = model[key].params;
    if (validator.func(value, params)) {
      return  {error: validator.msg(params)};
    }
  }

  return {value};
}

/**
  @desc Patikrina item part - main arba journal. 
  @return Grąžina {draft: normalizuotą objektą} 
  arba errors - [{key: keyname, id: draftid, msg: error message}]
 */
function validateItemPart(draft, model, insert) {
  let errors = [];
  let normalized = {};
  // Kai insert - visi required laukai turi būti drafte.
  // Kai update - required laukas negali būti paverstas tuščiu.
  // Jeigu insert - tikrinama pagal model. Čia tam, kad būtų patikrinti
  // visi privalomi laukai - ar jie yra drafte.
  // Jeigu update - tikrinama pagal draft.
  const keys = insert ? Object.keys(model) : Object.keys(draft);
  keys.forEach(key => {
    if (!model[key]) return; // išmetami tie laukai, kurių nėra modelyje
    const result = validateProp(key, draft, model, insert);
    if (result) {
      if (result.error) {
        errors.push({
          key, 
          id: draft.id, 
          msg: result.error
        });
      } else {
        normalized[key] = result.value;
      }      
    }
  });
  
  if (errors.length) return {errors};
  return {draft: normalized};
}

/**
  @desc Patikrina visą objektą, kuriame yra šios dalys:
  main - {... visos main props}
  journal - {
    insert: [{... journal, kuriuos reikia insert}],
    update: [{... journal, kuriuos reikia update}],
    delete: [... journal ids, kuriuos reikia delete]
  }
  @return Grąžina {item: normalizuotą objektą, tos pačios struktūros, kokį gavo} 
  arba errors - [{key: keyname, id: draftid, msg: error message}]
 */
function validateItem(main, journal, itype, insert) {
  let allErrors = [];
  let resultItem = {
    main: null,
    journal: {
      insert: [],
      update: [],
      delete: (journal && journal.delete ? journal.delete : [])
    }
  };
  let result;
  const mainModel = modelProvider[itype].main;
  const journalModel = modelProvider[itype].journal;

  result = validateItemPart(main, mainModel, insert);
  if (result.errors) {
    allErrors.push(result.errors);
  } else {
    resultItem.main = result.draft;
  }
  

  journal && journal.insert && journal.insert.forEach(journalItem => {
    result = validateItemPart(journalItem, journalModel, true);    
    if (result.errors) {
      allErrors.push(result.errors);
    } else {
      resultItem.journal.insert.push(result.draft);
    }
  });

  journal && journal.update && journal.update.forEach(journalItem => {
    result = validateItemPart(journalItem, journalModel, false);   
    if (result.errors) {
      allErrors.push(result.errors);
    } else {
      resultItem.journal.update.push(result.draft);
    }
  });
  
  if (allErrors.length) return {errors: [].concat(...allErrors)};
  return {item: resultItem};  
}

/**
  @desc Patikrina visą objektą, kuriame yra šios dalys:
  main - {... visos main props},
  journal - {... visos journal props}
  @return Grąžina {item: normalizuotą objektą, tos pačios struktūros, kokį gavo} 
  arba errors - [{key: keyname, id: main.id, msg: error message}]
 */
function validateItemPair(main, journal, itype, insert, whichPart="both") {
  let allErrors = [];
  let resultItem = {
    main: null,
    journal: null
  };
  let result; // tmp
 
  // validates main
  if (whichPart !== "journal") {
    const mainModel = modelProvider[itype].main;
    result = validateItemPart(main, mainModel, insert);
    if (result.errors) {
      allErrors.push(result.errors);
    } else {
      resultItem.main = result.draft;
    }
  }

  // validates journal
  if (whichPart !== "main") {
    const journalModel = modelProvider[itype].journal;
    result = validateItemPart(journal, journalModel, insert);
    if (result.errors) {
      if (main.id) {
        result.errors.forEach(err => err.id = main.id);
      }
      allErrors.push(result.errors);
    } else {
      resultItem.journal = result.draft;
    }
  }
  
  if (allErrors.length) return {errors: [].concat(...allErrors)}; 
  // (since Edge doesn't support arr.flat())

  return {item: resultItem};  
}






module.exports.converter = converter;
module.exports.validators = validators;
module.exports.hasDateOverflow = hasDateOverflow;
module.exports.emptyValue = emptyValue;

module.exports.validateItem = validateItem;
module.exports.validateItemPart = validateItemPart;
module.exports.validateItemPair = validateItemPair;
