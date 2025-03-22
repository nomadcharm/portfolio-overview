export interface IAsset {
  id: string,
  currency: string,
  quantity: number,
  price: number,
  totalAmount: number,
  priceChangePercent: string,
  portfolioPercentage: string
}