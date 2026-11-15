/**
 * ISO 8601 week-numbering year and week number to Monday–Sunday boundaries.
 *
 * The ISO week-numbering year differs from the calendar year around January 1
 * and December 31. This module converts a (ISO year, ISO week) pair into the
 * Gregorian date of the Monday that starts the week and the Sunday that ends it.
 *
 * Weeks are numbered 1–52 or 1–53. A week belongs to the ISO year that contains
 * its Thursday. We compute the Monday by starting from the first Thursday of the
 * ISO year and stepping back to Monday, then adding (week - 1) * 7 days.
 */

const MS_PER_DAY = 86400000;

/**
 * Returns the ISO week-numbering year for a given Date.
 *
 * The ISO year is the Gregorian year of the Thursday of the week containing the
 * date. This is the standard definition and avoids the ambiguity at year ends.
 *
 * @param {Date} date - A Date object (interpreted in UTC).
 * @returns {number} The ISO week-numbering year.
 */
export function isoWeekYear(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  // Shift to Thursday of the same week (Monday = 1 ... Sunday = 7)
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  return d.getUTCFullYear();
}

/**
 * Checks whether a given ISO week-numbering year has a week 53.
 *
 * A year has 53 weeks if January 1 is a Thursday, or if it is a leap year and
 * January 1 is a Wednesday. This is the standard rule.
 *
 * @param {number} year - The ISO week-numbering year.
 * @returns {boolean} True if the year has 53 weeks.
 */
function hasWeek53(year) {
  const jan1 = new Date(Date.UTC(year, 0, 1));
  const jan1Day = jan1.getUTCDay() || 7; // 1 = Monday ... 7 = Sunday
  if (jan1Day === 4) return true;
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  return isLeap && jan1Day === 3;
}

/**
 * Validates an ISO week-numbering year and week number.
 *
 * @param {number} year - The ISO week-numbering year.
 * @param {number} week - The ISO week number (1-based).
 * @returns {boolean} True if the pair is valid.
 */
export function isValidIsoWeek(year, week) {
  if (!Number.isInteger(year) || !Number.isInteger(week)) return false;
  if (week < 1) return false;
  const maxWeek = hasWeek53(year) ? 53 : 52;
  return week <= maxWeek;
}

/**
 * Returns the Monday and Sunday dates for a given ISO week.
 *
 * The returned dates are JavaScript Date objects set to midnight UTC on the
 * respective days. The week is defined as Monday through Sunday.
 *
 * @param {number} year - The ISO week-numbering year.
 * @param {number} week - The ISO week number (1-based).
 * @returns {{ monday: Date, sunday: Date }}
 * @throws {RangeError} If the week is not valid for the given year.
 */
export function isoWeekBoundaries(year, week) {
  if (!isValidIsoWeek(year, week)) {
    throw new RangeError(`Invalid ISO week: year=${year}, week=${week}`);
  }

  // Find the first Thursday of the ISO year. January 4 is always in week 1.
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4Day = jan4.getUTCDay() || 7; // 1 = Monday ... 7 = Sunday

  // Monday of week 1 is the Monday on or before January 4.
  const mondayOfWeek1 = new Date(jan4.getTime() - (jan4Day - 1) * MS_PER_DAY);

  // Add (week - 1) weeks to get the Monday of the requested week.
  const monday = new Date(mondayOfWeek1.getTime() + (week - 1) * 7 * MS_PER_DAY);
  const sunday = new Date(monday.getTime() + 6 * MS_PER_DAY);

  return { monday, sunday };
}
