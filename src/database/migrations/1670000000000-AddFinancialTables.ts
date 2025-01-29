import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFinancialTables1670000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create currencies table
    await queryRunner.query(`
      CREATE TABLE currencies (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        currency_code VARCHAR(10) NOT NULL UNIQUE,
        currency_name VARCHAR(100),
        symbol VARCHAR(10),
        decimal_places INT DEFAULT 2 CHECK(decimal_places >= 0)
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_currencies_code ON currencies(currency_code);
    `);

    // 2. Create exchange_rates table
    await queryRunner.query(`
      CREATE TABLE exchange_rates (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        base_currency VARCHAR(10) NOT NULL,
        target_currency VARCHAR(10) NOT NULL,
        rate NUMERIC(18,6),
        effective_date DATE DEFAULT CURRENT_DATE,
        CHECK(base_currency <> target_currency)
      );
    `);

    // Optional: add FKs for currency references if desired
    // await queryRunner.query(`
    //   ALTER TABLE exchange_rates
    //   ADD FOREIGN KEY (base_currency) REFERENCES currencies(currency_code)
    //       ON UPDATE CASCADE ON DELETE RESTRICT,
    //   ADD FOREIGN KEY (target_currency) REFERENCES currencies(currency_code)
    //       ON UPDATE CASCADE ON DELETE RESTRICT;
    // `);

    await queryRunner.query(`
      CREATE INDEX idx_exchange_rates_base_target 
      ON exchange_rates(base_currency, target_currency);
    `);

    // 3. Create accounts table
    await queryRunner.query(`
      CREATE TABLE accounts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
        account_name VARCHAR(255) NOT NULL,
        account_type VARCHAR(100) NOT NULL,
        parent_account_id UUID REFERENCES accounts(id) ON UPDATE CASCADE ON DELETE SET NULL,
        currency VARCHAR(10),
        initial_balance numeric(15,2) DEFAULT 0,
        initial_balance_type varchar(10),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Optional: enforce that account currency must be valid
    // await queryRunner.query(`
    //   ALTER TABLE accounts
    //   ADD FOREIGN KEY (currency) REFERENCES currencies(currency_code)
    //       ON UPDATE CASCADE ON DELETE RESTRICT;
    // `);

    await queryRunner.query(`
      CREATE INDEX idx_accounts_company_id ON accounts(company_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_accounts_parent_account_id ON accounts(parent_account_id);
    `);

    // 4. Create journal_entries table
    await queryRunner.query(`
      CREATE TABLE journal_entries (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
        entry_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        reference VARCHAR(100),
        description TEXT,
        created_by UUID REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_journal_entries_company_id ON journal_entries(company_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_journal_entries_created_by ON journal_entries(created_by);
    `);

    // 5. Create journal_lines table
    await queryRunner.query(`
      CREATE TABLE journal_lines (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        journal_entry_id UUID NOT NULL REFERENCES journal_entries(id) ON UPDATE CASCADE ON DELETE CASCADE,
        account_id UUID NOT NULL REFERENCES accounts(id) ON UPDATE CASCADE ON DELETE CASCADE,
        debit NUMERIC(15,2) DEFAULT 0.00 CHECK(debit >= 0),
        credit NUMERIC(15,2) DEFAULT 0.00 CHECK(credit >= 0),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_journal_lines_journal_entry_id ON journal_lines(journal_entry_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_journal_lines_account_id ON journal_lines(account_id);
    `);

    // 6. Create price_lists table
    await queryRunner.query(`
      CREATE TABLE price_lists (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
        list_name VARCHAR(100) NOT NULL,
        currency VARCHAR(10),
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Optional: enforce currency validity
    // await queryRunner.query(`
    //   ALTER TABLE price_lists
    //   ADD FOREIGN KEY (currency) REFERENCES currencies(currency_code)
    //       ON UPDATE CASCADE ON DELETE RESTRICT;
    // `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX idx_price_lists_company_list_name 
      ON price_lists(company_id, list_name);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_price_lists_company_id ON price_lists(company_id);
    `);

    await queryRunner.query(`
      ALTER TABLE companies
      ADD COLUMN default_ar_account_id UUID REFERENCES accounts(id) ON UPDATE CASCADE ON DELETE SET NULL,
      ADD COLUMN default_ap_account_id UUID REFERENCES accounts(id) ON UPDATE CASCADE ON DELETE SET NULL,
      ADD COLUMN default_cash_account_id UUID REFERENCES accounts(id) ON UPDATE CASCADE ON DELETE SET NULL,
      ADD COLUMN default_sales_account_id UUID REFERENCES accounts(id) ON UPDATE CASCADE ON DELETE SET NULL,
      ADD COLUMN default_inventory_account_id UUID REFERENCES accounts(id) ON UPDATE CASCADE ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order

    await queryRunner.query(`
      ALTER TABLE companies
      DROP COLUMN IF EXISTS default_ar_account_id,
      DROP COLUMN IF EXISTS default_ap_account_id,
      DROP COLUMN IF EXISTS default_cash_account_id,
      DROP COLUMN IF EXISTS default_sales_account_id,
      DROP COLUMN IF EXISTS default_inventory_account_id
    `);

    // 6. price_lists
    await queryRunner.query(`DROP INDEX IF EXISTS idx_price_lists_company_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_price_lists_company_list_name;`);
    await queryRunner.query(`DROP TABLE IF EXISTS price_lists;`);

    // 5. journal_lines
    await queryRunner.query(`DROP INDEX IF EXISTS idx_journal_lines_account_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_journal_lines_journal_entry_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS journal_lines;`);

    // 4. journal_entries
    await queryRunner.query(`DROP INDEX IF EXISTS idx_journal_entries_created_by;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_journal_entries_company_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS journal_entries;`);

    // 3. accounts
    await queryRunner.query(`DROP INDEX IF EXISTS idx_accounts_parent_account_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_accounts_company_id;`);
    // If you had added a foreign key for currency, you may need to drop it first.
    // e.g. await queryRunner.query(`ALTER TABLE accounts DROP CONSTRAINT accounts_currency_fkey;`);
    await queryRunner.query(`DROP TABLE IF EXISTS accounts;`);

    // 2. exchange_rates
    await queryRunner.query(`DROP INDEX IF EXISTS idx_exchange_rates_base_target;`);
    // If you had added foreign keys for base/target currency, drop them here.
    // e.g. await queryRunner.query(`ALTER TABLE exchange_rates DROP CONSTRAINT exchange_rates_base_currency_fkey;`);
    await queryRunner.query(`DROP TABLE IF EXISTS exchange_rates;`);

    // 1. currencies
    await queryRunner.query(`DROP INDEX IF EXISTS idx_currencies_code;`);
    await queryRunner.query(`DROP TABLE IF EXISTS currencies;`);
  }
}
