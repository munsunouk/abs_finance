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

      const erc20 = new ethers.Contract(
        lidoContractAddressHolesky,
        StethAbi,
        signer
      );

      const tx = await erc20.submit(lidoContractAddressHolesky, {
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
    signTypedData: (data: any) => Promise<string>
  ): Promise<string> => {
    try {
      createWalletClient({
        account: address,
        chain: mainnet,
        transport: custom(provider),
      });

      const sdk = new LidoSDK({
        chainId: 5,
        rpcUrls: ["https://eth-goerli.alchemyapi.io/v2/{ALCHEMY_API_KEY}"],
        web3Provider: provider, // optional
      });
    } catch (error) {
      throw new Error(`Unstaking failed: ${JSON.stringify(error)}`);
    }

    // try {
    //   const MAX_DEADLINE = BigInt(
    //     "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
    //   );
    //   const lidoContractAddressHolesky =
    //     "0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034";
    //   const lidoWithdrawalAddress =
    //     "0xc7cc160b58F8Bb0baC94b80847E2CF2800565C50";
    //   const signer = provider.getSigner();
    //   const owner = await signer.getAddress();
    //   const amountInWei = ethers.utils.parseEther(amount);
    //   const network = await provider.getNetwork();
    //   const stETHContract = new ethers.Contract(
    //     lidoContractAddressHolesky,
    //     ["function nonces(address owner) view returns (uint256)"],
    //     provider
    //   );
    //   const nonce = await stETHContract.nonces(owner);
    //   const typedData = {
    //     types: {
    //       EIP712Domain: [
    //         { name: "name", type: "string" },
    //         { name: "version", type: "string" },
    //         { name: "chainId", type: "uint256" },
    //         { name: "verifyingContract", type: "address" },
    //       ],
    //       Permit: [
    //         { name: "owner", type: "address" },
    //         { name: "spender", type: "address" },
    //         { name: "value", type: "uint256" },
    //         { name: "nonce", type: "uint256" },
    //         { name: "deadline", type: "uint256" },
    //       ],
    //     },
    //     domain: {
    //       name: "Liquid staked Ether 2.0",
    //       version: "2",
    //       chainId: network.chainId,
    //       verifyingContract: lidoContractAddressHolesky,
    //     },
    //     primaryType: "Permit",
    //     message: {
    //       owner,
    //       spender: lidoWithdrawalAddress,
    //       value: amountInWei.toString(),
    //       nonce: nonce.toString(),
    //       deadline: MAX_DEADLINE.toString(),
    //     },
    //   };
    //   setTxHash("Signing transaction...");
    //   const signature = await signTypedData({
    //     data: typedData,
    //     version: "V4",
    //     uniq: true,
    //   });
    //   const sig = ethers.utils.splitSignature(signature);
    //   const withdrawContract = new ethers.Contract(
    //     lidoWithdrawalAddress,
    //     StethAbi,
    //     signer
    //   );
    //   const tx = await withdrawContract.requestWithdrawalsWithPermit(
    //     [amountInWei],
    //     owner,
    //     [amountInWei, MAX_DEADLINE.toString(), sig.v, sig.r, sig.s],
    //     { gasLimit: 500000 }
    //   );
    //   setTxHash("Waiting for transaction confirmation...");
    //   const receipt = await tx.wait();
    //   return receipt.transactionHash;
    // } catch (error) {
    //   console.error("Unstaking error:", error);
    //   const errorMessage =
    //     error instanceof Error ? error.message : String(error);
    //   setTxHash(`Unstaking failed: ${errorMessage}`);
    //   throw new Error(`Unstaking failed: ${errorMessage}`);
    // }
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
