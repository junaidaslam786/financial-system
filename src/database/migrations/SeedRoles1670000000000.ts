import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRoles1670000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert default roles: 'owner', 'admin', 'user'
    await queryRunner.query(`
      INSERT INTO roles (id, role_name)
      VALUES
        (uuid_generate_v4(), 'owner'),
        (uuid_generate_v4(), 'admin'),
        (uuid_generate_v4(), 'user')
      ON CONFLICT (role_name) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove seeded roles if you revert
    await queryRunner.query(`
      DELETE FROM roles
      WHERE role_name IN ('owner','admin','user');
    `);
  }
}
