/**
 * Formats a number into a Thai Baht currency string representation
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("THB", "")
    .trim();
}
