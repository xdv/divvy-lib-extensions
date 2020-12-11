/* @flow */

'use strict';

const GlobalBigNumber = require('bignumber.js');
const BigNumber = GlobalBigNumber.another({
  ROUNDING_MODE: GlobalBigNumber.ROUND_HALF_UP,
  DECIMAL_PLACES: 40
});

const Value = require('./value').Value;
const divvyUnits = new BigNumber(1e6);

class XDVValue extends Value {

  constructor(value: string | BigNumber) {
    super(value);
    if (this._value.dp() > 6) {
      throw new Error(
        'Value has more than 6 digits of precision past the decimal point, '
          + 'an IOUValue may be being cast to an XDVValue'
        );
    }
  }

  multiply(multiplicand: Value) {
    if (multiplicand instanceof XDVValue) {
      return super.multiply(
        new XDVValue(multiplicand._value.times(divvyUnits)));
    }
    return super.multiply(multiplicand);
  }

  divide(divisor: Value) {
    if (divisor instanceof XDVValue) {
      return super.divide(
        new XDVValue(divisor._value.times(divvyUnits)));
    }
    return super.divide(divisor);
  }

  negate() {
    return new XDVValue(this._value.neg());
  }

  _canonicalize(value) {
    if (value.isNaN()) {
      throw new Error('Invalid result');
    }
    return new XDVValue(value.round(6, BigNumber.ROUND_DOWN));
  }

  equals(comparator) {
    return (comparator instanceof XDVValue)
      && this._value.equals(comparator._value);
  }
}

exports.XDVValue = XDVValue;
