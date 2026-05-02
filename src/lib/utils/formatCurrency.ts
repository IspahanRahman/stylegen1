export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function calculateDiscount(
  originalPrice: number,
  discountPercent: number,
): number {
  return originalPrice - (originalPrice * discountPercent) / 100;
}

export function generateOrderNumber(): string {
  return `SG-${Date.now().toString(36).toUpperCase()}`;
}
