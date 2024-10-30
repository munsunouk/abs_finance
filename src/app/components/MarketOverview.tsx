import React from "react";

const MarketOverview: React.FC = () => {
  // 이 부분은 실제 데이터로 대체해야 합니다
  const markets = [
    { name: "ETH", apy: "5.2%", tvl: "$1.2B" },
    { name: "SuperOETH", apy: "4.8%", tvl: "$980M" },
    { name: "SOL", apy: "6.1%", tvl: "$450M" },
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Market Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {markets.map((market, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">{market.name}</h3>
            <p>APY: {market.apy}</p>
            <p>TVL: {market.tvl}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketOverview;
