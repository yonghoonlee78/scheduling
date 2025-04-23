import { Injectable, Logger } from '@nestjs/common';
import { EthersService } from '../../ethers/ethers.service';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(private readonly ethersService: EthersService) {}

  /*
    logger 사용 예시:
    - 일반적: 일반적인 상태 메시지, 성공 메시지
      this.logger.log(일반적인 로그);

    - 경고: 문제가 생길 가능성이 있는 상황, 부작용 우려
      this.logger.warn(경고 로그);

    - 에러: 실제 예외 발생, 로직 중단, 시스템 오류 등
      this.logger.error(에러)
  */

  async getBalance() {
    try {
      // Todo: getBalance의 결과 값을 로그('[getBalance] ${formatted}')로 출력합니다.
      // ⚠️ 로그 출력은 ETH 단위로 출력해야 합니다.(formatEther)
    } catch (error) {
      //  Todo: 에러 메세지를 에러 로그로 출력합니다.
    }
  }

  async tenTimesOneEthTransfer() {
    const start = Date.now();
    const tenTime = 10;
    let result: boolean = false;

    try {
      // Todo: send1ETH 실행을 10번 반복하고, 반복이 끝나면 result의 상태를 true로 변경합니다.
    } catch (error) {
      //  Todo: 에러 메세지를 에러 로그로 출력합니다.
    } finally {
      // Todo: tenTimesOneEthTransfer가 성공적으로 실행되었을 때만 실행 시간을 로그('[tenTimesOneEthTransfer] 실행 시간: ${end - start}ms'로 출력합니다.
    }
  }

  async thirtyEthTransfer() {
    try {
      // Todo: send30ETH 실행을 1번 반복하고, 성공 로그('[thirtyEthTransfer] 30 ETH 전송 성공')를 출력합니다.
    } catch (error) {
      //  Todo: 에러 메세지를 에러 로그로 출력합니다.
    }
  }
}
