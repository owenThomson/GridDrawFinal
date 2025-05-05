const { decimalToFraction } = require('../javascript/decimalToFraction');

describe('decimalToFraction', () => {
    test('converts whole numbers correctly', () => {
        expect(decimalToFraction(5.0001)).toBe("5");
    });

    test('converts 0.5 to 1/2', () => {
        expect(decimalToFraction(0.5)).toBe("1/2");
    });

    test('converts 0.25 to 1/4', () => {
        expect(decimalToFraction(0.25)).toBe("1/4");
    });

    test('converts 0.333 to 1/3', () => {
        expect(decimalToFraction(0.333)).toBe("333/1000");
    });

    test('converts 1.75 to 7/4', () => {
        expect(decimalToFraction(1.75)).toBe("7/4");
    });
});
