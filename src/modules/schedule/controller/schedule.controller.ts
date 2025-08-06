import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ScheduleService } from '../service/schedule.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  // Todo: 30초마다 balance를 체크하는 스케쥴을 완성하여 주세요.
  @Cron('*/30 * * * * *')
  balanceMonitoring() {
    console.log('Balance monitoring started at:', new Date().toISOString());
    this.scheduleService.getBalance();
  }

  // Todo: 10초마다 1ETH를 10번 전송하는 스케쥴을 완성하여 주세요.
  @Cron('*/10 * * * * *')
  tenTimesOneEthTransfer() {
    console.log('Ten times 1ETH transfer started at:', new Date().toISOString());
    this.scheduleService.tenTimesOneEthTransfer();
  }

  // Todo: 30초마다 30ETH를 전송하는 스케쥴을 완성하여 주세요.
  @Cron('*/30 * * * * *') 
  thirtyEthTransfer() {
    console.log('30ETH transfer started at:', new Date().toISOString());
    this.scheduleService.thirtyEthTransfer();
  }
}
