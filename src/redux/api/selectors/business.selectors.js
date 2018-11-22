export const isConfiguration = configuration => typeof configuration !== "undefined" && configuration !== null;

export const isBusiness = business => typeof business !== "undefined" && business !== null;

export const hasBalances = business =>
  isBusiness(business) && typeof business.balances !== "undefined" && typeof business.balances !== null;

export const hasInitialCredit = business =>
  hasBalances(business) && typeof business.balances !== "undefined" && typeof business.balances !== null;

export const balanceRatio = business =>
  hasInitialCredit(business) ? (business.balances.balance * 100) / business.balances.initial_credit : 0;

export const balanceWarnings = (warnings = []) =>
  Object.keys(warnings).map(key => {
    return {
      value: warnings[key].amount,
      color: warnings[key].color,
      raw: warnings[key]
    };
  });
