import { FC, ReactNode, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import { calculatePortfolioShare } from "../../utils/calculatePortfolioShare";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { IAsset } from "../../types/types";
import Asset from "../Asset/Asset";
import "./assetList.scss";

interface AssetListProps {
  updatedPrices: { symbol: string; price: string }[]
}

interface FragmentWrapperProps {
  children: ReactNode
}

const FragmentWrapper: FC<FragmentWrapperProps> = (({ children }) => (
  <>
    {children}
  </>
));

const AssetList: FC<AssetListProps> = ({ updatedPrices }) => {
  const [assets, setAssets] = useLocalStorage<IAsset[]>("currencies", []);

  const updateAssetPrices = () => {
    if (Array.isArray(updatedPrices) && updatedPrices.length > 0) {
      const updatedAssets = assets.map(asset => {
        const priceInfo = updatedPrices.find(price => price.symbol === `${asset.currency}USDT`);
        if (priceInfo && priceInfo.price !== null) {
          return {
            ...asset,
            price: Number(priceInfo.price),
            totalAmount: Number(priceInfo.price) * asset.quantity
          };
        }
        return asset;
      });

      setAssets(calculatePortfolioShare(updatedAssets));
    }
  };

  useEffect(() => {
    updateAssetPrices();
  }, [updatedPrices]);

  const handleDeleteAsset = (id: string) => {
    const updatedAssets = assets.filter(asset => asset.id !== id);
    setAssets(updatedAssets);
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
            <List
              outerElementType={FragmentWrapper}
              innerElementType="tbody"
              itemData={assets}
              itemCount={assets.length}
              itemSize={50}
              height={700}
              width={400}
            >
              {({ data, index }: {data: IAsset[], index: number}) => (
                <tr tabIndex={0} onClick={() => handleDeleteAsset(data[index].id)}>
                  <Asset asset={data[index]} />
                </tr>
              )}
            </List>
          </table>
        ) : (
          <p className="assets__warning">Нет активов в вашем портфеле. Добавьте что-нибудь, чтобы начать!</p>
        )}
      </div>
    </section>
  );
}

export default AssetList;