export function formatAmount(value) {
  const amountFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  });

  return amountFormatter.format(value);
}
