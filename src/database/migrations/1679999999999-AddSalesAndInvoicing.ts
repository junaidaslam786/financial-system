import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSalesAndInvoicing1672000000000 implements MigrationInterface {
  // Constants for table names
  private readonly TABLE_SALES_ORDERS = 'sales_orders';
  private readonly TABLE_SALES_ORDER_LINES = 'sales_order_lines';
  private readonly TABLE_INVOICES = 'invoices';
  private readonly TABLE_INVOICE_ITEMS = 'invoice_items';
  private readonly TABLE_CREDIT_NOTES = 'credit_notes';
  private readonly TABLE_DEBIT_NOTES = 'debit_notes';
  private readonly TABLE_PAYMENTS = 'payments';
  private readonly TABLE_PAYMENT_METHODS = 'payment_methods';
  private readonly TABLE_TRANSACTIONS_PAYMENTS = 'transactions_payments';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure UUID extension is enabled
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // 1. Create `sales_orders` table
    await queryRunner.query(`
      CREATE TABLE ${this.TABLE_SALES_ORDERS} (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
        order_number VARCHAR(100) UNIQUE,
        order_date DATE DEFAULT CURRENT_DATE,
        auto_invoicing BOOLEAN DEFAULT FALSE,
        status VARCHAR(50) DEFAULT 'Pending' CHECK(status IN('Pending', 'Confirmed', 'Shipped', 'Completed', 'Cancelled')),
        total_amount NUMERIC(15, 2),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create indexes for `sales_orders`
    await queryRunner.query(`
      CREATE INDEX idx_${this.TABLE_SALES_ORDERS}_company_id ON ${this.TABLE_SALES_ORDERS}(company_id);
      
    `);

    // 2. Create `sales_order_lines` table
    await queryRunner.query(`
      CREATE TABLE ${this.TABLE_SALES_ORDER_LINES} (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        sales_order_id UUID NOT NULL REFERENCES ${this.TABLE_SALES_ORDERS}(id) ON UPDATE CASCADE ON DELETE CASCADE,
        lot_id UUID REFERENCES lots(id) ON UPDATE CASCADE ON DELETE SET NULL,
        product_id UUID REFERENCES products(id) ON UPDATE CASCADE ON DELETE SET NULL,
        quantity NUMERIC(12, 2) CHECK(quantity >= 0),
        unit_price NUMERIC(12, 2) CHECK(unit_price >= 0),
        discount NUMERIC(12, 2) DEFAULT 0.00 CHECK(discount >= 0),
        tax_rate NUMERIC(5, 2) DEFAULT 0.00 CHECK(tax_rate >= 0),
        total_line_amount NUMERIC(12, 2) GENERATED ALWAYS AS (
          (quantity * unit_price) - discount +
          ((quantity * unit_price - discount) * (tax_rate / 100))
        ) STORED
      );
    `);

    // Create indexes for `sales_order_lines`
    await queryRunner.query(`
      CREATE INDEX idx_${this.TABLE_SALES_ORDER_LINES}_sales_order_id ON ${this.TABLE_SALES_ORDER_LINES}(sales_order_id);
      CREATE INDEX idx_${this.TABLE_SALES_ORDER_LINES}_product_id ON ${this.TABLE_SALES_ORDER_LINES}(product_id);
      CREATE INDEX idx_${this.TABLE_SALES_ORDER_LINES}_lot_id ON ${this.TABLE_SALES_ORDER_LINES}(lot_id);
    `);

    // 3. Create `invoices` table
    await queryRunner.query(`
      CREATE TABLE ${this.TABLE_INVOICES} (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
        invoice_type VARCHAR(20) NOT NULL CHECK (invoice_type IN ('Purchase','Sale')),
        
        invoice_number VARCHAR(100) UNIQUE,
        invoice_date DATE DEFAULT CURRENT_DATE,
        due_date DATE,
        total_amount NUMERIC(15, 2) CHECK(total_amount >= 0),
        currency VARCHAR(10),
        status VARCHAR(50) DEFAULT 'Unpaid' CHECK(status IN('Unpaid', 'Paid', 'Partially Paid', 'Cancelled')),
        terms_and_conditions TEXT,
        notes TEXT,
        sales_order_id UUID REFERENCES sales_orders(id) ON UPDATE CASCADE ON DELETE SET NULL,
        purchase_order_id UUID REFERENCES purchase_orders(id) ON UPDATE CASCADE ON DELETE SET NULL,
        journal_entry_id UUID REFERENCES journal_entries(id) ON UPDATE CASCADE ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create indexes for `invoices`
    await queryRunner.query(`
      CREATE INDEX idx_${this.TABLE_INVOICES}_company_id ON ${this.TABLE_INVOICES}(company_id);
      CREATE INDEX idx_${this.TABLE_INVOICES}_purchase_order_id ON ${this.TABLE_INVOICES}(purchase_order_id);
      CREATE INDEX idx_${this.TABLE_INVOICES}_sales_order_id ON ${this.TABLE_INVOICES}(sales_order_id);
      CREATE INDEX idx_${this.TABLE_INVOICES}_journal_entry_id ON ${this.TABLE_INVOICES}(journal_entry_id);
    `);

    // 4. Create `invoice_items` table
    await queryRunner.query(`
      CREATE TABLE ${this.TABLE_INVOICE_ITEMS} (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        invoice_id UUID NOT NULL REFERENCES ${this.TABLE_INVOICES}(id) ON UPDATE CASCADE ON DELETE CASCADE,
        lot_id UUID REFERENCES lots(id) ON UPDATE CASCADE ON DELETE SET NULL,
        product_id UUID REFERENCES products(id) ON UPDATE CASCADE ON DELETE SET NULL,
        description TEXT,
        quantity NUMERIC(12, 2) CHECK(quantity >= 0),
        unit_price NUMERIC(12, 2) CHECK(unit_price >= 0),
        discount NUMERIC(12, 2) DEFAULT 0.00 CHECK(discount >= 0),
        tax_rate NUMERIC(5, 2) DEFAULT 0.00 CHECK(tax_rate >= 0),
        total_price NUMERIC(12, 2)
      );
    `);

    // Create indexes for `invoice_items`
    await queryRunner.query(`
      CREATE INDEX idx_${this.TABLE_INVOICE_ITEMS}_invoice_id ON ${this.TABLE_INVOICE_ITEMS}(invoice_id);
      CREATE INDEX idx_${this.TABLE_INVOICE_ITEMS}_product_id ON ${this.TABLE_INVOICE_ITEMS}(product_id);
      CREATE INDEX idx_${this.TABLE_INVOICE_ITEMS}_lot_id ON ${this.TABLE_INVOICE_ITEMS}(lot_id);
    `);

    // 5. Create `credit_notes` table
    await queryRunner.query(`
      CREATE TABLE ${this.TABLE_CREDIT_NOTES} (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
        invoice_id UUID REFERENCES ${this.TABLE_INVOICES}(id) ON UPDATE CASCADE ON DELETE SET NULL,
        note_number VARCHAR(100) UNIQUE,
        note_date DATE DEFAULT CURRENT_DATE,
        amount NUMERIC(15, 2) CHECK(amount >= 0),
        reason TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create indexes for `credit_notes`
    await queryRunner.query(`
      CREATE INDEX idx_${this.TABLE_CREDIT_NOTES}_company_id ON ${this.TABLE_CREDIT_NOTES}(company_id);
      CREATE INDEX idx_${this.TABLE_CREDIT_NOTES}_invoice_id ON ${this.TABLE_CREDIT_NOTES}(invoice_id);
    `);

    // 6. Create `debit_notes` table
    await queryRunner.query(`
      CREATE TABLE ${this.TABLE_DEBIT_NOTES} (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
        invoice_id UUID REFERENCES ${this.TABLE_INVOICES}(id) ON UPDATE CASCADE ON DELETE SET NULL,
        note_number VARCHAR(100) UNIQUE,
        note_date DATE DEFAULT CURRENT_DATE,
        amount NUMERIC(15, 2) CHECK(amount >= 0),
        reason TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create indexes for `debit_notes`
    await queryRunner.query(`
      CREATE INDEX idx_${this.TABLE_DEBIT_NOTES}_company_id ON ${this.TABLE_DEBIT_NOTES}(company_id);
      CREATE INDEX idx_${this.TABLE_DEBIT_NOTES}_invoice_id ON ${this.TABLE_DEBIT_NOTES}(invoice_id);
    `);

    // 7. Create `payments` table
    await queryRunner.query(`
      CREATE TABLE ${this.TABLE_PAYMENTS} (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
        invoice_id UUID REFERENCES ${this.TABLE_INVOICES}(id) ON UPDATE CASCADE ON DELETE SET NULL,
        payment_date DATE DEFAULT CURRENT_DATE,
        amount NUMERIC(15, 2) CHECK(amount >= 0),
        payment_method_id UUID REFERENCES ${this.TABLE_PAYMENT_METHODS}(id) ON UPDATE CASCADE ON DELETE SET NULL,
        journal_entry_id UUID REFERENCES journal_entries(id) ON UPDATE CASCADE ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create indexes for `payments`
    await queryRunner.query(`
      CREATE INDEX idx_${this.TABLE_PAYMENTS}_company_id ON ${this.TABLE_PAYMENTS}(company_id);
      CREATE INDEX idx_${this.TABLE_PAYMENTS}_invoice_id ON ${this.TABLE_PAYMENTS}(invoice_id);
      CREATE INDEX idx_${this.TABLE_PAYMENTS}_payment_method_id ON ${this.TABLE_PAYMENTS}(payment_method_id);
      CREATE INDEX idx_${this.TABLE_PAYMENTS}_journal_entry_id ON ${this.TABLE_PAYMENTS}(journal_entry_id);
    `);

    // 8. Create `payment_methods` table
    await queryRunner.query(`
      CREATE TABLE ${this.TABLE_PAYMENT_METHODS} (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
        method_name VARCHAR(100) NOT NULL,
        details TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create indexes for `payment_methods`
    await queryRunner.query(`
      CREATE INDEX idx_${this.TABLE_PAYMENT_METHODS}_company_id ON ${this.TABLE_PAYMENT_METHODS}(company_id);
    `);

    // 9. Create `transactions_payments` table
    await queryRunner.query(`
      CREATE TABLE ${this.TABLE_TRANSACTIONS_PAYMENTS} (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        related_transaction_id UUID,
        payment_method_id UUID REFERENCES ${this.TABLE_PAYMENT_METHODS}(id) ON UPDATE CASCADE ON DELETE SET NULL,
        amount NUMERIC(12, 2) CHECK(amount >= 0),
        payment_date DATE DEFAULT CURRENT_DATE
      );
    `);

    // Create indexes for `transactions_payments`
    await queryRunner.query(`
      CREATE INDEX idx_${this.TABLE_TRANSACTIONS_PAYMENTS}_payment_method_id ON ${this.TABLE_TRANSACTIONS_PAYMENTS}(payment_method_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE IF EXISTS ${this.TABLE_TRANSACTIONS_PAYMENTS}`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS idx_payments_payment_method_id;`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS idx_payments_journal_entry_id`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS ${this.TABLE_PAYMENT_METHODS}`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.TABLE_PAYMENTS}`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.TABLE_DEBIT_NOTES}`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.TABLE_CREDIT_NOTES}`);
    // drop invoice_items first
    await queryRunner.query(
      `DROP INDEX IF EXISTS idx_invoice_items_product_id;`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS idx_invoice_items_invoice_id;`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS idx_invoice_items_lot_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.TABLE_INVOICE_ITEMS}`);
    // drop invoices
    await queryRunner.query(
      `DROP INDEX IF EXISTS idx_invoices_journal_entry_id;`,
    );
    
    await queryRunner.query(`DROP INDEX IF EXISTS idx_invoices_company_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.TABLE_INVOICES}`);
    await queryRunner.query(
      `DROP TABLE IF EXISTS ${this.TABLE_SALES_ORDER_LINES}`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.TABLE_SALES_ORDERS}`);
  }
}
