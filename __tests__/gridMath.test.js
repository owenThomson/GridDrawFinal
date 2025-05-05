const { getGridSpacing, getCellSize } = require('../javascript/gridMath');

describe('getGridSpacing', () => {
    test('calculates even grid spacing', () => {
        const result = getGridSpacing(10, 20, 5);
        expect(result.spacingX).toBe(2);
        expect(result.spacingY).toBe(4);
    });

    test('works with decimals', () => {
        const result = getGridSpacing(8.5, 11, 4);
        expect(result.spacingX).toBeCloseTo(2.125);
        expect(result.spacingY).toBeCloseTo(2.75);
    });

    test('throws on zero grid count', () => {
        expect(() => getGridSpacing(10, 10, 0)).toThrow("Grid count must be greater than zero");
    });

    test('returns negative spacing for negative paper sizes', () => {
        const result = getGridSpacing(-8.5, -11, 4);
        expect(result.spacingX).toBeCloseTo(-2.125);
        expect(result.spacingY).toBeCloseTo(-2.75);
    });
});

describe('getCellSize', () => {
    test('returns correct width/height for even division', () => {
        const result = getCellSize(10, 20, 5);
        expect(result.width).toBe(2);
        expect(result.height).toBe(4);
    });

    test('returns decimals accurately', () => {
        const result = getCellSize(8.5, 11, 4);
        expect(result.width).toBeCloseTo(2.125);
        expect(result.height).toBeCloseTo(2.75);
    });
});
