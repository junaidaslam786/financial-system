import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuditAndWorkflows1677000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure uuid-ossp extension if needed
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // 1) audit_trails table
    await queryRunner.query(`
      CREATE TABLE "audit_trails" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" UUID
          REFERENCES "users"("id")
          ON UPDATE CASCADE
          ON DELETE SET NULL,
        "action" TEXT,
        "entity_name" TEXT,
        "entity_id" UUID,
        "action_timestamp" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "ip_address" INET,
        "details" JSONB
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_audit_trails_user_id"
        ON "audit_trails" ("user_id");
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_audit_trails_entity_name_id"
        ON "audit_trails" ("entity_name", "entity_id");
    `);

    // 2) workflows table
    await queryRunner.query(`
      CREATE TABLE "workflows" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "company_id" UUID NOT NULL
          REFERENCES "companies"("id")
          ON UPDATE CASCADE
          ON DELETE NO ACTION,
        "document_type" VARCHAR(50),
        "state_name" VARCHAR(50),
        "is_initial" BOOLEAN DEFAULT FALSE,
        "is_final" BOOLEAN DEFAULT FALSE
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_workflows_company_id"
        ON "workflows" ("company_id");
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_workflows_document_type"
        ON "workflows" ("document_type");
    `);

    // 3) workflow_transitions table
    await queryRunner.query(`
      CREATE TABLE "workflow_transitions" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "workflow_id" UUID NOT NULL
          REFERENCES "workflows"("id")
          ON UPDATE CASCADE
          ON DELETE CASCADE,
        "from_state" VARCHAR(50),
        "to_state" VARCHAR(50),
        "transition_name" VARCHAR(100)
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_workflow_transitions_workflow_id"
        ON "workflow_transitions" ("workflow_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop in reverse order to avoid FK constraint errors

    // 3) workflow_transitions
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_workflow_transitions_workflow_id";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "workflow_transitions";`);

    // 2) workflows
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_workflows_document_type";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_workflows_company_id";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "workflows";`);

    // 1) audit_trails
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_audit_trails_entity_name_id";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_audit_trails_user_id";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_trails";`);
  }
}
