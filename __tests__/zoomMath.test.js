const { sliderValueToZoom, computeZoomScale } = require('../javascript/zoomMath');

describe('sliderValueToZoom', () => {
    test('returns 1x at slider = 0', () => {
        expect(sliderValueToZoom(0)).toBe(1);
    });

    test('returns 3x at slider = 100', () => {
        expect(sliderValueToZoom(100)).toBe(3);
    });

    test('returns 2x at slider = 50', () => {
        expect(sliderValueToZoom(50)).toBe(2);
    });

    test('works with custom min/max', () => {
        expect(sliderValueToZoom(50, 2, 6)).toBe(4);
    });
});


describe('computeZoomScale', () => {
    test('returns 1.0 for sliderValue 0', () => {
        expect(computeZoomScale(0)).toBe(1.0);
    });

    test('returns max zoom for sliderValue 100 and gridSize 3', () => {
        expect(computeZoomScale(100)).toBe(3.0);
    });

    test('returns midpoint zoom for sliderValue 50', () => {
        expect(computeZoomScale(50)).toBe(2.0);
    });
});



