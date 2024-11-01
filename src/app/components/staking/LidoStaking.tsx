import { ethers } from "ethers";
import { StethAbi } from "@/app/abi/LidoContractABI";
import { EthereumHolesky } from "@particle-network/chains";

interface LidoStakingProps {
  provider: any;
  smartAccount: any;
  customProvider: any;
  amount: string;
  setStakeResult: (result: string) => void;
}

export const useLidoStaking = ({
  provider,
  smartAccount,
  customProvider,
  amount,
  setStakeResult,
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

      const erc20 = new ethers.Contract(
        lidoContractAddressHolesky,
        StethAbi,
        signer
      );

      const tx = await erc20.submit(lidoContractAddressHolesky, {
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