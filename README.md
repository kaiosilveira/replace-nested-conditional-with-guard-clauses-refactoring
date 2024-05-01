[![Continuous Integration](https://github.com/kaiosilveira/replace-nested-conditional-with-guard-clauses-refactoring/actions/workflows/ci.yml/badge.svg)](https://github.com/kaiosilveira/replace-nested-conditional-with-guard-clauses-refactoring/actions/workflows/ci.yml)

ℹ️ _This repository is part of my Refactoring catalog based on Fowler's book with the same title. Please see [kaiosilveira/refactoring](https://github.com/kaiosilveira/refactoring) for more details._

---

# Replace Nested Conditional With Guard Clauses

<table>
<thead>
<th>Before</th>
<th>After</th>
</thead>
<tbody>
<tr>
<td>

```javascript
function getPayAmount() {
  let result;
  if (isDead) result = deadAmount();
  else {
    if (isSeparated) result = separatedAmount();
    else {
      if (isRetired) result = retiredAmount();
      else result = normalPayAmount();
    }
  }
  return result;
}
```

</td>

<td>

```javascript
function getPayAmount() {
  if (isDead) return deadAmount();
  if (isSeparated) return separatedAmount();
  if (isRetired) return retiredAmount();
  return normalPayAmount();
}
```

</td>
</tr>
</tbody>
</table>

Coding in the real world is complicated: we have several rules to evaluate, ranges to check, and invariants to protect. With all of that, it's easy to let ourselves get carried away by the validations and edge cases and forget about the real goal of a piece of code. This refactoring helps in recovering from these cases.

## Working examples

In the book, Fowler provides us with two examples: one related to reorganizing nested conditionals so the code reads better, and another one that involves reversing conditions so the main piece of computation is more clearly stated.

### Reorganizing nested code

For this example, we have a `payAmoount` function, that should calculate the salary of an employee based on some information, such as whether or not s/he is separated or retired. The code looks like this:

```javascript
export function payAmount(employee) {
  let result;
  if (employee.isSeparated) {
    result = { amount: 0, reasonCode: 'SEP' };
  } else {
    if (employee.isRetired) {
      result = { amount: 0, reasonCode: 'RET' };
    } else {
      // potentially complicated logic to compute amount
      result = someFinalComputation();
    }
  }
  return result;
}
```

Our goal is to remove all this nesting and make the code clearer.

#### Test suite

Our supporting test suite cover all possible bifurcations:

```javascript
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
```

And with that in place, we're safe to go.

#### Steps

We can start by breaking the if statement chain on its first statement, early returning if `isSeparated` evaluates to true:

```diff
+++ b/src/reorganizing-nested-code/index.js
@@ -1,14 +1,11 @@
 export function payAmount(employee) {
   let result;
-  if (employee.isSeparated) {
-    result = { amount: 0, reasonCode: 'SEP' };
+  if (employee.isSeparated) return { amount: 0, reasonCode: 'SEP' };
+  if (employee.isRetired) {
+    result = { amount: 0, reasonCode: 'RET' };
   } else {
-    if (employee.isRetired) {
-      result = { amount: 0, reasonCode: 'RET' };
-    } else {
-      // potentially complicated logic to compute amount
-      result = someFinalComputation();
-    }
+    // potentially complicated logic to compute amount
+    result = someFinalComputation();
   }
   return result;
 }
```

Then, we can do the same for `isRetired`:

```diff
+++ b/src/reorganizing-nested-code/index.js
@@ -1,12 +1,9 @@
 export function payAmount(employee) {
   let result;
   if (employee.isSeparated) return { amount: 0, reasonCode: 'SEP' };
-  if (employee.isRetired) {
-    result = { amount: 0, reasonCode: 'RET' };
-  } else {
-    // potentially complicated logic to compute amount
-    result = someFinalComputation();
-  }
+  if (employee.isRetired) return { amount: 0, reasonCode: 'RET' };
+  // potentially complicated logic to compute amount
+  result = someFinalComputation();
   return result;
 }
```

Finally, we can remove the temporary `result` variable:

```diff
+++ b/src/reorganizing-nested-code/index.js
@@ -1,10 +1,8 @@
 export function payAmount(employee) {
-  let result;
   if (employee.isSeparated) return { amount: 0, reasonCode: 'SEP' };
   if (employee.isRetired) return { amount: 0, reasonCode: 'RET' };
   // potentially complicated logic to compute amount
-  result = someFinalComputation();
-  return result;
+  return someFinalComputation();
 }
 function someFinalComputation() {
```

And that's it! The code is more compact, shorter, and easier to read.

#### Commit history

Below there's the commit history for the steps detailed above.

| Commit SHA                                                                                                                                           | Message                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [a3f7620](https://github.com/kaiosilveira/replace-nested-conditional-with-guard-clauses-refactoring/commit/a3f76209d7308cd668720f98be1bd3002b6bdebc) | break if statement chain and early return for `isSeparated` check |
| [d5f5630](https://github.com/kaiosilveira/replace-nested-conditional-with-guard-clauses-refactoring/commit/d5f5630cad230f0e357525a2c5d482c60dc4ed63) | break if statement chain and early return for `isRetired` check   |
| [974fe84](https://github.com/kaiosilveira/replace-nested-conditional-with-guard-clauses-refactoring/commit/974fe845bc6b54a42b865a939e0935a17de59961) | remove temporary `result` variable                                |

For the full commit history for this project, check the [Commit History tab](https://github.com/kaiosilveira/replace-nested-conditional-with-guard-clauses-refactoring/commits/main).

### Reversing conditions

For this example, we have another situation involving nested conditions inside the body of `adjustedCapital`:

```javascript
export function adjustedCapital(anInvestment) {
  let result = 0;
  if (anInvestment.capital > 0) {
    if (anInvestment.interestRate > 0 && anInvestment.duration > 0) {
      result = (anInvestment.income / anInvestment.duration) * anInvestment.adjustmentFactor;
    }
  }
  return result;
}
```

We want to reverse some of these conditions, make them into guard causes, and make the code clearer.

#### Test suite

Our supporting test suite covers all the possible bifurcations:

```javascript
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
```

And with that in place, we can be confident to continue.

#### Steps

We can start by reversing the `capital > 0` condition to `capital <= 0` + early return:

```diff
+++ b/src/reversing-conditions/index.js
@@ -1,9 +1,9 @@
 export function adjustedCapital(anInvestment) {
   let result = 0;
-  if (anInvestment.capital > 0) {
-    if (anInvestment.interestRate > 0 && anInvestment.duration > 0) {
-      result = (anInvestment.income / anInvestment.duration) * anInvestment.adjustmentFactor;
-    }
+  if (anInvestment.capital <= 0) return result;
+  if (anInvestment.interestRate > 0 && anInvestment.duration > 0) {
+    result = (anInvestment.income / anInvestment.duration) * anInvestment.adjustmentFactor;
   }
+
   return result;
 }
```

Then, we can reverse the "`interestRate` and `duration` are positive" by negating both and early returning:

```diff
+++ b/src/reversing-conditions/index.js
@@ -1,9 +1,7 @@
 export function adjustedCapital(anInvestment) {
   let result = 0;
   if (anInvestment.capital <= 0) return result;
-  if (anInvestment.interestRate > 0 && anInvestment.duration > 0) {
-    result = (anInvestment.income / anInvestment.duration) * anInvestment.adjustmentFactor;
-  }
-
+  if (!(anInvestment.interestRate > 0 && anInvestment.duration > 0)) return result;
+  result = (anInvestment.income / anInvestment.duration) * anInvestment.adjustmentFactor;
   return result;
 }
```

To make things easier, we can also reverse "interestRate and duration are positive" structure, making it into a `OR` statement and reversing the "greater than" signs into "less than" signs:

```diff
+++ b/src/reversing-conditions/index.js
@@ -1,7 +1,7 @@
 export function adjustedCapital(anInvestment) {
   let result = 0;
   if (anInvestment.capital <= 0) return result;
-  if (!(anInvestment.interestRate > 0 && anInvestment.duration > 0)) return result;
+  if (anInvestment.interestRate <= 0 || anInvestment.duration <= 0) return result;
   result = (anInvestment.income / anInvestment.duration) * anInvestment.adjustmentFactor;
   return result;
 }
```

Finally, we can [consolidate](https://github.com/kaiosilveira/consolidate-conditional-expression-refactoring) these guard causes into a single statement:

```diff
+++ b/src/reversing-conditions/index.js
@@ -1,7 +1,7 @@
 export function adjustedCapital(anInvestment) {
   let result = 0;
-  if (anInvestment.capital <= 0) return result;
-  if (anInvestment.interestRate <= 0 || anInvestment.duration <= 0) return result;
+  if (anInvestment.capital <= 0 || anInvestment.interestRate <= 0 || anInvestment.duration <= 0)
+    return result;
   result = (anInvestment.income / anInvestment.duration) * anInvestment.adjustmentFactor;
   return result;
 }
```

And that's it!

#### Commit history

Below there's the commit history for the steps detailed above.

| Commit SHA                                                                                                                                           | Message                                                        |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [168a89a](https://github.com/kaiosilveira/replace-nested-conditional-with-guard-clauses-refactoring/commit/168a89aa5691e5b41b164ab6824a71abc34910ee) | reverse `capital <= 0` condition                               |
| [5347529](https://github.com/kaiosilveira/replace-nested-conditional-with-guard-clauses-refactoring/commit/5347529c30c968a09c759bb8fd14c385fecaaaa8) | reverse '`interestRate` and `duration` are positive' condition |
| [7ea3d95](https://github.com/kaiosilveira/replace-nested-conditional-with-guard-clauses-refactoring/commit/7ea3d9564ff76c942207d6a513c82d549326de1a) | reverse 'interestRate and duration are positive' structure     |
| [156dc42](https://github.com/kaiosilveira/replace-nested-conditional-with-guard-clauses-refactoring/commit/156dc42da31f00c9db2d2590b937d7380dc9bf9e) | consolidate guard causes into single statement                 |
| [1cdc03c](https://github.com/kaiosilveira/replace-nested-conditional-with-guard-clauses-refactoring/commit/1cdc03cbc2a88c361a037d14d29551944d756d1c) | remove temp `result` variable                                  |

For the full commit history for this project, check the [Commit History tab](https://github.com/kaiosilveira/replace-nested-conditional-with-guard-clauses-refactoring/commits/main).
