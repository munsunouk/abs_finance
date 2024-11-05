import { ethers } from "ethers";
import { RocketPoolABI } from "@/app/abi/RocketPoolABI";
import { EthereumHolesky } from "@particle-network/chains";

interface RocketPoolStakingProps {
  provider: any;
  smartAccount: any;
  customProvider: any;
  amount: string;
  setTxHash: (result: string) => void;
}

export const useRocketPoolStaking = ({
  provider,
  smartAccount,
  customProvider,
  amount,
  setTxHash,
}: RocketPoolStakingProps) => {
  const stake = async (
    amount: string,
    provider: ethers.providers.Web3Provider
  ): Promise<string> => {
    try {
      const rocketPoolDepositContractAddressHolesky =
        "0x7F09ceb3874F5E35Cd2135F56fd4329b88c5d119";
      const signer = provider.getSigner();
      const amountInWei = ethers.utils.parseEther(amount);
      const address = await signer.getAddress();

      const erc20 = new ethers.Contract(
        rocketPoolDepositContractAddressHolesky,
        RocketPoolABI,
        signer
      );

      setTxHash(
        `Staking begin...`
      );

      const tx = await erc20.deposit(address,'',{
        value: amountInWei,
      });


      const receipt = await tx.wait();

      setTxHash(
        `Staking successful, transaction hash:: ${receipt.transactionHash}`
      );

      return receipt.transactionHash;
    } catch (error) {

      setTxHash(
        `Staking failed: ${JSON.stringify(error)}`
      );

      throw new Error(`Staking failed: ${JSON.stringify(error)}`);
    }
  };

  const unstake = async (
    amount: string,
    provider: ethers.providers.Web3Provider,
  ): Promise<string> => {

    try {
      const rETHContractAddressHolesky =
        "0x3F6F1C1081744c18Bd67DD518F363B9d4c76E1d2";
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      const amountInWei = ethers.utils.parseEther(amount);

      const erc20 = new ethers.Contract(
        rETHContractAddressHolesky,
        RocketPoolABI,
        signer
      );

      // const tx = await erc20.approve(address, amountInWei);
      //   const receipt = await tx.wait();

      // const allowance = await erc20.allowance(address);

      // if (allowance.lt(amountInWei)) {
      //   const tx = await erc20.approve(address, amountInWei);
      //   const receipt = await tx.wait();
      // }

      const tx = await erc20.requestWithdraw(amountInWei, address);
      const receipt = await tx.wait();

      setTxHash(
        `Staking successful, transaction hash:: ${receipt.transactionHash}`
      );

      return receipt.transactionHash;
    } catch (error) {

      setTxHash(
        `Unstaking failed: ${JSON.stringify(error)}`
      );

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
      const rETHContractAddress = "0x7322c24752f79c05FFD1E2a6FCB97020C1C264F1";

      const rETHContract = new ethers.Contract(
        rETHContractAddress,
        ["function balanceOf(address account) view returns (uint256)"],
        customProvider
      );

      const balanceResponse = await rETHContract.balanceOf(address);
      const balanceInEther = ethers.utils.formatEther(balanceResponse);
      return parseFloat(balanceInEther);
    } catch (error) {
      console.error("rETH 잔액 조회 실패:", error);
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
