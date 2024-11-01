import { ethers } from "ethers";
import { OETHZapperABI } from "@/app/abi/OETHZapper";

interface SuperOETHStakingProps {
  provider: any;
  smartAccount: any;
  customProvider: any;
  amount: string;
  setStakeResult: (result: string) => void;
}

export const useSuperOETHStaking = ({
  provider,
  smartAccount,
  customProvider,
  amount,
  setStakeResult,
}: SuperOETHStakingProps) => {
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
        OETHZapperABI,
        signer
      );

      const tx = await erc20.deposit({
        value: amountInWei,
      });

      const receipt = await tx.wait();
      setStakeResult(
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

  return {
    stakeEth,
    fetchBalance,
  };
};