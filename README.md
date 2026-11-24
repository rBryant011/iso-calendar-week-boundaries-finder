# iso-calendar-week-boundaries-finder

Returns the Monday-to-Sunday date boundaries for a given ISO 8601 week-numbering year and week number.

## Usage

```js
import { isoWeekBoundaries } from 'iso-calendar-week-boundaries-finder';

const { monday, sunday } = isoWeekBoundaries(2023, 1);
console.log(monday.toISOString().slice(0, 10)); // 2023-01-02
console.log(sunday.toISOString().slice(0, 10)); // 2023-01-08
```

The package also exports `isoWeekYear(date)` and `isValidIsoWeek(year, week)`.

## Why this library exists

Converting an ISO week number back to calendar dates is not a one-liner because the ISO week-numbering year does not align with the Gregorian year. Week 1 is the week containing the first Thursday of the year, and a year may have 52 or 53 weeks. This library implements that rule directly, with no dependencies, and throws a `RangeError` for invalid week numbers rather than silently producing a wrong date.

## Awkward edge

Week 53 exists only in some years. Calling `isoWeekBoundaries(2021, 53)` throws a `RangeError` because 2021 has only 52 ISO weeks. Use `isValidIsoWeek` to check before calling if you prefer to avoid exceptions.

## Design notes

The window stores values eagerly rather than keeping running aggregates. Running
sums drift with floating point over long streams, and recomputing from a small
buffer is cheap enough that the drift is not worth the speed.

