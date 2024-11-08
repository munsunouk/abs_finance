// DO NOT EDIT - GENERATED
export const OriginProtocolABI = [
    {
      inputs: [
        { internalType: 'address', name: '_oeth', type: 'address' },
        { internalType: 'address', name: '_vault', type: 'address' },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'minter',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'asset',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'Zap',
      type: 'event',
    },
    {
      inputs: [],
      name: 'deposit',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
        { internalType: 'uint256', name: 'minOETH', type: 'uint256' },
      ],
      name: 'depositSFRXETH',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'frxeth',
      outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'oeth',
      outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'sfrxeth',
      outputs: [{ internalType: 'contract ISfrxETH', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'vault',
      outputs: [{ internalType: 'contract IVault', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'weth',
      outputs: [{ internalType: 'contract IWETH9', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    { stateMutability: 'payable', type: 'receive' },
    {
      inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
      name: 'requestWithdrawal',
      outputs: [
        { internalType: 'uint256', name: 'requestId', type: 'uint256' },
        { internalType: 'uint256', name: 'queued', type: 'uint256' },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ] as const;