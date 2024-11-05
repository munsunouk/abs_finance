import { ethers } from "ethers";
import { StethAbi } from "@/app/abi/LidoContractABI";
import { EthereumHolesky } from "@particle-network/chains";
import { LidoSDK } from "@lidofinance/lido-ethereum-sdk";

interface LidoStakingProps {
  provider: any;
  smartAccount: any;
  customProvider: any;
  amount: string;
  setTxHash: (result: string) => void;
}

export const useLidoStaking = ({
  provider,
  smartAccount,
  customProvider,
  amount,
  setTxHash,
}: LidoStakingProps) => {
  const stakeEth = async (
    amount: string,
    provider: ethers.providers.Web3Provider
  ): Promise<string> => {
    try {
      const lidoContractAddressHolesky =
        "0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034";
      const signer = provider.getSigner();
      const amountInWei = ethers.utils.parseEther(amount);
      const address = await signer.getAddress();

      const erc20 = new ethers.Contract(
        lidoContractAddressHolesky,
        StethAbi,
        signer
      );

      const tx = await erc20.deposit(address, "",{
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
    provider: ethers.providers.Web3Provider,
  ): Promise<string> => {

    try {
      const lidoContractAddressHolesky =
        "0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034";
      const signer = provider.getSigner();
      const amountInWei = ethers.utils.parseEther(amount);
      const address = await signer.getAddress();

      const erc20 = new ethers.Contract(
        lidoContractAddressHolesky,
        StethAbi,
        signer
      );

      const tx = await erc20.requestWithdraw(amountInWei, address);
      const receipt = await tx.wait();

      setTxHash(
        `Staking successful, transaction hash:: ${receipt.transactionHash}`
      );

      return receipt.transactionHash;
    } catch (error) {
      throw new Error(`Staking failed: ${JSON.stringify(error)}`);
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
      const stETHContractAddress = "0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034";

      const stETHContract = new ethers.Contract(
        stETHContractAddress,
        ["function balanceOf(address account) view returns (uint256)"],
        customProvider
      );

      const balanceResponse = await stETHContract.balanceOf(address);
      const balanceInEther = ethers.utils.formatEther(balanceResponse);
      return parseFloat(balanceInEther);
    } catch (error) {
      console.error("stETH 잔액 조회 실패:", error);
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
