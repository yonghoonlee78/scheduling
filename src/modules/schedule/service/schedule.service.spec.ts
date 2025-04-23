import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { EthersService } from '../../ethers/ethers.service';
import { Logger } from '@nestjs/common';

describe('ScheduleService', () => {
  let service: ScheduleService;
  const mockEthersService = {
    getBalance: jest.fn(),
    formatEther: jest.fn(),
    getNonce: jest.fn(),
    getAccount1: jest.fn(),
    send1ETH: jest.fn(),
    send30ETH: jest.fn(),
  };

  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(async () => {
    logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    errorSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => {});
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        { provide: EthersService, useValue: mockEthersService },
      ],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getBalance()', () => {
    it('잔액 조회 후 로그를 출력해야 합니다.', async () => {
      mockEthersService.getBalance.mockResolvedValue(BigInt(2e18));
      mockEthersService.formatEther.mockReturnValue('2.0');

      await service.getBalance();
      expect(logSpy).toHaveBeenCalledWith('[getBalance] 2.0');
    });

    it('에러 발생 시 에러 로그를 출력해야 합니다.', async () => {
      mockEthersService.getBalance.mockRejectedValue(
        new Error('getBalance error')
      );

      await service.getBalance();
      expect(errorSpy).toHaveBeenCalledWith('getBalance error');
    });
  });

  describe('tenTimesOneEthTransfer()', () => {
    it('10번 전송 후 실행 시간 로그를 출력해야 합니다.', async () => {
      mockEthersService.getNonce.mockResolvedValue(5);
      mockEthersService.getAccount1.mockReturnValue({});
      mockEthersService.send1ETH.mockResolvedValue(undefined);

      await service.tenTimesOneEthTransfer();

      expect(mockEthersService.send1ETH).toHaveBeenCalledTimes(10);
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringMatching(/tenTimesOneEthTransfer.*ms/)
      );
    });

    it('에러 발생 시 에러 로그만 출력해야 합니다.', async () => {
      mockEthersService.getNonce.mockResolvedValue(5);
      mockEthersService.getAccount1.mockReturnValue({});
      mockEthersService.send1ETH.mockRejectedValueOnce(new Error('fail'));

      await service.tenTimesOneEthTransfer();

      expect(errorSpy).toHaveBeenCalledWith('fail');
      expect(logSpy).not.toHaveBeenCalledWith(
        expect.stringMatching(/tenTimesOneEthTransfer.*ms/)
      );
    });
  });

  describe('thirtyEthTransfer()', () => {
    it('30ETH 전송 후 성공 로그를 출력해야 합니다.', async () => {
      mockEthersService.send30ETH.mockResolvedValue(undefined);

      await service.thirtyEthTransfer();

      expect(logSpy).toHaveBeenCalledWith(
        '[thirtyEthTransfer] 30 ETH 전송 성공'
      );
    });

    it('에러 발생 시 에러 로그를 출력해야 합니다.', async () => {
      mockEthersService.send30ETH.mockRejectedValue(
        new Error('transfer failed')
      );

      await service.thirtyEthTransfer();

      expect(errorSpy).toHaveBeenCalledWith('transfer failed');
    });
  });
});
