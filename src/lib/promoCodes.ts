export interface PromoCode {
  code: string;
  discountPercent: number;
  minOrderAmount: number;
  description: string;
  active: boolean;
}

export const promoCodes: PromoCode[] = [
  { code: 'BIRAL10', discountPercent: 10, minOrderAmount: 0, description: 'İlk sifarişə 10% endirim', active: true },
  { code: 'YAZ25', discountPercent: 25, minOrderAmount: 50, description: '50₼+ sifarişlərə 25% endirim', active: true },
  { code: 'PULSUZ', discountPercent: 15, minOrderAmount: 30, description: '30₼+ sifarişlərə 15% endirim', active: true },
];

export const validatePromoCode = (code: string, orderTotal: number): { valid: boolean; discount: number; error?: string; promo?: PromoCode } => {
  const promo = promoCodes.find((p) => p.code === code.toUpperCase().trim());
  if (!promo) return { valid: false, discount: 0, error: 'Kupon kodu tapılmadı' };
  if (!promo.active) return { valid: false, discount: 0, error: 'Bu kupon artıq keçərli deyil' };
  if (orderTotal < promo.minOrderAmount) {
    return { valid: false, discount: 0, error: `Bu kupon minimum ${promo.minOrderAmount}₼ sifariş tələb edir` };
  }
  const discount = (orderTotal * promo.discountPercent) / 100;
  return { valid: true, discount: Math.round(discount * 100) / 100, promo };
};
