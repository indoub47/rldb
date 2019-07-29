const absent = (prop, defaultValue='') => prop == null ? defaultValue : prop.toString(); 

const absentMulti = (obj, level1, level2, defaultValue = '') =>
  obj == null || obj[level1] == null || obj[level1][level2] == null
    ? defaultValue
    : obj[level1][level2].toString();

export {absent, absentMulti};
