import { ethers } from "ethers";
import { OriginProtocolABI } from "@/app/abi/OriginProtocolABI";

interface SuperOETHProps {
  provider: any;
  smartAccount: any;
  customProvider: any;
  amount: string;
  setTxHash: (result: string) => void;
}

export const useSuperOETHStaking = ({
  provider,
  smartAccount,
  customProvider,
  amount,
  setTxHash,
}: SuperOETHProps) => {
  const stakeEth = async (
    amount: string,
    provider: ethers.providers.Web3Provider
  ): Promise<string> => {
    try {
      const oETHzapperContractAddress =
        "0x3b56c09543D3068f8488ED34e6F383c3854d2bC1";
      const signer = provider.getSigner();
      const amountInWei = ethers.utils.parseEther(amount);

      const erc20 = new ethers.Contract(
        oETHzapperContractAddress,
        OriginProtocolABI,
        signer
      );

      const tx = await erc20.deposit({
        value: amountInWei,
      });

      const receipt = await tx.wait();
      setTxHash(
        `Staking successful, transaction hash:: ${receipt.transactionHash}`
      );

      return receipt.transactionHash;
    } catch (error) {
      throw new Error(`Staking failed: ${JSON.stringify(error)}`);
    }
  };

  const unstake = async (
    amount: string,
    provider: ethers.providers.Web3Provider
  ): Promise<string> => {
    try {
      const VaultProxyContractAddress =
        "0x98a0CbeF61bD2D21435f433bE4CD42B56B38CC93";
      const signer = provider.getSigner();
      const amountInWei = ethers.utils.parseEther(amount);

      const erc20 = new ethers.Contract(
        VaultProxyContractAddress,
        OriginProtocolABI,
        signer
      );

      const tx = await erc20.requestWithdrawal(amountInWei);

      const receipt = await tx.wait();
      setTxHash(
        `Withdrawal successful, transaction hash:: ${receipt.transactionHash}`
      );

      return receipt.transactionHash;
    } catch (error) {
      throw new Error(`Withdrawal failed: ${JSON.stringify(error)}`);
    }
  };

  const fetchBalance = async (): Promise<number> => {
    const address = await smartAccount.getAddress();
    const balanceResponse = await customProvider.getBalance(address);
    const balanceInEther = ethers.utils.formatEther(balanceResponse);
    return parseFloat(balanceInEther);
  };

  const fetchStakedBalance = async (): Promise<number> => {
    try {
      const address = await smartAccount.getAddress();
      const superOETHContractAddress =
        "0xDBFeFD2e8460a6Ee4955A68582F85708BAEA60A3";

      const superOETHContract = new ethers.Contract(
        superOETHContractAddress,
        ["function balanceOf(address account) view returns (uint256)"],
        customProvider
      );

      const balanceResponse = await superOETHContract.balanceOf(address);
      const balanceInEther = ethers.utils.formatEther(balanceResponse);
      return parseFloat(balanceInEther);
    } catch (error) {
      console.error("superOETH 잔액 조회 실패:", error);
      return 0;
    }
  };

  return {
    stakeEth,
    unstake,
    fetchBalance,
    fetchStakedBalance,
  };
};
