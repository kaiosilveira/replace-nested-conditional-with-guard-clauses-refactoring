import { payAmount } from './index';

describe('payAmount', () => {
  it('should return 0 when employee is separated', () => {
    const employee = { isSeparated: true };
    expect(payAmount(employee)).toEqual({ amount: 0, reasonCode: 'SEP' });
  });

  it('should return 0 when employee is retired', () => {
    const employee = { isRetired: true };
    expect(payAmount(employee)).toEqual({ amount: 0, reasonCode: 'RET' });
  });

  it('should return amount when employee is not separated or retired', () => {
    const employee = { isSeparated: false, isRetired: false };
    expect(payAmount(employee)).toEqual({ amount: 100, reasonCode: 'OK' });
  });
});
