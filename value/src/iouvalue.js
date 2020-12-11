/* @flow */

'use strict';

const Value = require('./value').Value;
const XDVValue = require('./xdvvalue').XDVValue;
const GlobalBigNumber = require('bignumber.js');
const BigNumber = GlobalBigNumber.another({
  ROUNDING_MODE: GlobalBigNumber.ROUND_HALF_UP,
  DECIMAL_PLACES: 40
});
const divvyUnits = new BigNumber(1e6);

class IOUValue extends Value {

  constructor(value: string | BigNumber, roundingMode: ?number = null,
  base: ?number = null) {

    super(new BigNumber(value, base).toDigits(16, roundingMode));
  }

  multiply(multiplicand: Value) {
    if (multiplicand instanceof XDVValue) {
      return super.multiply(
        new IOUValue(
          multiplicand._value.times(divvyUnits)));
    }
    return super.multiply(multiplicand);
  }

  divide(divisor: Value) {
    if (divisor instanceof XDVValue) {
      return super.divide(
        new IOUValue(divisor._value.times(divvyUnits)));
    }
    return super.divide(divisor);
  }

  negate() {
    return new IOUValue(this._value.neg());
  }

  _canonicalize(value) {
    if (value.isNaN()) {
      throw new Error('Invalid result');
    }
    return new IOUValue(value.toPrecision(16));
  }

  equals(comparator) {
    return (comparator instanceof IOUValue)
      && this._value.equals(comparator._value);
  }
}

exports.IOUValue = IOUValue;
