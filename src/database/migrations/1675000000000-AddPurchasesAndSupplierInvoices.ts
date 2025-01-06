import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPurchasesAndSupplierInvoices1675000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure the UUID extension is available (if not already).
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // 1) purchase_orders table
    await queryRunner.query(`
      CREATE TABLE "purchase_orders" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "company_id" UUID NOT NULL
          REFERENCES "companies"("id")
          ON UPDATE CASCADE
          ON DELETE CASCADE,
        "supplier_id" UUID
          REFERENCES "suppliers"("id")
          ON UPDATE CASCADE
          ON DELETE SET NULL,
        "broker_id" UUID
          REFERENCES "brokers"("id")
          ON UPDATE CASCADE
          ON DELETE SET NULL,
        "order_number" VARCHAR(100) UNIQUE,
        "order_date" DATE DEFAULT CURRENT_DATE,
        "expected_delivery_date" DATE,
        "status" VARCHAR(50) DEFAULT 'Open'
          CHECK ("status" IN ('Open','Received','Closed','Cancelled')),
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_purchase_orders_company_id"
        ON "purchase_orders" ("company_id");
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_purchase_orders_supplier_id"
        ON "purchase_orders" ("supplier_id");
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_purchase_orders_broker_id"
        ON "purchase_orders" ("broker_id");
    `);

    // 2) purchase_order_lines table
    await queryRunner.query(`
      CREATE TABLE "purchase_order_lines" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "purchase_order_id" UUID NOT NULL
          REFERENCES "purchase_orders"("id")
          ON UPDATE CASCADE
          ON DELETE CASCADE,
        "product_id" UUID
          REFERENCES "products"("id")
          ON UPDATE CASCADE
          ON DELETE SET NULL,
        "quantity" NUMERIC(12,2)
          CHECK ("quantity" >= 0),
        "unit_price" NUMERIC(12,2)
          CHECK ("unit_price" >= 0),
        "discount" NUMERIC(12,2) DEFAULT 0.00
          CHECK ("discount" >= 0),
        "tax_rate" NUMERIC(5,2) DEFAULT 0.00
          CHECK ("tax_rate" >= 0),
        "total_line_amount" NUMERIC(12,2)
          GENERATED ALWAYS AS (
            (("quantity" * "unit_price") - "discount")
             + (
               (("quantity" * "unit_price") - "discount")
               * ("tax_rate" / 100)
             )
          ) STORED
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_purchase_order_lines_po_id"
        ON "purchase_order_lines" ("purchase_order_id");
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_purchase_order_lines_product_id"
        ON "purchase_order_lines" ("product_id");
    `);

    // 3) supplier_invoices table
    await queryRunner.query(`
      CREATE TABLE "supplier_invoices" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "company_id" UUID
          REFERENCES "companies"("id")
          ON UPDATE CASCADE
          ON DELETE CASCADE,
        "supplier_id" UUID
          REFERENCES "suppliers"("id")
          ON UPDATE CASCADE
          ON DELETE SET NULL,
        "broker_id" UUID
          REFERENCES "brokers"("id")
          ON UPDATE CASCADE
          ON DELETE SET NULL,
        "invoice_number" VARCHAR(100) UNIQUE,
        "invoice_date" DATE DEFAULT CURRENT_DATE,
        "due_date" DATE,
        "total_amount" NUMERIC(15,2)
          CHECK ("total_amount" >= 0),
        "currency" VARCHAR(10),
        "status" VARCHAR(50) DEFAULT 'Unpaid'
          CHECK ("status" IN ('Unpaid','Paid','Partially Paid','Cancelled')),
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_supplier_invoices_company_id"
        ON "supplier_invoices" ("company_id");
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_supplier_invoices_supplier_id"
        ON "supplier_invoices" ("supplier_id");
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_supplier_invoices_broker_id"
        ON "supplier_invoices" ("broker_id");
    `);

    // 4) supplier_invoice_items table
    await queryRunner.query(`
      CREATE TABLE "supplier_invoice_items" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "supplier_invoice_id" UUID NOT NULL
          REFERENCES "supplier_invoices"("id")
          ON UPDATE CASCADE
          ON DELETE CASCADE,
        "product_id" UUID
          REFERENCES "products"("id")
          ON UPDATE CASCADE
          ON DELETE SET NULL,
        "quantity" NUMERIC(12,2)
          CHECK ("quantity" >= 0),
        "unit_price" NUMERIC(12,2)
          CHECK ("unit_price" >= 0),
        "discount" NUMERIC(12,2) DEFAULT 0.00
          CHECK ("discount" >= 0),
        "tax_rate" NUMERIC(5,2) DEFAULT 0.00
          CHECK ("tax_rate" >= 0),
        "total_price" NUMERIC(12,2)
          GENERATED ALWAYS AS (
            (("quantity" * "unit_price") - "discount")
             + (
               (("quantity" * "unit_price") - "discount")
               * ("tax_rate" / 100)
             )
          ) STORED
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_supplier_invoice_items_invoice_id"
        ON "supplier_invoice_items" ("supplier_invoice_id");
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_supplier_invoice_items_product_id"
        ON "supplier_invoice_items" ("product_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop in reverse order to avoid FK constraints
    // 4) supplier_invoice_items
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_supplier_invoice_items_product_id";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_supplier_invoice_items_invoice_id";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "supplier_invoice_items";`);

    // 3) supplier_invoices
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_supplier_invoices_broker_id";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_supplier_invoices_supplier_id";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_supplier_invoices_company_id";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "supplier_invoices";`);

    // 2) purchase_order_lines
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_purchase_order_lines_product_id";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_purchase_order_lines_po_id";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "purchase_order_lines";`);

    // 1) purchase_orders
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_purchase_orders_broker_id";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_purchase_orders_supplier_id";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_purchase_orders_company_id";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "purchase_orders";`);
  }
}
