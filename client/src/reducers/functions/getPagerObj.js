const pagerSettings = {
  showPageCount: 3,
  navBase: 10
};


const getPagerObj = (itemsPerPage, itemCount, currPageIndex) => {
  const firstItemIndex = currPageIndex * itemsPerPage;
  const halfOfVisible = Math.floor(pagerSettings.showPageCount / 2);
  const pageCount = Math.ceil(itemCount / itemsPerPage);
  const lastPageIndex = pageCount - 1;
  const pagesRight = pageCount - currPageIndex - 1;
  const pagesLeft = currPageIndex;
  let buttons = [];

  // add current
  buttons.push({
    pageIndex: currPageIndex,
    label: currPageIndex + 1,
    role: "current"
  });

  // add visible left
  let i = 1;
  while (i <= halfOfVisible && currPageIndex - i > 0) {
    buttons.unshift({
      pageIndex: currPageIndex - i,
      label: currPageIndex - i + 1,
      role: "visible-left"
    });
    i++;
  }

  // add visible right
  i = 1;
  while (i <= halfOfVisible && currPageIndex + i < lastPageIndex) {
    buttons.push({
      pageIndex: currPageIndex + i,
      label: currPageIndex + i + 1,
      role: "visible-right"
    });
    i++;
  }

  if (buttons[0].pageIndex > 1) {
    buttons.unshift({
      pageIndex: -1,
      label: "...",
      role: "ellipsis-left"
    });

    // count the highest base of navigation
    let maxShifBase = 0;
    while (Math.pow(pagerSettings.navBase, maxShifBase) <= pagesLeft) {
      maxShifBase++;
    }

    for (i = 0; i < maxShifBase; i++) {
      const shiftedPageIndex = currPageIndex - Math.pow(pagerSettings.navBase, i);
      buttons.unshift({
        pageIndex: shiftedPageIndex,
        label: Array(i + 2).join("<"),
        role: "shift-back"
      });
    }
  }

  if (currPageIndex > 0) {
    buttons.unshift({
      pageIndex: 0,
      label: 1,
      role: "first-page"
    });
  }

  const lastindex = buttons[buttons.length - 1].pageIndex;

  if (lastindex < lastPageIndex - 1) {
    buttons.push({
      pageIndex: -1,
      label: "...",
      role: "ellipsis-right"
    });

    // count the highest base of navigation
    let maxShifBase = 0;
    while (Math.pow(pagerSettings.navBase, maxShifBase) <= pagesRight) {
      maxShifBase++;
    }

    for (i = 0; i < maxShifBase; i++) {
      const shiftedPageIndex = currPageIndex + Math.pow(pagerSettings.navBase, i);
      buttons.push({
        pageIndex: shiftedPageIndex,
        label: Array(i + 2).join(">"),
        role: "shift-forward"
      });
    }
  }

  if (currPageIndex < lastPageIndex) {
    buttons.push({
      pageIndex: lastPageIndex,
      label: lastPageIndex + 1,
      role: "last-page"
    });
  }

  return {
    itemsPerPage,
    currPageIndex,
    firstItemIndex,
    buttons,
  };
}

export default getPagerObj;