export default function getInitialState(iTypes, stateObj) {
  let state = {};
  Object.keys(iTypes).forEach(key => state[iTypes[key]] = {...stateObj});
  return state;
}