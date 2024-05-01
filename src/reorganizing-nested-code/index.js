export function payAmount(employee) {
  let result;
  if (employee.isSeparated) return { amount: 0, reasonCode: 'SEP' };
  if (employee.isRetired) return { amount: 0, reasonCode: 'RET' };
  // potentially complicated logic to compute amount
  result = someFinalComputation();
  return result;
}

function someFinalComputation() {
  return { amount: 100, reasonCode: 'OK' };
}
