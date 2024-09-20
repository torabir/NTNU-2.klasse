export function isLeapYear(year) {
    if (year != null && year >= 0) {
        return (year % 4 === 0) &&
               (year % 100 !==  0) ||
               (year % 400 === 0);
    } else {
        throw new Error('Invalid argument: year must be an integer equal to or larger than 0');
    }
}