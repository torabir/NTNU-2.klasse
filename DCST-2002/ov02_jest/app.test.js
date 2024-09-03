import {isLeapYear} from './app.js';



const leapYears =[1820, 1960, 2020, 2021]
const nonLeapYears = [2011, 2021, 2020]
const negativeNumbers = [-2000, -3200, 2018]

describe('A year is a leap year', () => {   
    // Bruker test.each for å sjekke flere år
    test.each(leapYears)('Year %i is divisible by 4 but not by 100', (year) => {
        expect(isLeapYear(year)).toBe(true);
    });
    
    test('Year 2000 is divisible by 400', () => {
        expect(isLeapYear(2000)).toBe(true);
    });
});

describe('A year is not a leap year', () => {
    test.each(nonLeapYears)('Year is not divisible by 4', (year) => {
        expect(isLeapYear(year)).toBe(false);
    });
    
    test('Year is divisible by 100 but not by 400', () => {
        expect(isLeapYear(2100)).toBe(false);
    });
});

describe('Invalid year input', () => {
    test.each(negativeNumbers)('Year %i is invalid and should throw an error', (year) => {
        expect(() => isLeapYear(year)).toThrow('Invalid argument: year must be an integer equal to or larger than 0.');
    });
});
