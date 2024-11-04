import { ethers } from "ethers";
import { LISTAStaingManagerABI } from "@/app/abi/LISTAStaingManagerABI";

interface ListaStakingProps {
  provider: any;
  smartAccount: any;
  customProvider: any;
  amount: string;
  setTxHash: (result: string) => void;
}

export const useListaStaking = ({
  provider,
  smartAccount,
  customProvider,
  amount,
  setTxHash,
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
      setTxHash(
        `Staking successful, transaction hash: ${receipt.transactionHash}`
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
      const bnbStakingContractAddress =
        "0x1adB950d8bB3dA4bE104211D5AB038628e477fE6";
      const signer = provider.getSigner();
      const amountInWei = ethers.utils.parseEther(amount);

      const bnbStakingContract = new ethers.Contract(
        bnbStakingContractAddress,
        LISTAStaingManagerABI,
        signer
      );

      setTxHash(`Unstaking ${amount} slisBNB`);

      const tx = await bnbStakingContract.requestWithdraw(amountInWei);

      const receipt = await tx.wait();
      setTxHash(
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

  const fetchStakedBalance = async (): Promise<number> => {
    try {
      const address = await smartAccount.getAddress();
      const slisBNBContractAddress =
        "0xB0b84D294e0C75A6abe60171b70edEb2EFd14A1B";

      const slisBNBContract = new ethers.Contract(
        slisBNBContractAddress,
        ["function balanceOf(address account) view returns (uint256)"],
        customProvider
      );

      const balanceResponse = await slisBNBContract.balanceOf(address);
      const balanceInEther = ethers.utils.formatEther(balanceResponse);
      return parseFloat(balanceInEther);
    } catch (error) {
      console.error("slisBNB 잔액 조회 실패:", error);
      return 0;
    }
  };

  return {
    stakeBnb,
    unstake,
    fetchBalance,
    fetchStakedBalance,
  };
};
