//import validator from 'validator';
//import isEmpty from './is-empty';

function validateFSQuery(data) {
  return { errors: {}, isValid: true };
  /*
  let errors = {};
  let decimalOptions = {
    locale: 'pl-PL'
  }
  */

  /*
    date,
    action,
    oper,
    apar,
    dl,
    dh,
    kodas,
    pavoj,
    termin,
    pastaba,    
  */

  // čia jovalas ir reikia sutvarkyti
  /*
  if (!isEmpty(data.data) && !validator.isISO8601(data.data)) {
    errors.data = 'date can not be empty and must be valid date';
  } else if (!isEmpty(data.data) && !isEmpty(data.termin) && validator.isAfter(data.data, data.termin)) {
    errors.termin = "defekto panaikinimo terminas turi būti data ir negali būti ankstesnis už radimo terminą";
  }
  
  if (isEmpty(data.action)) {
    errors.action = 'action can not be empty';
  }

  if (!isEmpty(data.dl + '') && !validator.isDecimal(data.dl + '', decimalOptions)) {
    errors.dl = "dL must be decimal or integer"
  }

  if (!isEmpty(data.dh + '') && !validator.isDecimal(data.dh + '', decimalOptions)) {
    errors.dh = "dH must be decimal or integer"
  }

  if (!isEmpty(data.kodas) && !validator.isLength(data.kodas, {min: 4, max: 7})) {
    errors.kodas = "kodas turi būti nuo 3 iki 7 simbolių ilgio (11.1 ... PC.14.2)";
  }

  

  if (!isEmpty(data.pastaba) && !validator.isLength(data.pastaba, {max: 300})) {
    errors.kodas = "pastaba turi būti ne ilgesnė kaip 300 simbolių"
  }

  return {errors, isValid: isEmpty(errors)};
  */
}

export default validateFSQuery;
