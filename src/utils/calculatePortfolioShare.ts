import { IAsset } from "../types/types";

export const calculatePortfolioShare = (assets: IAsset[]) => {
  const totalPortfolioValue = assets.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  return assets.map(item => {
    const itemValue = item.price * item.quantity;
    const percentage = totalPortfolioValue > 0
      ? ((itemValue / totalPortfolioValue) * 100).toFixed(2)
      : "0.00";
    return { ...item, portfolioPercentage: percentage };
  });
}
