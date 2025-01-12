// src/modules/reports/reports.controller.ts

import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReportsService } from './reports.service';

// DTO imports
import { GetTrialBalanceDto } from './dtos/get-trial-balance.dto';
import { GetIncomeStatementDto } from './dtos/get-income-statement.dto';
import { GetBalanceSheetDto } from './dtos/get-balance-sheet.dto';
import { GetContactLedgerDto } from './dtos/get-contact-ledger.dto';
import { GetAgingDto } from './dtos/get-aging.dto';
import { ContactType } from 'src/common/enums/contact-type.enum';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * GET /reports/trial-balance
   * Query params: companyId, startDate?, endDate?
   */
  @Get('trial-balance')
  async getTrialBalance(
    @Query('companyId') companyId: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    if (!companyId) {
      throw new BadRequestException('companyId is required for trial balance.');
    }
    return this.reportsService.getTrialBalance({
      companyId,
      startDate,
      endDate,
    });
  }

  /**
   * GET /reports/income-statement
   * Query params: companyId, startDate?, endDate?
   */
  @Get('income-statement')
  async getIncomeStatement(
    @Query('companyId') companyId: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    if (!companyId) {
      throw new BadRequestException(
        'companyId is required for income statement.',
      );
    }
    return this.reportsService.getIncomeStatement({
      companyId,
      startDate,
      endDate,
    });
  }

  /**
   * GET /reports/balance-sheet
   * Query params: companyId, endDate?
   */
  @Get('balance-sheet')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getBalanceSheet(
    @Query('companyId') companyId: string,
    @Query('endDate') endDate?: Date,
  ) {
    if (!companyId) {
      throw new BadRequestException('companyId is required for balance sheet.');
    }
    return this.reportsService.getBalanceSheet({ companyId, endDate });
  }

  /**
   * GET /reports/contact-ledger
   * Query params: companyId, contactType, contactId
   */
  @Get('contact-ledger')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getContactLedger(
    @Query('companyId') companyId: string,
    @Query('contactType') contactType: ContactType,
    @Query('contactId') contactId: string,
  ) {
    if (!companyId) {
      throw new BadRequestException(
        'companyId is required for contact ledger.',
      );
    }
    return this.reportsService.getContactLedgerStatement({
      companyId,
      contactType,
      contactId,
    });
  }

  /**
   * GET /reports/aging
   * Query params: companyId, contactType
   */
  @Get('aging')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAgingReport(
    @Query('companyId') companyId: string,
    @Query('contactType') contactType: ContactType,
  ) {
    if (!companyId) {
      throw new BadRequestException('companyId is required for aging report.');
    }
    return this.reportsService.getAgingReport({ companyId, contactType });
  }
}
