import React, { useEffect, useState } from "react";
import { useConnect, useAuthCore } from "@particle-network/auth-core-modal";

const Header: React.FC = () => {
  const { connect, disconnect } = useConnect();
  const { userInfo } = useAuthCore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="bg-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="text-2xl font-bold">ABS Finance</div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="hover:text-purple-400">
                Markets
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-purple-400">
                Stake
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-purple-400">
                Portfolio
              </a>
            </li>
          </ul>
        </nav>
        {isClient && !userInfo ? (
          <button
            onClick={() => connect({})}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Connect Wallet
          </button>
        ) : (
          <button
            onClick={() => disconnect()}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Disconnect
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
