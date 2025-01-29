import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContactLedger1770000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE contact_ledger_entries (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL REFERENCES companies(id)
          ON UPDATE CASCADE ON DELETE CASCADE,
        
        contact_type VARCHAR(50) NOT NULL
          CHECK(contact_type IN ('Supplier','Customer','Broker','Trader','Partner')),
        
        contact_id UUID NOT NULL,
        
        reference_type VARCHAR(50),  -- e.g. 'INVOICE', 'PAYMENT', 'CREDIT_NOTE'
        reference_id UUID,          -- link to invoice or payment ID, etc.
        
        debit NUMERIC(15,2) DEFAULT 0 CHECK(debit >= 0),
        credit NUMERIC(15,2) DEFAULT 0 CHECK(credit >= 0),
        
        entry_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        description TEXT,
        
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Optional: create an index to speed up queries by (company, contact)
    await queryRunner.query(`
      CREATE INDEX idx_contact_ledger_entries_company_contact 
      ON contact_ledger_entries(company_id, contact_type, contact_id);
    `);

    // Possibly also create an index on reference_id if you want quick lookups by invoice/payment ID
    await queryRunner.query(`
      CREATE INDEX idx_contact_ledger_entries_ref
      ON contact_ledger_entries(reference_type, reference_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_contact_ledger_entries_ref;
    `);
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_contact_ledger_entries_company_contact;
    `);
    await queryRunner.query(`
      DROP TABLE IF EXISTS contact_ledger_entries;
    `);
  }
}
