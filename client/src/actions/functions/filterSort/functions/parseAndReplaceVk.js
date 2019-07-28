// turi kkk.pp.mm kelio koordinatę paversti metrais
// ir pakeisti tekste
const parseAndReplaceVk = inputText => {
  const regexVk = /\b(\d{1,3})\.(\d{1,2})\.(\d{1,2})\b/g;
  let match, m;
  let replaced = inputText;
  while ((match = regexVk.exec(inputText)) !== null) {
    m =
      parseInt(match[1], 10) * 1000 +
      (parseInt(match[2], 10) - 1) * 100 +
      parseInt(match[3], 10);
    replaced = replaced.replace(match[0], m);
  }
  return replaced;
}


export default parseAndReplaceVk;
