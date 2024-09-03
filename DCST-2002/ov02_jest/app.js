
export function isLeapYear(year) {
    try {
        // Sjekker om year er negativt
        if (year < 0) {
            throw new Error('Invalid argument: Year must be an integer equal to or larger than 0.');
        }
        // Sjekker om year er null eller undefined
        if (year === null || year === undefined) {
            throw new Error('Invalid argument: Year cannot be null or undefined.');
        }
        // Utføres hvis ikke if-setningene oppfylles
        return (year % 4 === 0) &&
               (year % 100 !== 0) ||
               (year % 400 === 0);
    } catch (e) {
        // Logger feilmelding hvis if-setningene oppfylles
        console.error(e.message); // Logger bare feilmeldingen
        throw e; // Kaster hele feilobjektet videre
    }
}
