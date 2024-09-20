import {isLeapYear} from './app.js';

describe('A year is a leap year', () => {  
    test.each([1820, 1960, 2020])('Year %i is divisible by 4 but not by 100', (year) => {
        expect(isLeapYear(year)).toBe(true);
    });

    test('Year is divisible by 400', () => {
        expect(isLeapYear(2000)).toBe(true);
    });
});

describe('A year is not a leap year', () => {
    test('Year is not divisible by 4', () => {
        expect(isLeapYear(1981)).toBe(false);
    });

    test('Year is divisible by 100 but not by 400', () => {
        expect(isLeapYear(2100)).toBe(false);
    });
});

describe('A year is not supported', () => { 

    test('Year is negative', () => {
        expect(() => isLeapYear(-2020)).toThrow();
    });

    test.each([null, undefined])('Year is %s', (year) => {
        expect((year) => isLeapYear(year)).toThrow();
    });
});
