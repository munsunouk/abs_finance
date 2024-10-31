"use client";
import React, { useState } from "react";
import { ethers } from "ethers";
import {
  useAuthCore,
  useConnect,
  useEthereum,
} from "@particle-network/auth-core-modal";
import { toast } from "react-toastify";
import { Web3Provider } from "@ethersproject/providers";
import { useParticleProvider } from "@particle-network/connect-react-ui";
import { BNBChain } from "@particle-network/chains";
import {
  AAWrapProvider,
  SendTransactionMode,
  SmartAccount,
} from "@particle-network/aa";
import { LISTAStaingManagerABI } from "@/app/abi/LISTAStaingManagerABI";

const ListaStakingPage: React.FC = () => {
  const [amount, setAmount] = useState("");
  const { provider, address, chainId } = useEthereum();
  const { connect, disconnect } = useConnect();
  const { userInfo } = useAuthCore();
  const [stakeResult, setStakeResult] = useState("");
  const [balance, setBalance] = useState<string | null>(null);
  const particleProvider = useParticleProvider();

  const smartAccount = new SmartAccount(provider, {
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
    clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY!,
    appId: process.env.NEXT_PUBLIC_APP_ID!,
    aaOptions: {
      accountContracts: {
        SIMPLE: [
          {
            chainIds: [BNBChain.id],
            version: "1.0.0",
          },
        ],
      },
    },
  });

  const customProvider = new Web3Provider(
    new AAWrapProvider(smartAccount, SendTransactionMode.Gasless),
    "any"
  );

  const stakeBnb = async (
    amount: string,
    provider: ethers.providers.Web3Provider
  ) => {
    try {
      // BNB 스테이킹 컨트랙트 주소 (실제 주소로 교체)
      const bnbStakingContractAddress =
        "0x1adB950d8bB3dA4bE104211D5AB038628e477fE6";

      // 서명자 생성
      const signer = provider.getSigner();

      // 컨트랙트 인스턴스 생성
      const bnbStakingContract = new ethers.Contract(
        bnbStakingContractAddress,
        LISTAStaingManagerABI,
        signer
      );

      // 금액을 Wei로 변환
      const amountInWei = ethers.utils.parseEther(amount);

      // 스테이킹 함수 호출 (함수 이름이 다를 경우 교체)
      const tx = await bnbStakingContract.deposit({
        value: amountInWei,
      });

      // 트랜잭션이 채굴될 때까지 대기
      const receipt = await tx.wait();

      setStakeResult(
        `Staking successful, transaction hash: ${receipt.transactionHash}`
      );
    } catch (error) {
      throw new Error(`Staking failed: ${JSON.stringify(error)}`);
    }
  };

  const fetchBalance = async (): Promise<number> => {
    const address = await smartAccount.getAddress();
    const balanceResponse = await customProvider.getBalance(address);
    const balanceInEther = ethers.utils.formatEther(balanceResponse);
    setBalance(balanceInEther);
    setStakeResult(`BNB Balance: ${parseFloat(balanceInEther)}`);
    return parseFloat(balanceInEther);
  };

  const handleStake = async () => {
    console.info("스테이킹을 시작합니다.");

    try {
      if (!userInfo) {
        await connect({});
        return;
      }

      if (!provider) {
        setStakeResult(`provider is not defined : ${provider}`);
        throw new Error("Web3 Provider is not defined");
      }

      const balance = await fetchBalance();

      if (balance < parseFloat(amount)) {
        setStakeResult("잔액이 부족합니다.");
        toast.error("잔액이 부족합니다.");
        return;
      }

      stakeBnb(amount, customProvider);

      toast.success("스테이킹이 성공적으로 완료되었습니다.");
    } catch (error) {
      console.error(`스테이킹 실패: ${error}`);
      if (error instanceof Error) {
        console.error(`오류 메시지: ${error.message}`);
      }
      setStakeResult(
        `스테이킹 실패. 자세한 내용은 콘솔을 확인해주세요. ${error}`
      );
      toast.error("스테이킹 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">BNB 스테이킹</h1>
        {userInfo ? (
          <button
            onClick={() => disconnect()}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={() => connect({})}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Connect Wallet
          </button>
        )}
      </div>
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            스테이킹 금액 (BNB)
          </label>
          <input
            type="text"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="금액 입력"
          />
        </div>
        <button
          onClick={handleStake}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          스테이킹
        </button>
      </div>
      {stakeResult && (
        <div className="mt-4 p-4 bg-gray-700 rounded-lg">
          <p className="text-white">{stakeResult}</p>
        </div>
      )}
    </div>
  );
};

export default ListaStakingPage;
