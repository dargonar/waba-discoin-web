import get from "lodash.get";

export const getBusiness = state => get(state, "Api.business", null);
export const isBusiness = state => getBusiness(state) !== null;

export const getSchedule = state => get(state, "Api.schedule", []);
export const isSchedule = state => getSchedule(state).length > 0;

export const getConfiguration = state => get(state, "Api.configuration", null);
export const isConfiguration = state => getConfiguration(state) !== null;

export const getBalances = state => get(state, "Api.business.balances");
export const hasBalances = state => typeof getBalances(state) !== "undefined";

export const getOverdraft = state => get(state, "Api.business.balances.ready_to_access");
export const hasOverdraft = state => typeof getOverdraft(state) !== "undefined";

export const hasInitialCredit = state => {
  if (!hasBalances(state)) return false;
  const readyToAccess = getOverdraft(state);
  return typeof readyToAccess !== "undefined" && readyToAccess > 0;
};

export const balanceRatio = state => (hasInitialCredit(state) ? (getBalances(state).balance * 100) / getBalances(state).initial_credit : 0);

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

export const todaySchedule = state => {
  const today = todayName();
  let discount = (getSchedule(state) || []).find(function(dis) {
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

export const warnings = state => (isConfiguration(state) ? balanceWarnings(getConfiguration(state).warnings) : []);

export const rating = state => (isBusiness(state) ? getBusiness(state).rating : 0);
