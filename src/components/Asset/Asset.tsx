import { setToFixed } from "../../utils/setToFixed";
import { IAsset } from "../../types/types";

const Asset = ({ asset, handleClick }: { asset: IAsset, handleClick: () => void }) => {
  return (
    <tr onClick={handleClick}>
      <td>{asset.currency}</td>
      <td>{asset.quantity}</td>
      <td>${setToFixed(asset.price, 2)}</td>
      <td>${setToFixed(asset.totalAmount, 2)}</td>
      <td>{setToFixed(asset.priceChangePercent, 2)}%</td>
      <td>{setToFixed(asset.portfolioPercentage, 2)}%</td>
    </tr>
  )
}

export default Asset;