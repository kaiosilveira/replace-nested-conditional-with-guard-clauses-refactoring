import { adjustedCapital } from '.';

describe('adjustedCapital', () => {
  const anInvestment = {
    capital: 1,
    interestRate: 0.1,
    duration: 1,
    income: 1,
    adjustmentFactor: 1,
  };

  it('should return 0 if capital is less than zero', () => {
    const anInvestmentWithNegativeCapital = { ...anInvestment, capital: -1 };
    expect(adjustedCapital(anInvestmentWithNegativeCapital)).toBe(0);
  });

  it('should return 0 if capital is zero', () => {
    const anInvestmentWithZeroCapital = { ...anInvestment, capital: 0 };
    expect(adjustedCapital(anInvestmentWithZeroCapital)).toBe(0);
  });

  it('should return 0 if interested rate is zero', () => {
    const anInvestmentWithNoInterestRate = { ...anInvestment, interestRate: 0 };
    expect(adjustedCapital(anInvestmentWithNoInterestRate)).toBe(0);
  });

  it('should return 0 if duration is zero', () => {
    const anInvestmentWithNoDuration = { ...anInvestment, duration: 0 };
    expect(adjustedCapital(anInvestmentWithNoDuration)).toBe(0);
  });

  it('should calculate the adjusted capital for an investment', () => {
    expect(adjustedCapital(anInvestment)).toBe(1);
  });
});
