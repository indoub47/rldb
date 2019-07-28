const converter = require('./validate.js').converter;
const validators = require('./validate.js').validators;
const hasDateOverflow = require('./validate.js').hasDateOverflow;
const emptyValue = require('./validate.js').emptyValue;

// converter

test('converter "string" converts argument to string', () => {
  expect(converter.string.convert(2)).toBe("2");
  expect(converter.string.convert(2)).not.toBe(2);
  expect(converter.string.convert(" 2 ")).toBe("2");
  expect(converter.string.convert(null)).toBe('');
  expect(converter.string.convert(undefined)).toBe('');
  expect(converter.string.convert('')).toBe('');
  expect(converter.string.convert(0)).toBe('0');
  expect(converter.string.convert(true)).toBe('true');
  expect(converter.string.convert(false)).toBe('false');
  expect(() => {converter.string.convert(NaN)}).toThrow();
  expect(() => {converter.string.convert([])}).toThrow();
  expect(() => {converter.string.convert([1])}).toThrow();
  expect(() => {converter.string.convert([1, "2"])}).toThrow();
  expect(() => {converter.string.convert({})}).toThrow();
  expect(() => {converter.string.convert({x: 0})}).toThrow();
  expect(() => {converter.string.convert({a: 1, b: "vienas"})}).toThrow();
  expect(() => {converter.string.convert(() => {})}).toThrow();
  expect(() => {converter.string.convert(class X {})}).toThrow();
});

test('converter "integer" converts argument to int', () => {
  expect(converter.integer.convert("2")).toBe(2);
  expect(converter.integer.convert("2")).not.toBe("2");
  expect(converter.integer.convert(" 2 ")).toBe(2);
  expect(converter.integer.convert(2.1)).toBe(2);
  expect(converter.integer.convert(2.1)).not.toBe(2.1);
  expect(converter.integer.convert(" 2.1 ")).toBe(2);
  expect(() => {converter.integer.convert(" xx ")}).toThrow();
  expect(() => {converter.integer.convert(true)}).toThrow();
  expect(() => {converter.integer.convert(false)}).toThrow();
  expect(() => {converter.integer.convert(null)}).toThrow();
  expect(() => {converter.integer.convert(undefined)}).toThrow();
  expect(() => {converter.integer.convert(NaN)}).toThrow();
  expect(() => {converter.integer.convert([])}).toThrow();
  expect(() => {converter.integer.convert([1])}).toThrow();
  expect(() => {converter.integer.convert([1, "2"])}).toThrow();
  expect(() => {converter.integer.convert({})}).toThrow();
  expect(() => {converter.integer.convert({x: 0})}).toThrow();
  expect(() => {converter.integer.convert({a: 1, b: "vienas"})}).toThrow();
  expect(() => {converter.integer.convert(() => {})}).toThrow();
  expect(() => {converter.integer.convert(() => 0)}).toThrow();
  expect(() => {converter.integer.convert(class X {})}).toThrow();
  expect(() => {converter.integer.convert('')}).toThrow();
  expect(() => {converter.integer.convert(' ')}).toThrow();
});

test('converter "number" converts number-like string to number', () => {
  expect(converter.number.convert("2.01")).toBe(2.01);
  expect(converter.number.convert("2.0")).toBe(2);
  expect(converter.number.convert(" 2.01 ")).toBe(2.01);
  expect(converter.number.convert(" 2.000 ")).toBe(2);
  expect(converter.number.convert(2.1)).toBe(2.1);
  expect(converter.number.convert(2.1)).not.toBe("2.1");
  expect(() => {converter.number.convert(" xx ")}).toThrow();
  expect(() => {converter.number.convert(true)}).toThrow();
  expect(() => {converter.number.convert(false)}).toThrow();
  expect(() => {converter.number.convert(null)}).toThrow();
  expect(() => {converter.number.convert(undefined)}).toThrow();
  expect(() => {converter.number.convert(NaN)}).toThrow();
  expect(() => {converter.number.convert([])}).toThrow();
  expect(() => {converter.number.convert([1])}).toThrow();
  expect(() => {converter.number.convert([1, "2"])}).toThrow();
  expect(() => {converter.number.convert({})}).toThrow();
  expect(() => {converter.number.convert({x: 0})}).toThrow();
  expect(() => {converter.number.convert({a: 1, b: "vienas"})}).toThrow();
  expect(() => {converter.number.convert(() => 0)}).toThrow();
  expect(() => {converter.number.convert(() => {})}).toThrow();
  expect(() => {converter.number.convert(class X {})}).toThrow();
  expect(() => {converter.number.convert('')}).toThrow();
  expect(() => {converter.number.convert(' ')}).toThrow();
});

// validators
// isEmptyString
test('"isEmptyString" validator tests if string is empty', () => {
  expect(validators.isEmptyString.func("")).toBe(true);
  expect(validators.isEmptyString.func("non-empty string")).toBe(false);
});

// wrongLength
test('"wrongLength" validator tests if string length is wrong', () => {
  expect(validators.wrongLength.func("", {min:1, max:5})).toBe(true);
  expect(validators.wrongLength.func(" ", {min:1, max:5})).toBe(false);
  expect(validators.wrongLength.func("1", {min:1, max:5})).toBe(false);
  expect(validators.wrongLength.func("aa", {min:1, max:5})).toBe(false);
  expect(validators.wrongLength.func("aa aa", {min:1, max:5})).toBe(false);
  expect(validators.wrongLength.func("aabaab", {min:1, max:5})).toBe(true);
});

