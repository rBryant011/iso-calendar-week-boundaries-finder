import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isoWeekBoundaries, isoWeekYear, isValidIsoWeek } from '../src/index.js';

test('isoWeekBoundaries returns correct Monday and Sunday for a standard week', () => {
  const { monday, sunday } = isoWeekBoundaries(2023, 1);
  assert.equal(monday.toISOString().slice(0, 10), '2023-01-02');
  assert.equal(sunday.toISOString().slice(0, 10), '2023-01-08');
});

test('isoWeekBoundaries handles week 53 in a year that has it', () => {
  const { monday, sunday } = isoWeekBoundaries(2020, 53);
  assert.equal(monday.toISOString().slice(0, 10), '2020-12-28');
  assert.equal(sunday.toISOString().slice(0, 10), '2021-01-03');
});

test('isoWeekBoundaries throws RangeError for week 53 in a year without it', () => {
  assert.throws(() => isoWeekBoundaries(2021, 53), RangeError);
});

test('isoWeekBoundaries throws RangeError for week 0', () => {
  assert.throws(() => isoWeekBoundaries(2023, 0), RangeError);
});

test('isoWeekBoundaries throws RangeError for negative week', () => {
  assert.throws(() => isoWeekBoundaries(2023, -1), RangeError);
});

test('isoWeekBoundaries handles first week of year where Jan 1 is Monday', () => {
  const { monday, sunday } = isoWeekBoundaries(2024, 1);
  assert.equal(monday.toISOString().slice(0, 10), '2024-01-01');
  assert.equal(sunday.toISOString().slice(0, 10), '2024-01-07');
});

test('isoWeekBoundaries handles first week of year where Jan 1 is Thursday', () => {
  const { monday, sunday } = isoWeekBoundaries(2015, 1);
  assert.equal(monday.toISOString().slice(0, 10), '2014-12-29');
  assert.equal(sunday.toISOString().slice(0, 10), '2015-01-04');
});

test('isoWeekBoundaries handles last week of year that spans into next year', () => {
  const { monday, sunday } = isoWeekBoundaries(2019, 52);
  assert.equal(monday.toISOString().slice(0, 10), '2019-12-23');
  assert.equal(sunday.toISOString().slice(0, 10), '2019-12-29');
});

test('isoWeekYear returns the ISO year for dates near year boundaries', () => {
  assert.equal(isoWeekYear(new Date(Date.UTC(2021, 0, 1))), 2020);
  assert.equal(isoWeekYear(new Date(Date.UTC(2021, 0, 3))), 2020);
  assert.equal(isoWeekYear(new Date(Date.UTC(2021, 0, 4))), 2021);
  assert.equal(isoWeekYear(new Date(Date.UTC(2020, 11, 31))), 2020);
  assert.equal(isoWeekYear(new Date(Date.UTC(2021, 11, 31))), 2021);
});

test('isValidIsoWeek returns true for valid weeks', () => {
  assert.equal(isValidIsoWeek(2023, 1), true);
  assert.equal(isValidIsoWeek(2023, 52), true);
  assert.equal(isValidIsoWeek(2020, 53), true);
});

test('isValidIsoWeek returns false for invalid weeks', () => {
  assert.equal(isValidIsoWeek(2023, 0), false);
  assert.equal(isValidIsoWeek(2023, 53), false);
  assert.equal(isValidIsoWeek(2023, 54), false);
  assert.equal(isValidIsoWeek(2021, 53), false);
  assert.equal(isValidIsoWeek(2023, -1), false);
  assert.equal(isValidIsoWeek(2023, 1.5), false);
  assert.equal(isValidIsoWeek(2023.5, 1), false);
});
