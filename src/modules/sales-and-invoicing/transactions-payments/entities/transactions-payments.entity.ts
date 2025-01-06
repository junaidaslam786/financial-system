import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { PaymentMethod } from '../../payment-methods/entities/payment-methods.entity';
  
  @Entity('transactions_payments')
  export class TransactionsPayment {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    /**
     * This could reference an invoice, sales order, etc. 
     * We'll store just a UUID here and rely on the application to know which entity it belongs to.
     */
    @Column({ name: 'related_transaction_id', type: 'uuid', nullable: true })
    relatedTransactionId?: string;
  
    @ManyToOne(() => PaymentMethod, { onUpdate: 'CASCADE', onDelete: 'SET NULL' })
    @JoinColumn({ name: 'payment_method_id' })
    paymentMethod?: PaymentMethod;
  
    @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
    amount: number;
  
    @Column({ name: 'payment_date', type: 'date', default: () => 'CURRENT_DATE' })
    paymentDate: Date;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;
  }
  