// isNegative
test('"isNegative" validator tests if number is negative', () => {
  expect(validators.isNegative.func(-1)).toBe(true);
  expect(validators.isNegative.func(0)).toBe(false);
  expect(validators.isNegative.func(1)).toBe(false);
  expect(validators.isNegative.func(Number.MAX_SAFE_INTEGER)).toBe(false);
  expect(validators.isNegative.func(Number.MIN_SAFE_INTEGER)).toBe(true);
});

// outOfLimits
test('"outOfLimits" validator tests if number is out of limits', () => {
  expect(validators.outOfLimits.func(-1, {min: -1, max: 5})).toBe(false);
  expect(validators.outOfLimits.func(-2, {min: -1, max: 5})).toBe(true);
  expect(validators.outOfLimits.func(6, {min: -1, max: 5})).toBe(true);
  expect(validators.outOfLimits.func(Number.MAX_SAFE_INTEGER, {min: -1, max: 5})).toBe(true);
  expect(validators.outOfLimits.func(Number.MIN_SAFE_INTEGER, {min: -1, max: 5})).toBe(true);
});

// isNotYear
test('"isNotYear" validator tests if number is less than 1900', () => {
  expect(validators.isNotYear.func(70)).toBe(true);
  expect(validators.isNotYear.func(1970)).toBe(false);
  expect(validators.isNotYear.func(-1999)).toBe(true);
  expect(validators.isNotYear.func(Number.MAX_SAFE_INTEGER)).toBe(false);
  expect(validators.isNotYear.func(Number.MIN_SAFE_INTEGER)).toBe(true);
});

// isNotShortDate
test('"isNotShortDate" validator tests if a string is not yyyy-mm-dd format', () => {
  expect(validators.isNotShortDate.func("70")).toBe(true);
  expect(validators.isNotShortDate.func("1970-2-18")).toBe(true);
  expect(validators.isNotShortDate.func("1970-02-5")).toBe(true);
  expect(validators.isNotShortDate.func("1970-2-5")).toBe(true);
  expect(validators.isNotShortDate.func("970-02-18")).toBe(true);
  expect(validators.isNotShortDate.func("70-02-18")).toBe(true);
  expect(validators.isNotShortDate.func("1970 02 18")).toBe(true);
  expect(validators.isNotShortDate.func("1970.02.18")).toBe(true);
  expect(validators.isNotShortDate.func("1970-x2-18")).toBe(true);
  expect(validators.isNotShortDate.func("1970-02-30")).toBe(true);
  expect(validators.isNotShortDate.func("1970-07-32")).toBe(true);
  expect(validators.isNotShortDate.func("1970-13-15")).toBe(true);
  expect(validators.isNotShortDate.func("")).toBe(true);
  expect(validators.isNotShortDate.func("1970-02-18")).toBe(false);
});

// hasDateOverflow
test('hasDateOverflow tests if a yyyy-mm-dd date string has consistent parts', () => {
  expect(hasDateOverflow("1999-00-12")).toBe(true);
  expect(hasDateOverflow("1999-13-12")).toBe(true);
  expect(hasDateOverflow("1999-02-30")).toBe(true);
  expect(hasDateOverflow("1999-03-32")).toBe(true);
  expect(hasDateOverflow("1999-03-00")).toBe(true);
  expect(hasDateOverflow("1999-12-32")).toBe(true);
  expect(hasDateOverflow("1999-01-00")).toBe(true);
  expect(hasDateOverflow("1999-00-00")).toBe(true);  
  expect(hasDateOverflow("2000-02-29")).toBe(false); 
  expect(hasDateOverflow("2001-04-15")).toBe(false);
});

// isNeitherEmptyStringNorShortDate
test('"isNeitherEmptyStringNorShortDate" validator tests if a string is neither empty string nor "yyyy-mm-dd" format', () => {
  expect(validators.isNeitherEmptyStringNorShortDate.func(" ")).toBe(true);
  expect(validators.isNeitherEmptyStringNorShortDate.func("1970-2-18")).toBe(true);
  expect(validators.isNeitherEmptyStringNorShortDate.func("1970-02-5")).toBe(true);
  expect(validators.isNeitherEmptyStringNorShortDate.func("1970-2-5")).toBe(true);
  expect(validators.isNeitherEmptyStringNorShortDate.func("970-02-18")).toBe(true);
  expect(validators.isNeitherEmptyStringNorShortDate.func("70-02-18")).toBe(true);
  expect(validators.isNeitherEmptyStringNorShortDate.func("1970 02 18")).toBe(true);
  expect(validators.isNeitherEmptyStringNorShortDate.func("1970.02.18")).toBe(true);
  expect(validators.isNeitherEmptyStringNorShortDate.func("1970-x2-18")).toBe(true);
  expect(validators.isNeitherEmptyStringNorShortDate.func("1970-02-30")).toBe(true);
  expect(validators.isNeitherEmptyStringNorShortDate.func("1970-07-32")).toBe(true);
  expect(validators.isNeitherEmptyStringNorShortDate.func("1970-13-15")).toBe(true);
  expect(validators.isNeitherEmptyStringNorShortDate.func("1970-02-18")).toBe(false);
  expect(validators.isNeitherEmptyStringNorShortDate.func("")).toBe(false);
});

// emptyValue
test('emptyValue tests if value is null, undefined or ""', () => {
  expect(emptyValue("")).toBe(true);
  expect(emptyValue(null)).toBe(true);
  expect(emptyValue(undefined)).toBe(true);
  expect(emptyValue()).toBe(true);
  expect(emptyValue(" ")).toBe(false);
  expect(emptyValue("bbz")).toBe(false);
  expect(emptyValue(0)).toBe(false);
  expect(emptyValue([])).toBe(false);  
  expect(emptyValue([''])).toBe(false);  
  expect(emptyValue({})).toBe(false); 
  expect(emptyValue(()=>{})).toBe(false);
  expect(emptyValue(()=>'')).toBe(false);
});


