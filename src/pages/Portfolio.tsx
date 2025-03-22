import { useState } from "react";
import AssetList from "../components/AssetList/AssetList";
import Layout from "../components/Layout/Layout";
import { useWebSocketPrices } from "../hooks/useWebsocketPrices";
import { IPriceInfo } from "../types/types";

const Portfolio = () => {
  const [pricesData, setPricesData] = useState<IPriceInfo[]>([]);
  useWebSocketPrices(setPricesData); 

  return (
    <>
      <Layout>
        <AssetList updatedPrices={pricesData} />
      </Layout>
    </>
  )
}

export default Portfolio;