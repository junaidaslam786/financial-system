import { HttpException, HttpStatus } from '@nestjs/common';

export class UnbalancedJournalEntryException extends HttpException {
  constructor(msg?: string) {
    super(msg || 'Journal entry is unbalanced (sum of debits != sum of credits)', HttpStatus.BAD_REQUEST);
  }
}
