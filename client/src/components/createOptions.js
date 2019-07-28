import React from "react";

export const createOptions = (
  arr,
  placeholder,
  displayfunc = x => x.name,
  keyfunc = x => x.id,
  valuefunc = x => x.id
) => {
  // console.log("TESTING: recreating options " + placeholder, arr);
  let options = arr.map(x => (
    <option key={keyfunc(x)} value={valuefunc(x)}>
      {displayfunc(x)}
    </option>
  ));

  if (placeholder != null) {
    options.unshift(
      <option key={"--1"} value=" ">
        {placeholder}
      </option>
    );
  }
  // console.log("option arr", options);
  return options;
};
