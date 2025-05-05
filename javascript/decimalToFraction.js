function decimalToFraction(decimal) {
    if (Math.abs(decimal - Math.round(decimal)) < 0.001) {
        return Math.round(decimal).toString();
    }

    const tolerance = 1.0E-6;
    let h1 = 1, h2 = 0;
    let k1 = 0, k2 = 1;
    let b = decimal;

    do {
        const a = Math.floor(b);
        const aux = h1;
        h1 = a * h1 + h2;
        h2 = aux;
        const aux2 = k1;
        k1 = a * k1 + k2;
        k2 = aux2;
        b = 1 / (b - a);
    } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);

    return `${h1}/${k1}`;
}

module.exports = { decimalToFraction };
