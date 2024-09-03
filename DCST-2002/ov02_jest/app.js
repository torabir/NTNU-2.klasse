
export function isLeapYear(year) {
    if(year<0){
        throw new Error('Invalid argument: Year must be an integer equal to or larger than 0.');
    }

    try{
        return (year % 4 === 0) &&
               (year % 100 !==  0) ||
               (year % 400 === 0);
    } catch(e) {
        console.error(e);
    }
}