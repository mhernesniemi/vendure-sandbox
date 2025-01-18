import {
  DeepPartial,
  ID,
  VendureEntity,
  EntityId,
  Customer,
} from "@vendure/core";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class CreditBalance extends VendureEntity {
  constructor(input?: DeepPartial<CreditBalance>) {
    super(input);
  }

  @ManyToOne(() => Customer)
  customer: Customer;

  @EntityId()
  customerId: ID;

  @Column()
  balanceChange: number;

  @Column()
  description: string;

  @Column()
  createdAt: Date = new Date();
}
