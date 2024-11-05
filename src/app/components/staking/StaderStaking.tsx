import { ethers } from "ethers";
import { StaderABI } from "@/app/abi/StaderABI";

interface StaderStakingProps {
  provider: any;
  smartAccount: any;
  customProvider: any;
  amount: string;
  setTxHash: (result: string) => void;
  setNeedsApproval?: (needs: boolean) => void;
}
export const useStaderStaking = ({
  provider,
  smartAccount,
  customProvider,
  amount,
  setTxHash,
  setNeedsApproval,
}: StaderStakingProps) => {
  const stake = async (
    amount: string,
    provider: ethers.providers.Web3Provider
  ): Promise<string> => {
    try {
      const StaderDepositContractAddress =
        "0x7F09ceb3874F5E35Cd2135F56fd4329b88c5d119";
      const signer = provider.getSigner();
      const amountInWei = ethers.utils.parseEther(amount);
      const address = await signer.getAddress();
      const erc20 = new ethers.Contract(
        StaderDepositContractAddress,
        StaderABI,
        signer
      );
      const tx = await erc20.deposit(address, {
        value: amountInWei,
      });
      const receipt = await tx.wait();
      setTxHash(
        `Staking successful, transaction hash:: ${receipt.transactionHash}`
      );
      return receipt.transactionHash;
    } catch (error) {
      throw new Error(`Staking failed: ${error}`);
    }
  };
  const checkAllowance = async (amount: string): Promise<boolean> => {
    try {
      const StaderWithdrawContractAddress =
        "0x7F09ceb3874F5E35Cd2135F56fd4329b88c5d119";
      const tokenContractAddress = "0xB4F5fc289a778B80392b86fa70A7111E5bE0F859";
      const address = await smartAccount.getAddress();

      const tokenContract = new ethers.Contract(
        tokenContractAddress,
        StaderABI,
        customProvider
      );

      const allowance = await tokenContract.allowance(
        address,
        StaderWithdrawContractAddress
      );
      const amountInWei = ethers.utils.parseEther(amount);

      return allowance.lt(amountInWei);
    } catch (error) {
      return false;
    }
  };
  const unstake = async (
    amount: string,
    provider: ethers.providers.Web3Provider
  ): Promise<string> => {
    try {
      const needsApproval = await checkAllowance(amount);
      if (setNeedsApproval) {
        setNeedsApproval(needsApproval);
      }
      const StaderWithdrawContractAddress =
        "0x7F09ceb3874F5E35Cd2135F56fd4329b88c5d119";
      const tokenContractAddress = "0xB4F5fc289a778B80392b86fa70A7111E5bE0F859";
      const signer = provider.getSigner();
      const amountInWei = ethers.utils.parseEther(amount);
      const address = await signer.getAddress();

      const tokenContract = new ethers.Contract(
        tokenContractAddress,
        StaderABI,
        signer
      );

      const allowance = await tokenContract.allowance(
        address,
        StaderWithdrawContractAddress
      );

      if (allowance.lt(amountInWei)) {
        const tx = await tokenContract.approve(
          StaderWithdrawContractAddress,
          amountInWei
        );
        const receipt = await tx.wait();
        setTxHash(
          `Approval successful, please confirm unstake transaction. Hash: ${receipt.transactionHash}`
        );
        return receipt.transactionHash;
      }

      const erc20 = new ethers.Contract(
        StaderWithdrawContractAddress,
        StaderABI,
        signer
      );
      const tx = await erc20.requestWithdraw(amountInWei, address);
      const receipt = await tx.wait();
      setTxHash(
        `Unstaking successful, transaction hash: ${receipt.transactionHash}`
      );
      return receipt.transactionHash;
    } catch (error) {
      throw new Error(`Unstaking failed: ${JSON.stringify(error)}`);
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
      const tokenContractAddress = "0xB4F5fc289a778B80392b86fa70A7111E5bE0F859";
      const tokenContract = new ethers.Contract(
        tokenContractAddress,
        ["function balanceOf(address account) view returns (uint256)"],
        customProvider
      );
      const balanceResponse = await tokenContract.balanceOf(address);
      const balanceInEther = ethers.utils.formatEther(balanceResponse);
      return parseFloat(balanceInEther);
    } catch (error) {
      return 0;
    }
  };
  return {
    stake,
    unstake,
    fetchBalance,
    fetchStakedBalance,
  };
};
