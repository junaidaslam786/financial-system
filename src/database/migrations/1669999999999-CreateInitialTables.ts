import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1669999999999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable uuid-ossp extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create roles table
    await queryRunner.query(`
      CREATE TABLE roles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        role_name VARCHAR(100) NOT NULL UNIQUE
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_roles_rolename ON roles(role_name);
    `);

    

    // Create companies table
    await queryRunner.query(`
      CREATE TABLE companies (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        registration_number VARCHAR(100),
        legal_structure VARCHAR(100),
        address TEXT,
        contact_info TEXT,
        default_currency VARCHAR(10) DEFAULT 'USD',
        created_by_user_id UUID REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`CREATE INDEX idx_companies_name ON companies(name);`);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        default_company_id UUID REFERENCES companies(id) ON UPDATE CASCADE ON DELETE SET NULL,
        role_id UUID REFERENCES roles(id) ON UPDATE CASCADE ON DELETE SET NULL,
        two_factor_enabled BOOLEAN DEFAULT FALSE,
        "two_factor_authentication_secret" character varying,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Indexes for users
    await queryRunner.query(`CREATE INDEX idx_users_email ON users(email);`);
    await queryRunner.query(`CREATE INDEX idx_users_role_id ON users(role_id);`);

    await queryRunner.query(`
      CREATE INDEX idx_users_default_company_id ON users(default_company_id);
    `);

    // Create company_owners table
    await queryRunner.query(`
      CREATE TABLE company_owners (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
        owner_name VARCHAR(255) NOT NULL,
        contact_info TEXT,
        ownership_percentage NUMERIC(5,2) CHECK (ownership_percentage >= 0 AND ownership_percentage <= 100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`CREATE INDEX idx_company_owners_company_id ON company_owners(company_id);`);

    // Create partners table
    await queryRunner.query(`
      CREATE TABLE partners (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
        partner_name VARCHAR(255) NOT NULL,
        investment_amount NUMERIC(15,2),
        shares NUMERIC(12,2),
        partner_type VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`CREATE INDEX idx_partners_company_id ON partners(company_id);`);

    // Create employees table
    await queryRunner.query(`
      CREATE TABLE employees (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
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

    await queryRunner.query(`CREATE INDEX idx_employees_company_id ON employees(company_id);`);

    // Create units_of_measure table
    await queryRunner.query(`
      CREATE TABLE units_of_measure (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
        uom_name VARCHAR(50) NOT NULL,
        uom_description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX idx_units_of_measure_company_uom_name ON units_of_measure(company_id, uom_name);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_units_of_measure_company_id ON units_of_measure(company_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order of creation to avoid FK constraints issues

    await queryRunner.query(`DROP INDEX IF EXISTS idx_units_of_measure_company_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_units_of_measure_company_uom_name;`);
    await queryRunner.query(`DROP TABLE IF EXISTS units_of_measure;`);

    await queryRunner.query(`DROP INDEX IF EXISTS idx_employees_company_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS employees;`);

    await queryRunner.query(`DROP INDEX IF EXISTS idx_partners_company_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS partners;`);

    await queryRunner.query(`DROP INDEX IF EXISTS idx_company_owners_company_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS company_owners;`);
    
    await queryRunner.query(`DROP INDEX IF EXISTS idx_users_default_company_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_users_role_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_users_email;`);
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);

    await queryRunner.query(`DROP INDEX IF EXISTS idx_companies_name;`);
    await queryRunner.query(`DROP TABLE IF EXISTS companies;`);


    await queryRunner.query(`DROP INDEX IF EXISTS idx_roles_rolename;`);
    await queryRunner.query(`DROP TABLE IF EXISTS roles;`);
  }
}
