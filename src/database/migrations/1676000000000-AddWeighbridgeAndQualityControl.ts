import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWeighbridgeAndQualityControl1676000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure the UUID extension is available (if not already).
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // 1) weighbridge_tickets table
    await queryRunner.query(`
      CREATE TABLE "weighbridge_tickets" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "company_id" UUID NOT NULL
          REFERENCES "companies"("id")
          ON UPDATE CASCADE
          ON DELETE CASCADE,
        "ticket_number" VARCHAR(100) UNIQUE,
        "vehicle_number" VARCHAR(100),
        "inbound_weight" NUMERIC(15,2)
          CHECK ("inbound_weight" >= 0),
        "outbound_weight" NUMERIC(15,2)
          CHECK ("outbound_weight" >= 0),
        "net_weight" NUMERIC(15,2)
          GENERATED ALWAYS AS ("inbound_weight" - "outbound_weight") STORED,
        "material_type" VARCHAR(100),
        "lot_id" UUID
          REFERENCES "lots"("id")
          ON UPDATE CASCADE
          ON DELETE SET NULL,
        "date" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_weighbridge_tickets_company_id"
        ON "weighbridge_tickets" ("company_id");
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_weighbridge_tickets_lot_id"
        ON "weighbridge_tickets" ("lot_id");
    `);

    // 2) grain_quality_tests table
    await queryRunner.query(`
      CREATE TABLE "grain_quality_tests" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "lot_id" UUID
          REFERENCES "lots"("id")
          ON UPDATE CASCADE
          ON DELETE SET NULL,
        "test_date" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "moisture_content" NUMERIC(5,2)
          CHECK ("moisture_content" >= 0),
        "broken_grains_percentage" NUMERIC(5,2)
          CHECK ("broken_grains_percentage" >= 0),
        "foreign_matter_percentage" NUMERIC(5,2)
          CHECK ("foreign_matter_percentage" >= 0),
        "notes" TEXT,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_grain_quality_tests_lot_id"
        ON "grain_quality_tests" ("lot_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop in reverse order of creation

    // 2) grain_quality_tests
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_grain_quality_tests_lot_id";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "grain_quality_tests";`);

    // 1) weighbridge_tickets
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_weighbridge_tickets_lot_id";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_weighbridge_tickets_company_id";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "weighbridge_tickets";`);
  }
}
