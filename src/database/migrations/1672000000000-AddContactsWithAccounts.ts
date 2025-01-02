import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContactsWithAccounts1672000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    
    await queryRunner.query(`
      CREATE TABLE suppliers (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
          supplier_name VARCHAR(255) NOT NULL,
          contact_info TEXT,
          payment_terms VARCHAR(100),
          default_price_list_id UUID REFERENCES price_lists(id) ON UPDATE CASCADE ON DELETE SET NULL,
          account_id UUID UNIQUE REFERENCES accounts(id) ON UPDATE CASCADE ON DELETE SET NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

   
    await queryRunner.query(`
      CREATE INDEX idx_suppliers_company_id ON suppliers(company_id);
    `);
    await queryRunner.query(`
      CREATE INDEX idx_suppliers_default_price_list_id 
      ON suppliers(default_price_list_id);
    `);
    // "account_id" has a UNIQUE constraint, which inherently creates an index.

    // 2) Create customers table
    await queryRunner.query(`
      CREATE TABLE customers (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
          customer_name VARCHAR(255) NOT NULL,
          contact_info TEXT,
          customer_type VARCHAR(100),
          credit_limit NUMERIC(12,2) CHECK(credit_limit >= 0),
          payment_terms VARCHAR(100),
          default_price_list_id UUID REFERENCES price_lists(id) ON UPDATE CASCADE ON DELETE SET NULL,
          account_id UUID UNIQUE REFERENCES accounts(id) ON UPDATE CASCADE ON DELETE SET NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

   
    await queryRunner.query(`
      CREATE INDEX idx_customers_company_id ON customers(company_id);
    `);
    await queryRunner.query(`
      CREATE INDEX idx_customers_default_price_list_id 
      ON customers(default_price_list_id);
    `);
    // account_id is UNIQUE => implicitly indexed

    await queryRunner.query(`
      CREATE TABLE traders (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
          trader_name VARCHAR(255) NOT NULL,
          contact_info TEXT,
          commission_rate NUMERIC(5,2) DEFAULT 0.00 CHECK(commission_rate >= 0),
          account_id UUID UNIQUE REFERENCES accounts(id) ON UPDATE CASCADE ON DELETE SET NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_traders_company_id ON traders(company_id);
    `);
    // account_id => unique index automatically

    // 4) Create brokers table
    await queryRunner.query(`
      CREATE TABLE brokers (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
          broker_name VARCHAR(255) NOT NULL,
          contact_info TEXT,
          default_brokerage_rate NUMERIC(5,2) DEFAULT 0.00 CHECK(default_brokerage_rate >= 0),
          account_id UUID UNIQUE REFERENCES accounts(id) ON UPDATE CASCADE ON DELETE SET NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_brokers_company_id ON brokers(company_id);
    `);
    // account_id => unique index automatically
    await queryRunner.query(`
      CREATE TABLE brokerage_agreements (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          broker_id UUID NOT NULL REFERENCES brokers(id) ON UPDATE CASCADE ON DELETE CASCADE,
          agreement_name VARCHAR(100),
          brokerage_rate NUMERIC(5,2) CHECK(brokerage_rate >= 0),
          valid_from DATE,
          valid_to DATE
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_brokerage_agreements_broker_id 
      ON brokerage_agreements(broker_id);
    `);

    await queryRunner.query(`
      CREATE TABLE brokerage_transactions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          broker_id UUID NOT NULL REFERENCES brokers(id) ON UPDATE CASCADE ON DELETE CASCADE,
          related_document_id UUID,
          document_type VARCHAR(50) CHECK(document_type IN('Invoice','PurchaseOrder','SalesOrder')),
          brokerage_amount NUMERIC(15,2) CHECK(brokerage_amount >= 0),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_brokerage_transactions_broker_id 
      ON brokerage_transactions(broker_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_brokerage_transactions_document_id 
      ON brokerage_transactions(related_document_id);
    `);

    await queryRunner.query(`
      CREATE TABLE contacts (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          entity_type VARCHAR(50) CHECK(entity_type IN('Customer','Supplier','Trader','Broker','Partner')),
          entity_id UUID NOT NULL,
          contact_name VARCHAR(255),
          phone VARCHAR(50),
          email VARCHAR(150),
          address TEXT,
          is_primary BOOLEAN DEFAULT FALSE
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_contacts_entity_type_id 
      ON contacts(entity_type, entity_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop in reverse order

    // 7) contacts
    await queryRunner.query(`DROP INDEX IF EXISTS idx_contacts_entity_type_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS contacts;`);

    // 6) brokerage_transactions
    await queryRunner.query(`DROP INDEX IF EXISTS idx_brokerage_transactions_document_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_brokerage_transactions_broker_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS brokerage_transactions;`);

    // 5) brokerage_agreements
    await queryRunner.query(`DROP INDEX IF EXISTS idx_brokerage_agreements_broker_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS brokerage_agreements;`);

    // 4) brokers
    await queryRunner.query(`DROP INDEX IF EXISTS idx_brokers_company_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS brokers;`);

    // 3) traders
    await queryRunner.query(`DROP INDEX IF EXISTS idx_traders_company_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS traders;`);

    // 2) customers
    await queryRunner.query(`DROP INDEX IF EXISTS idx_customers_default_price_list_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_customers_company_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS customers;`);

    // 1) suppliers
    await queryRunner.query(`DROP INDEX IF EXISTS idx_suppliers_default_price_list_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_suppliers_company_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS suppliers;`);
  }
}
