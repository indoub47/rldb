const getSamePlaceFilter = (draft, userRegion) => {
  const placeProps = [
    "linija", 
    "kelias", 
    "km", 
    "pk", 
    "m", 
    "siule"
  ];

  let filter = {
    $or: [
      { panaikinta: null },
      { panaikinta: 0 },
      { panaikinta: "" },
      { panaikinta: false },
      { panaikinta: "0000-00-00" }
    ],
    region: userRegion
  };

  placeProps.forEach(prop => {
    if (draft.hasOwnProperty(prop)) {
      filter[prop] = draft[prop];
    }
  });

  return filter;
}

const getSamePlaceFilter = (draft, regionbit) => {
  const placeProps = [
    "linija", 
    "kelias", 
    "km", 
    "pk", 
    "m", 
    "siule"
  ];

  let filter = {
    $or: [
      { panaikinta: null },
      { panaikinta: 0 },
      { panaikinta: "" },
      { panaikinta: false },
      { panaikinta: "0000-00-00" }
    ],
    region: userRegion
  };

  placeProps.forEach(prop => {
    if (draft.hasOwnProperty(prop)) {
      filter[prop] = draft[prop];
    }
  });


  return filter;
}

module.exports = getSamePlaceFilter;