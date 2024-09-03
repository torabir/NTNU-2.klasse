import { isLeapYear } from './app.js';

const leapYears = [1820, 1960, 2020, 2021]; // 2021 er ikke et skuddår, skal feile testen.
const nonLeapYears = [2011, 2021, 2020]; // 2020 er et skuddår
const negativeNumbers = [-2000, -3200, 2018]; // 2018 er ikke negativt
const invalidInputs = [3, null, undefined]; // 3 er et gyldig årstall

describe('A year is a leap year', () => {
    // Bruker test.each for å sjekke flere år. Bruker anonym funksjon () => for å 
    // lage en funksjon som først kalles/kjøres når Jest evaluerer expect. 
    // Dette gir Jest muligheten til å fange opp eventuelle feil som oppdages (kastes) 
    // når funksjonen kjører, og deretter sjekke resultatet av funksjonen.
    test.each(leapYears)('Year %i is divisible by 4 but not by 100', (year) => {
        expect(isLeapYear(year)).toBe(true);
    });

    test('Year 2000 is divisible by 400', () => {
        expect(isLeapYear(2000)).toBe(true);
    });
});

describe('A year is not a leap year', () => {
    test.each(nonLeapYears)('Year %i is not divisible by 4 or is divisible by 100 but not by 400', (year) => {
        expect(isLeapYear(year)).toBe(false);
    });

    test('Year 2100 is divisible by 100 but not by 400', () => {
        expect(isLeapYear(2100)).toBe(false);
    });
});

describe('Invalid year input (A year is not supported)', () => {
    // Test for sjekk av negativt tall:
    test.each(negativeNumbers)('Year %i is invalid and should throw an error', (year) => {
        expect(() => isLeapYear(year)).toThrow('Invalid argument: Year must be an integer equal to or larger than 0.');
    });

    // Test for sjekk av null og undefined:
    test.each(invalidInputs)('Year %s is null or undefined and should throw an error', (year) => {
        expect(() => isLeapYear(year)).toThrow('Invalid argument: Year cannot be null or undefined.');
    });
});
