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

export const todayName = () => {
  const now = new Date();
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return days[now.getDay()];
};

export const todaySchedule = (schedule = []) => {
  const today = todayName();
  let discount = schedule.find(function(dis) {
    return dis.date === today;
  });
  return {
    discount: 0,
    reward: 0,
    ...discount
  };
};

export const todayDiscount = (schedule = []) => todaySchedule(schedule).discount;

export const todayReward = (schedule = []) => todaySchedule(schedule).reward;
