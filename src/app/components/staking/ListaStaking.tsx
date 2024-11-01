import { ethers } from "ethers";
import { LISTAStaingManagerABI } from "@/app/abi/LISTAStaingManagerABI";

interface ListaStakingProps {
  provider: any;
  smartAccount: any;
  customProvider: any;
  amount: string;
  setStakeResult: (result: string) => void;
}

export const useListaStaking = ({
  provider,
  smartAccount,
  customProvider,
  amount,
  setStakeResult,
}: ListaStakingProps) => {
  const stakeBnb = async (
    amount: string,
    provider: ethers.providers.Web3Provider
  ): Promise<string> => {
    try {
      const bnbStakingContractAddress =
        "0x1adB950d8bB3dA4bE104211D5AB038628e477fE6";
      const signer = provider.getSigner();
      const amountInWei = ethers.utils.parseEther(amount);

      const bnbStakingContract = new ethers.Contract(
        bnbStakingContractAddress,
        LISTAStaingManagerABI,
        signer
      );

      const tx = await bnbStakingContract.deposit({
        value: amountInWei,
      });

      const receipt = await tx.wait();
      setStakeResult(
        `Staking successful, transaction hash: ${receipt.transactionHash}`
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
    stakeBnb,
    fetchBalance,
  };
};
