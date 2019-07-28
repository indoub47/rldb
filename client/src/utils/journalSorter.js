const journalSorter = (a, b) => {
    if (a.data > b.data) return 1;
    if (a.data < b.data) return -1;
    if (a.id > b.id) return 1;
    if (a.id < b.id) return -1;
    return 0;
  }

export default journalSorter;