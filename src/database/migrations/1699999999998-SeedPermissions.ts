import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedPermissions1699999999998 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) Define the full set of features and actions.
    //    Each feature is something like "users", "roles", "lots", etc.
    //    The actions can be your standard CRUD + domain-specific ops.
    //    Below is an example derived from your logs & typical CRUD endpoints.

    const domainPermissions = [
      {
        feature: 'auth',
        actions: ['login', 'register', 'toggle2fa', 'readProfile'],
      },
      {
        feature: 'users',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'roles',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'companies',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'companyOwners',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'accounts',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'partners',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'employees',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'uom',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'currencies',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'exchangeRates',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'journal',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'priceLists',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'suppliers',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'customers',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'traders',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'brokers',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'brokerageAgreements',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'brokerageTransactions',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'contacts',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'inventory',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'inventoryMovements',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'lotRawMaterials',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'invoices',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'lots',
        actions: [
          'create',
          'read',
          'update',
          'delete',
          'linkPurchaseOrder',
          'linkSalesOrder',
          'linkInvoice',
          'linkProductionOrder',
        ],
      },
      {
        feature: 'packagingOrders',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'priceListItems',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'processingStages',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'productCategories',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'productionOrderStages',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'productionOrders',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'products',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'warehouses',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'creditNotes',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'debitNotes',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'payments',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'paymentMethods',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'transactionsPayments',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'purchaseOrders',
        actions: [
          'create',
          'read',
          'update',
          'delete',
          // below are specialized endpoints for PO lines:
          'addLine',
          'getLine',
          'updateLine',
          'deleteLine',
        ],
      },
      {
        feature: 'salesOrders',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'weighbridgeTickets',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'grainQualityTests',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'auditTrails',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'workflows',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'daybook',
        actions: ['read'],
      },
      {
        feature: 'reports',
        actions: [
          'trialBalance',
          'incomeStatement',
          'balanceSheet',
          'contactLedger',
          'aging',
        ],
      },
      {
        feature: 'permissions',
        actions: [
          'create',
          'read',
          'update',
          'delete',
          'assign',
          'unassign',
          'assignAll',
          'replace',
        ],
      },
    ];

    // 2) Insert each {feature}.{action} permission if it does not exist
    await queryRunner.startTransaction();
    try {
      for (const domain of domainPermissions) {
        for (const action of domain.actions) {
          const permissionName = `${domain.feature}.${action}`;
          const existing = await queryRunner.query(
            `SELECT id FROM permissions WHERE permission_name = $1`,
            [permissionName],
          );
          if (existing.length === 0) {
            console.log(`Inserting permission: ${permissionName}`);
            await queryRunner.query(
              `INSERT INTO permissions (permission_name, description) VALUES ($1, $2)`,
              [permissionName, `Auto-seeded permission for ${permissionName}`],
            );
          } else {
            console.log(`Skipping existing permission: ${permissionName}`);
          }
        }
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      console.error('Migration failed:', error);
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Optionally remove ONLY the seeded permissions (if you want a complete rollback).
    // That means building the same array and deleting them. Or you can no-op.
    // Example:
    const domainPermissions = [
      {
        feature: 'auth',
        actions: ['login', 'register', 'toggle2fa', 'readProfile'],
      },
      {
        feature: 'users',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'roles',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'companies',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'companyOwners',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'accounts',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'partners',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'employees',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'uom',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'currencies',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'exchangeRates',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'journal',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'priceLists',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'suppliers',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'customers',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'traders',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'brokers',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'brokerageAgreements',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'brokerageTransactions',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'contacts',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'inventory',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'inventoryMovements',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'lotRawMaterials',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'invoices',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'lots',
        actions: [
          'create',
          'read',
          'update',
          'delete',
          'linkPurchaseOrder',
          'linkSalesOrder',
          'linkInvoice',
          'linkProductionOrder',
        ],
      },
      {
        feature: 'packagingOrders',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'priceListItems',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'processingStages',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'productCategories',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'productionOrderStages',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'productionOrders',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'products',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'warehouses',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'creditNotes',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'debitNotes',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'payments',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'paymentMethods',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'transactionsPayments',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'purchaseOrders',
        actions: [
          'create',
          'read',
          'update',
          'delete',
          // below are specialized endpoints for PO lines:
          'addLine',
          'getLine',
          'updateLine',
          'deleteLine',
        ],
      },
      {
        feature: 'salesOrders',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'weighbridgeTickets',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'grainQualityTests',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'auditTrails',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'workflows',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        feature: 'daybook',
        actions: ['read'],
      },
      {
        feature: 'reports',
        actions: [
          'trialBalance',
          'incomeStatement',
          'balanceSheet',
          'contactLedger',
          'aging',
        ],
      },
      {
        feature: 'permissions',
        actions: [
          'create',
          'read',
          'update',
          'delete',
          'assign',
          'unassign',
          'assignAll',
          'replace',
        ],
      },
    ];

    for (const domain of domainPermissions) {
      for (const action of domain.actions) {
        const permissionName = `${domain.feature}.${action}`;
        await queryRunner.query(
          `DELETE FROM permissions WHERE permission_name = $1`,
          [permissionName],
        );
      }
    }
  }
}
