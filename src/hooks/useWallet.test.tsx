import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';

jest.mock('ethers', () => ({
  ethers: {
    BrowserProvider: jest.fn(),
    formatEther: jest.fn((val) => val.toString()),
    getAddress: jest.fn((address) => address),
  },
}));

const mockEthereum = {
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
};

(global.window as any).window.ethereum = mockEthereum;

const TestComponent: React.FC = () => {
  const {
    isConnected,
    address,
    balance,
    chainId,
    connectWallet,
    disconnectWallet
  } = useWallet();
  
  return (
    <div>
      <div data-testid="connected">{isConnected.toString()}</div>
      <div data-testid="address">{address || 'No address'}</div>
      <div data-testid="balance">{balance || 'No balance'}</div>
      <div data-testid="chainId">{chainId?.toString() || 'No chainId'}</div>
      <button onClick={connectWallet}>Connect</button>
      <button onClick={disconnectWallet}>Disconnect</button>
    </div>
  );
};

describe('useWallet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('connected')).toHaveTextContent('false');
    expect(screen.getByTestId('address')).toHaveTextContent('No address');
    expect(screen.getByTestId('balance')).toHaveTextContent('No balance');
    expect(screen.getByTestId('chainId')).toHaveTextContent('No chainId');
  });

  it('should connect wallet successfully', async () => {
    const mockProvider = {
      getSigner: jest.fn().mockResolvedValue({
        getAddress: jest.fn().mockResolvedValue('0x123'),
      }),
      getBalance: jest.fn().mockResolvedValue('1000000000000000000'),
      getNetwork: jest.fn().mockResolvedValue({ chainId: 1 }),
    };
  
    (ethers.BrowserProvider as jest.Mock).mockImplementation(() => mockProvider);
  
    render(<TestComponent />);
  
    await act(async () => {
      userEvent.click(screen.getByText('Connect'));

      await new Promise(resolve => setTimeout(resolve, 100));
    });
  
    console.log('Connected:', screen.getByTestId('connected').textContent);
    console.log('Address:', screen.getByTestId('address').textContent);
    console.log('Balance:', screen.getByTestId('balance').textContent);
    console.log('ChainId:', screen.getByTestId('chainId').textContent);
  
    expect(screen.getByTestId('connected')).toHaveTextContent('true');
    expect(screen.getByTestId('address')).toHaveTextContent('0x123');
    expect(screen.getByTestId('balance')).toHaveTextContent('1000000000000000000');
    expect(screen.getByTestId('chainId')).toHaveTextContent('1');
  });

  it('should handle connection error', async () => {
    (ethers.BrowserProvider as jest.Mock).mockImplementation(() => {
      throw new Error('Connection failed');
    });

    render(<TestComponent />);

    await act(async () => {
      userEvent.click(screen.getByText('Connect'));
    });

    expect(screen.getByTestId('connected')).toHaveTextContent('false');
  });

  it('should disconnect wallet', async () => {
    render(<TestComponent />);

    await act(async () => {
      userEvent.click(screen.getByText('Disconnect'));
    });

    expect(screen.getByTestId('connected')).toHaveTextContent('false');
    expect(screen.getByTestId('address')).toHaveTextContent('No address');
    expect(screen.getByTestId('balance')).toHaveTextContent('No balance');
    expect(screen.getByTestId('chainId')).toHaveTextContent('No chainId');
  });
});