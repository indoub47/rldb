const absent = (obj, level1, level2) =>
  obj == null || obj[level1] == null || obj[level1][level2] == null
    ? ""
    : obj[level1][level2].toString();
export default absent;
