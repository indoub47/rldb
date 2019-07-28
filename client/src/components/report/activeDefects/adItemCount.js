export const itemCount = report => {
  return report.reduce(reducer, 0);
}

const reducer = (acc, currentMeistrija) => acc + currentMeistrija.defects.length;