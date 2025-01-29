import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1669999999999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) Enable the uuid-ossp extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // 2) Create roles table
    await queryRunner.query(`
      CREATE TABLE roles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        role_name VARCHAR(100) NOT NULL UNIQUE
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_roles_rolename ON roles(role_name);
    `);

    // 3) Create companies table (no FK to users yet; just the column)
    await queryRunner.query(`
      CREATE TABLE companies (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        registration_number VARCHAR(100),
        legal_structure VARCHAR(100),
        address TEXT,
        contact_info TEXT,
        default_currency VARCHAR(10) DEFAULT 'USD',
        created_by_user_id UUID, -- define column only
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_companies_name ON companies(name);
    `);

    // 4) Create users table (FK to roles is fine, but not to companies yet)
    await queryRunner.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        default_company_id UUID, -- define column only, no FK yet
        role_id UUID REFERENCES roles(id) ON UPDATE CASCADE ON DELETE SET NULL,
        two_factor_enabled BOOLEAN DEFAULT FALSE,
        two_factor_authentication_secret VARCHAR,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`CREATE INDEX idx_users_email ON users(email);`);
    await queryRunner.query(`CREATE INDEX idx_users_role_id ON users(role_id);`);

    // 5) Now that both tables exist, we can safely add the circular FKs:
    //    a) companies.created_by_user_id -> users(id)
    //    b) users.default_company_id -> companies(id)
    await queryRunner.query(`
      ALTER TABLE companies
      ADD CONSTRAINT fk_companies_created_by
      FOREIGN KEY (created_by_user_id)
      REFERENCES users(id)
      ON UPDATE CASCADE
      ON DELETE SET NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE users
      ADD CONSTRAINT fk_users_default_company
      FOREIGN KEY (default_company_id)
      REFERENCES companies(id)
      ON UPDATE CASCADE
      ON DELETE SET NULL;
    `);

    // 6) Create company_owners
    await queryRunner.query(`
      CREATE TABLE company_owners (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL
          REFERENCES companies(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE,
        owner_name VARCHAR(255) NOT NULL,
        contact_info TEXT,
        ownership_percentage NUMERIC(5,2) CHECK (ownership_percentage >= 0 AND ownership_percentage <= 100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_company_owners_company_id ON company_owners(company_id);
    `);

    // 7) Create partners
    await queryRunner.query(`
      CREATE TABLE partners (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL
          REFERENCES companies(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE,
        partner_name VARCHAR(255) NOT NULL,
        investment_amount NUMERIC(15,2),
        shares NUMERIC(12,2),
        partner_type VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_partners_company_id ON partners(company_id);
    `);

    // 8) Create employees
    await queryRunner.query(`
      CREATE TABLE employees (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL
          REFERENCES companies(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE,
        employee_name VARCHAR(255) NOT NULL,
        job_title VARCHAR(255),
        department VARCHAR(255),
        salary NUMERIC(12,2) DEFAULT 0.00,
        payment_schedule VARCHAR(100),
        national_id VARCHAR(100),
        contact_info TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_employees_company_id ON employees(company_id);
    `);

    // 9) Create units_of_measure
    await queryRunner.query(`
      CREATE TABLE units_of_measure (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL
          REFERENCES companies(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE,
        uom_name VARCHAR(50) NOT NULL,
        uom_description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX idx_units_of_measure_company_uom_name
      ON units_of_measure(company_id, uom_name);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_units_of_measure_company_id ON units_of_measure(company_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop constraints in reverse order before dropping tables

    // 1) Drop indexes & tables: units_of_measure
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_units_of_measure_company_id;
    `);
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_units_of_measure_company_uom_name;
    `);
    await queryRunner.query(`
      DROP TABLE IF EXISTS units_of_measure;
    `);

    // 2) employees
    await queryRunner.query(`DROP INDEX IF EXISTS idx_employees_company_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS employees;`);

    // 3) partners
    await queryRunner.query(`DROP INDEX IF EXISTS idx_partners_company_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS partners;`);

    // 4) company_owners
    await queryRunner.query(`DROP INDEX IF EXISTS idx_company_owners_company_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS company_owners;`);

    // 5) Remove the circular references
    await queryRunner.query(`
      ALTER TABLE users
      DROP CONSTRAINT IF EXISTS fk_users_default_company;
    `);

    await queryRunner.query(`
      ALTER TABLE companies
      DROP CONSTRAINT IF EXISTS fk_companies_created_by;
    `);

    // 6) users
    await queryRunner.query(`DROP INDEX IF EXISTS idx_users_role_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_users_email;`);
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);

    // 7) companies
    await queryRunner.query(`DROP INDEX IF EXISTS idx_companies_name;`);
    await queryRunner.query(`DROP TABLE IF EXISTS companies;`);

    // 8) roles
    await queryRunner.query(`DROP INDEX IF EXISTS idx_roles_rolename;`);
    await queryRunner.query(`DROP TABLE IF EXISTS roles;`);
  }
}
