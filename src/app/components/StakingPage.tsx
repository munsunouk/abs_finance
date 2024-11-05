"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import {
  useAuthCore,
  useConnect,
  useEthereum,
} from "@particle-network/auth-core-modal";
import { Web3Provider } from "@ethersproject/providers";
import { EthereumHolesky, Base, BNBChain } from "@particle-network/chains";
import {
  AAWrapProvider,
  SendTransactionMode,
  SmartAccount,
} from "@particle-network/aa";
import { useLidoStaking } from "@/app/components/staking/LidoStaking";
import { useSuperOETHStaking } from "@/app/components/staking/SuperOETHStaking";
import { useListaStaking } from "@/app/components/staking/ListaStaking";
import { LISTAStaingManagerABI } from "@/app/abi/LISTAStaingManagerABI";
import Image from "next/image";

const StakingPage: React.FC = () => {
  const [selectedToken, setSelectedToken] = useState("stETH");
  const [amount, setAmount] = useState("");
  const { provider, address, chainInfo, signTypedData } = useEthereum();
  const { connect, disconnect } = useConnect();
  const { userInfo } = useAuthCore();
  const [TxResult, setTxResult] = useState("");
  const [withdrawResult, setWithdrawResult] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [apyRates, setApyRates] = useState<{ [key: string]: string }>({
    stETH: "0%",
    superOETH: "0%",
    slisBNB: "0%",
  });
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<string>("0");
  const [error, setError] = useState<string | null>(null);
  const [isApyLoading, setIsApyLoading] = useState(true);
  const [smartAccount, setSmartAccount] = useState<SmartAccount | null>(null);
  const [customProvider, setCustomProvider] = useState<Web3Provider | null>(
    null
  );
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>(
    {
      stETH: 1,
      superOETH: 1,
      slisBNB: 1,
    }
  );
  const [activeView, setActiveView] = useState<"stake" | "unstake">("stake");
  const [stakedBalance, setStakedBalance] = useState<string>("0");
  const [outputBalance, setOutputBalance] = useState<string>("0");

  useEffect(() => {
    setMounted(true);
  }, []);

  const gasLimit = 200000;

  const getChainId = useCallback(() => {
    switch (selectedToken) {
      case "stETH":
        return EthereumHolesky.id;
      case "superOETH":
        return Base.id;
      case "slisBNB":
        return BNBChain.id;
      default:
        return EthereumHolesky.id;
    }
  }, [selectedToken]);

  useEffect(() => {
    if (provider) {
      const newSmartAccount = new SmartAccount(provider, {
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
        clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY!,
        appId: process.env.NEXT_PUBLIC_APP_ID!,
        aaOptions: {
          accountContracts: {
            SIMPLE: [
              {
                chainIds: [getChainId()],
                version: "1.0.0",
              },
            ],
          },
        },
      });

      const newCustomProvider = new Web3Provider(
        new AAWrapProvider(newSmartAccount, SendTransactionMode.Gasless),
        "any"
      );

      setSmartAccount(newSmartAccount);
      setCustomProvider(newCustomProvider);
    }
  }, [provider, selectedToken, getChainId]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (userInfo && provider && smartAccount && customProvider) {
        try {
          const address = await smartAccount.getAddress();
          const balanceResponse = await customProvider.getBalance(address);
          setBalance(ethers.utils.formatEther(balanceResponse));
        } catch (error) {
          console.error("잔액 조회 실패:", error);
          setBalance("0");
        }
      }
    };
    fetchBalance();
  }, [userInfo, selectedToken, smartAccount, customProvider, provider]);

  const fetchLidoAPR = useCallback(async () => {
    try {
      const response = await fetch(
        "https://eth-api-holesky.testnet.fi/v1/protocol/steth/apr/sma"
      );
      const data = await response.json();
      const aprValue = data.data.smaApr;
      return aprValue.toFixed(2) + "%";
    } catch (error) {
      console.error("Lido APR 조회 실패:", error);
      return "0%";
    }
  }, []);

  const fetchSuperOETHAPY = useCallback(async () => {
    try {
      const response = await fetch(
        "https://origin.squids.live/origin-squid:prod/api/graphql",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query OTokenApy($chainId: Int!, $token: String!) {
                oTokenApies(
                  limit: 1
                  orderBy: timestamp_DESC
                  where: {chainId_eq: $chainId, otoken_eq: $token}
                ) {
                  apy7DayAvg
                }
              }
            `,
            variables: {
              token: "0xdbfefd2e8460a6ee4955a68582f85708baea60a3",
              chainId: 8453,
            },
          }),
        }
      );
      const data = await response.json();
      const apyData = data.data.oTokenApies[0];
      return (apyData.apy7DayAvg * 100).toFixed(2) + "%";
    } catch (error) {
      console.error("SuperOETH APY 조회 실패:", error);
      return "0%";
    }
  }, []);

  const fetchListaAPY = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.lista.org/v1/stakes/latest-apr"
      );
      const data = await response.json();
      if (data.code === "000000000") {
        const aprValue = parseFloat(data.data.apr);
        return (aprValue * 100).toFixed(2) + "%";
      }
      return "0%";
    } catch (error) {
      console.error("Lista APY 조회 실패:", error);
      return "0%";
    }
  }, []);

  useEffect(() => {
    const fetchSelectedTokenAPR = async () => {
      setIsApyLoading(true);
      try {
        let apr: string;
        switch (selectedToken) {
          case "stETH":
            apr = await fetchLidoAPR();
            setApyRates((prev) => ({ ...prev, stETH: apr }));
            break;
          case "superOETH":
            apr = await fetchSuperOETHAPY();
            setApyRates((prev) => ({ ...prev, superOETH: apr }));
            break;
          case "slisBNB":
            apr = await fetchListaAPY();
            setApyRates((prev) => ({ ...prev, slisBNB: apr }));
            break;
        }
      } finally {
        setIsApyLoading(false);
      }
    };

    fetchSelectedTokenAPR();
  }, [selectedToken, fetchLidoAPR, fetchSuperOETHAPY, fetchListaAPY]);

  const tokenDisplayNames: { [key: string]: string } = {
    stETH: "ETH",
    superOETH: "ETH",
    slisBNB: "BNB",
  };

  const tokens = [
    { id: "stETH", name: "stETH", apy: apyRates.stETH },
    { id: "superOETH", name: "superOETH", apy: apyRates.superOETH },
    { id: "slisBNB", name: "slisBNB", apy: apyRates.slisBNB },
  ];

  const getExplorerUrl = (hash: string) => {
    return `${chainInfo.blockExplorerUrl}/tx/${hash}`;
  };

  const handleAmountChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && !/^\d*\.?\d*$/.test(value)) {
      return;
    }
    setAmount(value);

    try {
      if (value) {
        // 가스 비용을 포함한 총 비용 계산
        await calculateTotalCost(value, gasLimit);
        setError(null);
      } else {
        setError(null);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const calculateTotalCost = async (amount: string, gasLimit: number) => {
    if (!provider || !userInfo)
      throw new Error("Provider 또는 유저 정보가 없습니다");

    const ethersProvider = new ethers.providers.Web3Provider(provider as any);
    const address = await smartAccount?.getAddress();

    if (!address) {
      throw new Error("주소 가져올 수 없습니다");
    }

    const gasPrice = await ethersProvider.getGasPrice();
    const totalGasCost = gasPrice.mul(gasLimit);
    const value = ethers.utils.parseEther(amount);
    const totalCost = totalGasCost.add(value);
    const balance = await ethersProvider.getBalance(address);

    if (balance.lt(totalCost)) {
      throw new Error(
        `잔액이 부족합니다. 필요: ${ethers.utils.formatEther(totalCost)} ${
          chainInfo.nativeCurrency.symbol
        }, 보유: ${ethers.utils.formatEther(balance)} ${
          chainInfo.nativeCurrency.symbol
        }`
      );
    }

    return totalCost;
  };

  const lidoStaking = useLidoStaking({
    provider,
    smartAccount,
    customProvider,
    amount,
    setTxHash,
  });

  const superOETHStaking = useSuperOETHStaking({
    provider,
    smartAccount,
    customProvider,
    amount,
    setTxHash,
  });

  const listaStaking = useListaStaking({
    provider,
    smartAccount,
    customProvider,
    amount,
    setTxHash: setTxResult,
  });

  const handleStake = async () => {
    try {
      await calculateTotalCost(amount, gasLimit);
      setIsLoading(true);
      if (!userInfo) {
        await connect({});
        return;
      }

      if (!provider || !smartAccount || !customProvider) {
        throw new Error("Provider가 초기화되 않았습니다");
      }

      let transactionHash = "";

      switch (selectedToken) {
        case "stETH":
          transactionHash = await lidoStaking.stakeEth(amount, customProvider);
          break;
        case "superOETH":
          transactionHash = await superOETHStaking.stakeEth(
            amount,
            customProvider
          );
          break;
        case "slisBNB":
          transactionHash = await listaStaking.stakeBnb(amount, customProvider);
          break;
      }

      setTxHash(transactionHash);
    } catch (error) {
      console.error(`스테이킹 실패: ${error}`);
      setTxHash(`스테이킹 실패: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenSelect = async (tokenId: string) => {
    setSelectedToken(tokenId);

    if (!userInfo || !provider) return;

    try {
      setIsLoading(true);
      let targetChain;

      switch (tokenId) {
        case "stETH":
          targetChain = EthereumHolesky;
          break;
        case "superOETH":
          targetChain = Base;
          break;
        case "slisBNB":
          targetChain = BNBChain;
          break;
        default:
          targetChain = EthereumHolesky;
      }

      // Particle 지갑 체인 변경
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${targetChain.id.toString(16)}` }],
      });

    } catch (error: any) {
      // 체인이 지갑에 없는 경우 추가
      if (error.code === 4902) {
        try {
          const targetChain = getTargetChainConfig(tokenId);
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [targetChain],
          });
        } catch (addError) {
          console.error("체인 추가 실패:", addError);
        }
      } else {
        console.error("체인 전환 실패:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 체인 설정 가져오기 함수
  const getTargetChainConfig = (tokenId: string) => {
    switch (tokenId) {
      case "stETH":
        return {
          chainId: `0x${EthereumHolesky.id.toString(16)}`,
          chainName: "Ethereum Holesky",
          rpcUrls: [EthereumHolesky.rpcUrl],
          nativeCurrency: {
            name: EthereumHolesky.nativeCurrency.name,
            symbol: EthereumHolesky.nativeCurrency.symbol,
            decimals: EthereumHolesky.nativeCurrency.decimals,
          },
          blockExplorerUrls: [EthereumHolesky.blockExplorerUrl],
        };
      case "superOETH":
        return {
          chainId: `0x${Base.id.toString(16)}`,
          chainName: "Base",
          rpcUrls: [Base.rpcUrl],
          nativeCurrency: {
            name: Base.nativeCurrency.name,
            symbol: Base.nativeCurrency.symbol,
            decimals: Base.nativeCurrency.decimals,
          },
          blockExplorerUrls: [Base.blockExplorerUrl],
        };
      case "slisBNB":
        return {
          chainId: `0x${BNBChain.id.toString(16)}`,
          chainName: "BNB Chain",
          rpcUrls: [BNBChain.rpcUrl],
          nativeCurrency: {
            name: BNBChain.nativeCurrency.name,
            symbol: BNBChain.nativeCurrency.symbol,
            decimals: BNBChain.nativeCurrency.decimals,
          },
          blockExplorerUrls: [BNBChain.blockExplorerUrl],
        };
      default:
        return getTargetChainConfig("stETH");
    }
  };

  // 개별 토큰 환율 조회 함수
  const fetchStEthRate = async () => {
    try {
      const response = await fetch(
        "https://eth-api.lido.fi/v1/swap/one-inch?token=ETH"
      );
      const data = await response.json();
      return data.rate || 1;
    } catch (error) {
      console.error("stETH 환율 조회 실패:", error);
      return 1;
    }
  };

  const fetchSuperOEthRate = async () => {
    try {
      const response = await fetch(
        "https://origin.squids.live/origin-squid:prod/api/graphql",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query oTokenStats($token: String!, $chainId: Int!) {
                oTokenDailyStats(
                  limit: 1
                  orderBy: [timestamp_DESC]
                  where: {otoken_eq: $token, chainId_eq: $chainId}
                ) {
                  rateETH
                }
              }
            `,
            variables: {
              token: "0xdbfefd2e8460a6ee4955a68582f85708baea60a3",
              chainId: 8453,
            },
          }),
        }
      );
      const data = await response.json();
      const rateETHWei =
        data.data.oTokenDailyStats[0]?.rateETH || "999919896260820761";
      return parseFloat(ethers.utils.formatUnits(rateETHWei, 18));
    } catch (error) {
      console.error("superOETH 환율 조회 실패:", error);
      return 1;
    }
  };

  const fetchSlisBnbRate = useCallback(async () => {
    try {
      if (!provider) return 1;

      const ethersProvider = new ethers.providers.Web3Provider(provider as any);
      const listaContract = new ethers.Contract(
        "0x1adB950d8bB3dA4bE104211D5AB038628e477fE6",
        LISTAStaingManagerABI,
        ethersProvider
      );

      const onebnb = ethers.utils.parseEther("1");
      const slisBNBAmount = await listaContract.convertBnbToSnBnb(onebnb);
      return parseFloat(ethers.utils.formatEther(slisBNBAmount));
    } catch (error) {
      console.error("slisBNB 환율 조회 실패:", error);
      return 1;
    }
  }, [provider]);

  // 선택된 토큰에 따라 해당하는 환율만 조회
  useEffect(() => {
    const fetchSelectedTokenRate = async () => {
      let rate: number;

      switch (selectedToken) {
        case "stETH":
          rate = await fetchStEthRate();
          setExchangeRates((prev) => ({
            ...prev,
            stETH: Number(rate.toFixed(4)),
          }));
          break;
        case "superOETH":
          rate = await fetchSuperOEthRate();
          setExchangeRates((prev) => ({
            ...prev,
            superOETH: Number(rate.toFixed(4)),
          }));
          break;
        case "slisBNB":
          rate = await fetchSlisBnbRate();
          setExchangeRates((prev) => ({
            ...prev,
            slisBNB: Number(rate.toFixed(4)),
          }));
          break;
      }
    };

    fetchSelectedTokenRate();
  }, [selectedToken, provider, fetchSlisBnbRate]);

  const handleUnstake = async () => {
    if (!userInfo || !provider) return;

    try {
      await calculateTotalCost("0", gasLimit);
      setIsLoading(true);
      if (!userInfo) {
        await connect({});
        return;
      }

      if (!provider || !smartAccount || !customProvider) {
        throw new Error("Provider가 초기화되 않았습니다");
      }

      let transactionHash = "";

      // 각 토큰별 스테이킹 컴포넌트 사용
      switch (selectedToken) {
        case "stETH":
          transactionHash = await lidoStaking.unstake(
            amount,
            customProvider,
          );
          break;
        case "superOETH":
          transactionHash = await superOETHStaking.unstake(
            amount,
            customProvider
          );
          break;
        case "slisBNB":
          transactionHash = await listaStaking.unstake(amount, customProvider);
          break;
      }

      setTxHash(transactionHash);

    } catch (error) {
      console.error(`언스테이킹 실패: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchStakedBalance = async () => {
      if (userInfo && provider && smartAccount && customProvider) {
        try {
          let balance = 0;
          switch (selectedToken) {
            case "stETH":
              balance = await lidoStaking.fetchStakedBalance();
              break;
            case "superOETH":
              balance = await superOETHStaking.fetchStakedBalance();
              break;
            case "slisBNB":
              balance = await listaStaking.fetchStakedBalance();
              break;
          }
          setStakedBalance(balance.toString());
        } catch (error) {
          console.error("스테이킹된 잔액 조회 실패:", error);
          setStakedBalance("0");
        }
      }
    };
    fetchStakedBalance();
  }, [userInfo, selectedToken, smartAccount, customProvider, provider]);

  useEffect(() => {
    const fetchOutputBalance = async () => {
      if (userInfo && provider && smartAccount && customProvider) {
        try {
          let balance = 0;
          if (activeView === "stake") {
            // 스테이킹 시에는 스테이킹된 토큰 잔액을 보여줌
            switch (selectedToken) {
              case "stETH":
                balance = await lidoStaking.fetchStakedBalance();
                break;
              case "superOETH":
                balance = await superOETHStaking.fetchStakedBalance();
                break;
              case "slisBNB":
                balance = await listaStaking.fetchStakedBalance();
                break;
            }
          } else {
            // 언스테이킹 시에는 네이티브 토큰 잔액을 보여줌
            const address = await smartAccount.getAddress();
            const balanceResponse = await customProvider.getBalance(address);
            balance = parseFloat(ethers.utils.formatEther(balanceResponse));
          }
          setOutputBalance(balance.toString());
        } catch (error) {
          console.error("출력 토큰 잔액 조회 실패:", error);
          setOutputBalance("0");
        }
      }
    };
    fetchOutputBalance();
  }, [
    userInfo,
    selectedToken,
    activeView,
    smartAccount,
    customProvider,
    provider,
  ]);

  const getInputToken = (activeView: string, selectedToken: string) => {
    if (activeView === "stake") {
      return tokenDisplayNames[selectedToken];
    }
    return selectedToken;
  };

  const getOutputToken = (activeView: string, selectedToken: string) => {
    if (activeView === "stake") {
      return selectedToken;
    }
    return tokenDisplayNames[selectedToken];
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-4xl">
      <div className="bg-white/5 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">
            Liquidity Staking
          </h1>
          {mounted && (
            <button
              onClick={() => (userInfo ? disconnect() : connect({}))}
              className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-6 rounded-full"
            >
              {userInfo ? "Disconnect" : "Connect Wallet"}
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-8">
          {tokens.map((token) => (
            <button
              key={token.id}
              onClick={() => handleTokenSelect(token.id)}
              className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 min-w-[140px] ${
                selectedToken === token.id
                  ? "bg-purple-500/20 border border-purple-500"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-2 w-full justify-center">
                <Image
                  src={`/icon-${token.name}.svg`}
                  alt={`${token.name}`}
                  width={24}
                  height={24}
                  className="mr-2"
                />
                {token.name}
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <div className="flex bg-white/5 p-1 rounded-xl">
            <button
              onClick={() => setActiveView("stake")}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                activeView === "stake" ? "bg-purple-500" : "hover:bg-white/10"
              }`}
            >
              Stake
            </button>
            <button
              onClick={() => setActiveView("unstake")}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                activeView === "unstake" ? "bg-purple-500" : "hover:bg-white/10"
              }`}
            >
              Unstake
            </button>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">
              {selectedToken} {activeView === "stake" ? "Staking" : "Unstaking"}
            </h2>
            <p className="text-white/60">
              APR:{" "}
              {isApyLoading ? (
                <span className="inline-block animate-pulse">로딩 중...</span>
              ) : (
                apyRates[selectedToken]
              )}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {activeView === "stake" ? "Stake" : "Unstake"}
            </h2>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  className="bg-transparent text-3xl w-full focus:outline-none"
                  placeholder="0"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setAmount(
                        activeView === "stake" ? balance : stakedBalance
                      )
                    }
                    className="text-sm bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20"
                  >
                    MAX
                  </button>
                  <div className="flex items-center bg-white/10 rounded-lg px-4 py-2 w-[140px] justify-center">
                    <Image
                      src={`/icon-${getInputToken(
                        activeView,
                        selectedToken
                      )}.svg`}
                      alt={`${getInputToken(activeView, selectedToken)} Icon`}
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                    <span>{getInputToken(activeView, selectedToken)}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-gray-400 text-sm">
                <span>{error || `Amount to ${activeView}`}</span>
                <span>
                  Balance:{" "}
                  {parseFloat(
                    activeView === "stake" ? balance : stakedBalance
                  ).toFixed(4)}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Receive</h2>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">
                  {amount
                    ? (
                        parseFloat(amount) * exchangeRates[selectedToken]
                      ).toFixed(6)
                    : "0"}
                </div>
                <div className="flex items-center bg-white/10 rounded-lg px-4 py-2 w-[140px] justify-center">
                  <Image
                    src={`/icon-${getOutputToken(
                      activeView,
                      selectedToken
                    )}.svg`}
                    alt={`${getOutputToken(activeView, selectedToken)} Icon`}
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  <span>{getOutputToken(activeView, selectedToken)}</span>
                </div>
              </div>
              <div className="flex justify-between text-gray-400 text-sm">
                <span>예상 수량</span>
                <span>Balance: {parseFloat(outputBalance).toFixed(4)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between text-gray-400 text-sm mb-8">
            <span>환율</span>
            <span>
              1 {getInputToken(activeView, selectedToken)} ={" "}
              {exchangeRates[selectedToken]}{" "}
              {getOutputToken(activeView, selectedToken)}
            </span>
          </div>

          <button
            onClick={activeView === "stake" ? handleStake : handleUnstake}
            disabled={isLoading || !amount || !userInfo || !!error}
            className={`w-full py-4 rounded-xl font-medium ${
              isLoading || !amount || !userInfo || !!error
                ? "bg-purple-500/50 cursor-not-allowed"
                : "bg-purple-500 hover:bg-purple-600"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                {activeView === "stake" ? "스테이킹 중..." : "언스테이킹 중..."}
              </div>
            ) : (
              error || (activeView === "stake" ? "Stake" : "Unstake")
            )}
          </button>
        </div>
      </div>

      {txHash && (
        <div className="mt-4 p-4 bg-white/5 rounded-xl">
          <p className="text-white/60">트랜잭션 완료:</p>
          <a
            href={getExplorerUrl(txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 break-all"
          >
            {txHash}
          </a>
        </div>
      )}
    </div>
  );
};

export default StakingPage;
