import React from "react";
import Link from "next/link";

const StakingOptions: React.FC = () => {
  const options = [
    { name: "ETH Staking", apy: "5.5%", minStake: "0.01 ETH" },
    { name: "SuperOETH Staking", apy: "4.2%", minStake: "0.01 ETH" },
    { name: "BNB Staking", apy: "6.8%", minStake: "10 BNB" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Staking Options</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((option, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">{option.name}</h3>
            <p>APY: {option.apy}</p>
            <p>Min Stake: {option.minStake}</p>
            <Link href={`/stake/${option.name.split(" ")[0].toLowerCase()}`}>
              <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                Stake Now
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StakingOptions;
