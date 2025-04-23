import { Test, TestingModule } from '@nestjs/testing';
import { EthersService } from './ethers.service';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

describe('EthersService', () => {
  let service: EthersService;
  const mockGetBalance = jest.fn();
  const mockSendTransaction = jest.fn();

  const mockProvider = {
    getBalance: mockGetBalance,
  };

  const mockWallet1 = {
    address: '0xAccount1',
    getNonce: jest.fn().mockResolvedValue(1),
    sendTransaction: mockSendTransaction,
  };

  const mockWallet2 = {
    address: '0xAccount2',
    sendTransaction: mockSendTransaction,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    jest
      .spyOn(ethers, 'JsonRpcProvider')
      .mockImplementation(() => mockProvider as any);
    jest
      .spyOn(ethers, 'Wallet')
      .mockImplementationOnce(() => mockWallet1 as any)
      .mockImplementationOnce(() => mockWallet2 as any);
    jest
      .spyOn(ethers, 'parseEther')
      .mockImplementation((value: string) => BigInt(Number(value) * 1e18));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EthersService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              if (key === 'RPC_URL') return 'https://mock.rpc';
              if (key === 'ACCOUNT1_PRIVATE_KEY') return 'account1PrivateKey';
              if (key === 'ACCOUNT2_PRIVATE_KEY') return 'account2PrivateKey';
            },
          },
        },
      ],
    }).compile();

    service = module.get<EthersService>(EthersService);
  });

  it('getAccount1()는 account1 주소를 반환해야 합니다.', () => {
    expect(service.getAccount1().address).toBe('0xAccount1');
  });

  it('getAccount2()는 account2 주소를 반환해야 합니다.', () => {
    expect(service.getAccount2().address).toBe('0xAccount2');
  });

  it('getNonce()는 account의 nonce를 반환해야 합니다.', async () => {
    const nonce = await service.getNonce(mockWallet1 as any);
    expect(nonce).toBe(1);
  });

  it('getBalance()는 account1의 잔액을 반환해야 합니다.', async () => {
    mockGetBalance.mockResolvedValue(BigInt(10e18));
    const balance = await service.getBalance();
    expect(balance).toBe(BigInt(10e18));
    expect(mockGetBalance).toHaveBeenCalledWith('0xAccount1');
  });

  it('send1ETH()는 account1이 account2에 1ETH를 전송해야 합니다.', async () => {
    await service.send1ETH(7);
    expect(mockSendTransaction).toHaveBeenCalledWith({
      to: '0xAccount2',
      value: BigInt(1e18),
      nonce: 7,
    });
  });

  it('send30ETH()는 account2가 account1에 30ETH를 전송해야 합니다.', async () => {
    await service.send30ETH();
    expect(mockSendTransaction).toHaveBeenCalledWith({
      to: '0xAccount1',
      value: BigInt(30e18),
    });
  });
});
