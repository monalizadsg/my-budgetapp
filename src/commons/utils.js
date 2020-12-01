export function formatAmount(value) {
  const amountFormatter = new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  });

  return amountFormatter.format(value);
}
