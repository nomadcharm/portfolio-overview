import { FC } from "react";
import { IAsset } from "../../types/types";
import Asset from "../Asset/Asset";
import "./assetList.scss";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { calculatePortfolioShare } from "../../utils/calculatePortfolioShare";

const AssetList: FC = () => {
  const [assets, setAssets] = useLocalStorage<IAsset[]>("currencies", []);

  const handleDeleteAsset = (id: string) => {
    const updatedAssets = assets.filter(asset => asset.id !== id);
    setAssets(calculatePortfolioShare(updatedAssets));
  };

  return (
    <section className="assets">
      <div className="container assets__container">
        {assets.length > 0 ? (
          <table className="assets__table">
            <thead>
              <tr>
                <th>Актив</th>
                <th>Количество</th>
                <th>Цена</th>
                <th>Общая стоимость</th>
                <th>Изм. за 24 ч.</th>
                <th>% портфеля</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset: IAsset) => (
                <Asset key={asset.id} asset={asset} handleClick={() => handleDeleteAsset(asset.id)} />
              ))}
            </tbody>
          </table>
        ) : (
          <p className="assets__warning">Нет активов в вашем портфеле. Добавьте что-нибудь, чтобы начать!</p>
        )}
      </div>
    </section>
  );
}

export default AssetList;