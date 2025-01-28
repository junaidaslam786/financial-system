import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPermissionsAndRolePermissions1689999999999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) Create permissions table
    await queryRunner.query(`
      CREATE TABLE permissions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        permission_name VARCHAR(200) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 2) Create role_permissions bridging table
    //    Assuming you already have a "roles" table with PK "id" (UUID)
    await queryRunner.query(`
      CREATE TABLE role_permissions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        role_id UUID NOT NULL REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
        permission_id UUID NOT NULL REFERENCES permissions(id) ON UPDATE CASCADE ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // optional: unique index so that a role cannot have the same permission twice
    await queryRunner.query(`
      CREATE UNIQUE INDEX idx_role_permission_unique
      ON role_permissions(role_id, permission_id);
    `);

    // indexes for quick lookups
    await queryRunner.query(`
      CREATE INDEX idx_role_permissions_role_id 
      ON role_permissions(role_id);
    `);
    await queryRunner.query(`
      CREATE INDEX idx_role_permissions_permission_id
      ON role_permissions(permission_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // drop bridging table first
    await queryRunner.query(`DROP INDEX IF EXISTS idx_role_permissions_permission_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_role_permissions_role_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_role_permission_unique;`);
    await queryRunner.query(`DROP TABLE IF EXISTS role_permissions;`);

    // drop permissions table last
    await queryRunner.query(`DROP TABLE IF EXISTS permissions;`);
  }
}
