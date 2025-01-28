import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductInventoryTables1673000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) product_categories
    await queryRunner.query(`
      CREATE TABLE product_categories (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
        category_name VARCHAR(100) NOT NULL,
        parent_category_id UUID REFERENCES product_categories(id) ON UPDATE CASCADE ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_product_categories_company_id 
      ON product_categories(company_id);
    `);
    await queryRunner.query(`
      CREATE INDEX idx_product_categories_parent_id 
      ON product_categories(parent_category_id);
    `);

    // 2) products
    await queryRunner.query(`
      CREATE TABLE products (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
        category_id UUID REFERENCES product_categories(id) ON UPDATE CASCADE ON DELETE SET NULL,
        product_name VARCHAR(255) NOT NULL,
        sku VARCHAR(100) UNIQUE,
        product_type VARCHAR(50) CHECK(product_type IN('RawMaterial','FinishedGood','Service')),
        unit_of_measure_id UUID REFERENCES units_of_measure(id) ON UPDATE CASCADE ON DELETE SET NULL,
        cost_price NUMERIC(12,2) DEFAULT 0.00 CHECK(cost_price >= 0),
        selling_price NUMERIC(12,2) DEFAULT 0.00 CHECK(selling_price >= 0),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_products_company_id 
      ON products(company_id);
    `);
    await queryRunner.query(`
      CREATE INDEX idx_products_category_id 
      ON products(category_id);
    `);
    await queryRunner.query(`
      CREATE INDEX idx_products_unit_of_measure_id 
      ON products(unit_of_measure_id);
    `);

    // 3) price_list_items
    await queryRunner.query(`
      CREATE TABLE price_list_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        price_list_id UUID NOT NULL REFERENCES price_lists(id) ON UPDATE CASCADE ON DELETE CASCADE,
        product_id UUID NOT NULL REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE,
        price NUMERIC(12,2) CHECK(price >= 0)
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_price_list_items_price_list_id 
      ON price_list_items(price_list_id);
    `);
    await queryRunner.query(`
      CREATE INDEX idx_price_list_items_product_id 
      ON price_list_items(product_id);
    `);

    // 4) warehouses
    await queryRunner.query(`
      CREATE TABLE warehouses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
        location VARCHAR(255),
        capacity NUMERIC(12,2) CHECK(capacity >= 0),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_warehouses_company_id 
      ON warehouses(company_id);
    `);

    // 5) lots
    await queryRunner.query(`
      CREATE TABLE lots (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
        lot_number VARCHAR(100) UNIQUE NOT NULL,
        source_supplier_id UUID REFERENCES suppliers(id) ON UPDATE CASCADE ON DELETE SET NULL,
        initial_quantity NUMERIC(15,2) NOT NULL CHECK(initial_quantity >= 0),
        current_quantity NUMERIC(15,2) NOT NULL CHECK(current_quantity >= 0),
        status VARCHAR(50) DEFAULT 'Pending' CHECK(status IN('Pending','In-Process','Completed')),
        product_id UUID REFERENCES products(id) ON UPDATE CASCADE ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_lots_company_id 
      ON lots(company_id);
    `);
    await queryRunner.query(`
      CREATE INDEX idx_lots_source_supplier_id 
      ON lots(source_supplier_id);
    `);
    await queryRunner.query(`
      CREATE INDEX idx_lots_product_id
      ON lots(product_id);
    `);
    
    // 6) lot_raw_materials
    await queryRunner.query(`
      CREATE TABLE lot_raw_materials (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        lot_id UUID NOT NULL REFERENCES lots(id) ON UPDATE CASCADE ON DELETE CASCADE,
        product_id UUID NOT NULL REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE,
        quantity NUMERIC(15,2) NOT NULL CHECK(quantity >= 0)
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_lot_raw_materials_lot_id 
      ON lot_raw_materials(lot_id);
    `);
    await queryRunner.query(`
      CREATE INDEX idx_lot_raw_materials_product_id 
      ON lot_raw_materials(product_id);
    `);

    // 7) processing_stages
    await queryRunner.query(`
      CREATE TABLE processing_stages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
        stage_name VARCHAR(100) NOT NULL,
        description TEXT
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_processing_stages_company_id 
      ON processing_stages(company_id);
    `);

    // 8) production_orders
    await queryRunner.query(`
      CREATE TABLE production_orders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
        lot_id UUID NOT NULL REFERENCES lots(id) ON UPDATE CASCADE ON DELETE CASCADE,
        order_number VARCHAR(100) UNIQUE NOT NULL,
        start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        end_date TIMESTAMP WITH TIME ZONE,
        status VARCHAR(50) DEFAULT 'Open' CHECK(status IN('Open','In-Progress','Completed','Closed')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_production_orders_company_id 
      ON production_orders(company_id);
    `);
    await queryRunner.query(`
      CREATE INDEX idx_production_orders_lot_id 
      ON production_orders(lot_id);
    `);

    // 9) production_order_stages
    await queryRunner.query(`
      CREATE TABLE production_order_stages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        production_order_id UUID NOT NULL REFERENCES production_orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
        processing_stage_id UUID NOT NULL REFERENCES processing_stages(id) ON UPDATE CASCADE ON DELETE CASCADE,
        start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        end_time TIMESTAMP WITH TIME ZONE,
        input_quantity NUMERIC(15,2) CHECK(input_quantity >= 0),
        output_quantity NUMERIC(15,2) CHECK(output_quantity >= 0),
        notes TEXT
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_production_order_stages_prod_order_id 
      ON production_order_stages(production_order_id);
    `);
    await queryRunner.query(`
      CREATE INDEX idx_production_order_stages_stage_id 
      ON production_order_stages(processing_stage_id);
    `);

    // 10) packaging_orders
    await queryRunner.query(`
      CREATE TABLE packaging_orders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
        production_order_id UUID REFERENCES production_orders(id) ON UPDATE CASCADE ON DELETE SET NULL,
        order_number VARCHAR(100) UNIQUE,
        total_quantity NUMERIC(15,2) CHECK(total_quantity >= 0),
        bag_weight NUMERIC(12,2) CHECK(bag_weight >= 0),
        number_of_bags INT CHECK(number_of_bags >= 0),
        status VARCHAR(50) DEFAULT 'Pending' CHECK(status IN('Pending','In-Progress','Completed')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_packaging_orders_company_id 
      ON packaging_orders(company_id);
    `);
    await queryRunner.query(`
      CREATE INDEX idx_packaging_orders_production_order_id 
      ON packaging_orders(production_order_id);
    `);

    // 11) inventory
    await queryRunner.query(`
      CREATE TABLE inventory (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
        warehouse_id UUID REFERENCES warehouses(id) ON UPDATE CASCADE ON DELETE SET NULL,
        product_id UUID REFERENCES products(id) ON UPDATE CASCADE ON DELETE SET NULL,
        quantity NUMERIC(15,2) DEFAULT 0.00 CHECK(quantity >= 0),
        batch_number VARCHAR(100),
        expiration_date DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_inventory_company_id 
      ON inventory(company_id);
    `);
    await queryRunner.query(`
      CREATE INDEX idx_inventory_warehouse_id 
      ON inventory(warehouse_id);
    `);
    await queryRunner.query(`
      CREATE INDEX idx_inventory_product_id 
      ON inventory(product_id);
    `);

    // 12) inventory_movements
    await queryRunner.query(`
      CREATE TABLE inventory_movements (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID NOT NULL REFERENCES companies(id) ON UPDATE CASCADE ON DELETE CASCADE,
        inventory_id UUID REFERENCES inventory(id) ON UPDATE CASCADE ON DELETE CASCADE,
        movement_type VARCHAR(50) CHECK(movement_type IN('IN','OUT','ADJUSTMENT')),
        quantity NUMERIC(15,2) CHECK(quantity >= 0),
        reason TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_inventory_movements_company_id 
      ON inventory_movements(company_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_inventory_movements_inventory_id 
      ON inventory_movements(inventory_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop in reverse order

    // 12) inventory_movements
    await queryRunner.query(`DROP INDEX IF EXISTS idx_inventory_movements_inventory_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_inventory_movements_company_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS inventory_movements;`);

    // 11) inventory
    await queryRunner.query(`DROP INDEX IF EXISTS idx_inventory_product_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_inventory_warehouse_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_inventory_company_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS inventory;`);

    // 10) packaging_orders
    await queryRunner.query(`DROP INDEX IF EXISTS idx_packaging_orders_production_order_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_packaging_orders_company_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS packaging_orders;`);

    // 9) production_order_stages
    await queryRunner.query(`DROP INDEX IF EXISTS idx_production_order_stages_stage_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_production_order_stages_prod_order_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS production_order_stages;`);

    // 8) production_orders
    await queryRunner.query(`DROP INDEX IF EXISTS idx_production_orders_lot_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_production_orders_company_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS production_orders;`);

    // 7) processing_stages
    await queryRunner.query(`DROP INDEX IF EXISTS idx_processing_stages_company_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS processing_stages;`);

    // 6) lot_raw_materials
    await queryRunner.query(`DROP INDEX IF EXISTS idx_lot_raw_materials_product_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_lot_raw_materials_lot_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS lot_raw_materials;`);

    // 5) lots
    await queryRunner.query(`DROP INDEX IF EXISTS idx_lots_source_supplier_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_lots_company_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS lots;`);

    // 4) warehouses
    await queryRunner.query(`DROP INDEX IF EXISTS idx_warehouses_company_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS warehouses;`);

    // 3) price_list_items
    await queryRunner.query(`DROP INDEX IF EXISTS idx_price_list_items_product_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_price_list_items_price_list_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS price_list_items;`);

    // 2) products
    await queryRunner.query(`DROP INDEX IF EXISTS idx_products_unit_of_measure_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_products_category_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_products_company_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS products;`);

    // 1) product_categories
    await queryRunner.query(`DROP INDEX IF EXISTS idx_product_categories_parent_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_product_categories_company_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS product_categories;`);
  }
}
