export function adjustedCapital(anInvestment) {
  if (anInvestment.capital <= 0 || anInvestment.interestRate <= 0 || anInvestment.duration <= 0)
    return 0;
  return (anInvestment.income / anInvestment.duration) * anInvestment.adjustmentFactor;
}
