const web3 = require('./web3');

/**
 *
 * 0xb189b9f0bfce11cedd5bac2284365ab481067d86 =>
 * 0x000000000000000000000000b189b9f0bfce11cedd5bac2284365ab481067d86
 *
 * 10 =>
 * 0x000000000000000000000000000000000000000000000000000000000000000a
 * @param {string|number} number
 */
module.exports.to64Hex= (number) => {
    let hexNumber;
    if (typeof number === 'string' && number.startsWith('0x')) {
        hexNumber = number.slice(2);
    } else {
        hexNumber = number.toString(16); // convert to hex
    }
    return `0x${'0'.repeat(64 - hexNumber.length)}${hexNumber}`;
};

/**
 *
 * '0x00000123' => '0x123'
 * @param {string} hex
 */
module.exports.trimHex = (hex) => {
    return hex.replace(/0x0+/i, '0x')
}

module.exports.toETH = (wei, fixed = 2) => {
   return Number(web3.fromWei(wei, 'ether')).toFixed(fixed);
}
