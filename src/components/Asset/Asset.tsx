import { setToFixed } from "../../utils/setToFixed";
import { IAsset } from "../../types/types";

const Asset = ({ asset, handleClick }: { asset: IAsset, handleClick: () => void }) => {
  return (
    <tr onClick={handleClick}>
      <td>{asset.currency}</td>
      <td>{asset.quantity}</td>
      <td>${setToFixed(asset.price, 2)}</td>
      <td>${setToFixed(asset.totalAmount, 2)}</td>
      <td>
        {Number(asset.priceChangePercent) < 0 ? (
          <span style={{ color: "var(--clr-persimmon)" }}>{`${setToFixed(asset.priceChangePercent, 2)}%`}</span>
        ) : (
          <span style={{ color: "var(--clr-algae-green" }}>{`+${setToFixed(asset.priceChangePercent, 2)}%`}</span>
        )}
      </td>
      <td>{setToFixed(asset.portfolioPercentage, 2)}%</td>
    </tr>
  )
}

export default Asset;