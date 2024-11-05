export const StaderABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_ethXAmount',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_owner',
        type: 'address'
      }
    ],
    name: 'requestWithdraw',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_receiver', type: 'address' },
    ],
    name: 'deposit',
    outputs: [
      { internalType: 'uint256', name: '_shares', type: 'uint256' }
    ],
    stateMutability: 'payable',
    type: 'function'
  },

  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
        {
            name: 'spender',
            type: 'address',
        },
        {
            name: 'amount',
            type: 'uint256',
        },
    ],
    outputs: [
        {
            name: '',
            type: 'bool',
        },
    ],
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
      {
        name: '_spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
] as const;