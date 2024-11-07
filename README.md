# ABS Finance - Cross-Chain Staking Platform

## Project Overview

ABS Finance is a cross-chain staking platform that leverages Particle Network's account abstraction technology to simplify staking across multiple chains. Users can access staking services on different chains with a single account.

## Key Features

- Social Login: Easy login via Email, Google, Twitter, Github, Discord
- Cross-chain Staking:
  - Ethereum Holesky (ETHx)
  - Base (superOETH)
  - BNB Chain (slisBNB)
- Real-time APR/APY Display
- Gasless Transactions
- Automatic Chain Switching

## Demo Screenshots

![ABS Finance UI](./public/abs-finance-ui.png)

## Technical Architecture

- Frontend
  - Next.js with TypeScript
    TailwindCSS for styling
  - Particle Network SDKs
  - ethers.js for blockchain interactions
- Smart Contract Integration

```
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
```

- Account Abstraction Implementation

```
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
```

## Key Technical Features

- Chain Abstraction
  - Seamless chain switching
  - Unified wallet interface
  - Cross-chain transaction handling
  - Social Login Integration

```
<AuthCoreContextProvider
  options={{
    // All env variable must be defined at runtime
            projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
            clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY!,
            appId: process.env.NEXT_PUBLIC_APP_ID!,

            // This is how you limit the options available.
            // Remove the authTypes array to display all options available
            authTypes: [
              AuthType.email,
              AuthType.google,
              AuthType.twitter,
              AuthType.github,
              AuthType.discord,
            ],
            themeType: "dark",
            fiatCoin: "USD",
            language: "en",
            erc4337: {
              name: "SIMPLE",
              version: "1.0.0",
            },
            wallet: {
              // Set to false to remove the embedded wallet modal
              visible: true,
              customStyle: {
                // Locks the chain selector to Base Sepolia and EthereumHolesky
                supportChains: [BNBChain, EthereumHolesky, Base],
              },
            },
          }}
```

- Real-time APY Tracking
  - Stader Protocol (ETH)
  - Origin Protocol (Base)
  - Lista Finance (BNB)
    Gasless Transactions
- Smart Account implementation
- Transaction sponsorship
- Batched transactions
- User Experience
  - Wallet Connection
  - Social login options
  - Traditional wallet connect
  - Email authentication
    Staking Interface
  - Token selection
  - Amount input with max button
  - Real-time rate display
  - Balance checking
    Transaction status updates
- Cross-chain Features
  - Automatic network switching
  - Gas fee abstraction
  - Unified transaction experience
    Security Features
  - Smart Contract Safety
  - Audited contract integration
  - Approval management
  - Transaction validation
- Account Security
  - Social recovery options
  - Multi-factor authentication
  - Session management

## Installation

1. Clone the repository

```
git clone https://github.com/your-repo/abs-finance
cd abs-finance
```

2. Set environment variables

```
NEXT_PUBLIC_PROJECT_ID=your_project_id
NEXT_PUBLIC_CLIENT_KEY=your_client_key
NEXT_PUBLIC_APP_ID=your_app_id
```

3. Install dependencies and run

```
npm install
npm run dev
```

## Future Development

- Platform Expansion
  - Additional chains integration
  - More staking protocols
  - Yield farming options
  - Feature Enhancement
  - Portfolio analytics
  - Yield optimization
  - Mobile app development
  - Infrastructure Upgrades
  - Layer 2 integration
  - Cross-chain messaging
- MEV protection
