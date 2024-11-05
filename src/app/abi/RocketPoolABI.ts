export const RocketPoolABI = [
  {
      inputs: [],
      name: 'deposit',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint256', name: '_rethAmount', type: 'uint256' }],
      name: 'burn',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'getExchangeRate',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256'
        }
      ],
      name: 'approve',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address'
        }
      ],
      name: 'allowance',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
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
        { internalType: 'string', name: '_referralId', type: 'string' }
      ],
      name: 'deposit',
      outputs: [
        { internalType: 'uint256', name: '_shares', type: 'uint256' }
      ],
      stateMutability: 'payable',
      type: 'function'
    }

]as const;
