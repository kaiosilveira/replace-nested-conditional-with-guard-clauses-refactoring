export function adjustedCapital(anInvestment) {
  let result = 0;
  if (anInvestment.capital <= 0) return result;
  if (anInvestment.interestRate <= 0 || anInvestment.duration <= 0) return result;
  result = (anInvestment.income / anInvestment.duration) * anInvestment.adjustmentFactor;
  return result;
}
