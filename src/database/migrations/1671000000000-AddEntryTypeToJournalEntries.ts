import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEntryTypeColumnToJournalEntries1671000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE journal_entries
      ADD COLUMN "entryType" VARCHAR(50) DEFAULT 'GENERAL'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE journal_entries
      DROP COLUMN "entryType"
    `);
  }
}
