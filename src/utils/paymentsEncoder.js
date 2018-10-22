export const PaymentMetodsEncoder = initMethods => {
  let paymentsLabels = initMethods || [
    "cash",
    "credit",
    "debit",
    "mercadopago"
  ];

  const isSelected = (label, methods) =>
    methods.indexOf(label) !== -1 ? 1 : 0;

  return {
    paymentsLabels,
    setMethods: methods => {
      paymentsLabels = methods;
    },
    encode: daySchedule =>
      paymentsLabels.filter(method => daySchedule["pm_" + method] === 1),
    decode: methods =>
      paymentsLabels.reduce(
        (prev, act) => ({
          ...prev,
          ["pm_" + act]: isSelected(act, methods)
        }),
        {}
      )
  };
};
