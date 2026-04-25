export function formatPrice(price: number | null): string {
  return price ? `${price} BYN` : '—';
}
