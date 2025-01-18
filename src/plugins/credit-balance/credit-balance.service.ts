import { Injectable } from "@nestjs/common";
import {
  Customer,
  ForbiddenError,
  ID,
  RequestContext,
  TransactionalConnection,
  InternalServerError,
} from "@vendure/core";

import { CreditBalance } from "./credit-balance.entity";

@Injectable()
export class CreditBalanceService {
  constructor(private connection: TransactionalConnection) {}

  /**
   * Fetches all credit balance records for the active customer.
   */
  async getCreditBalanceRecords(ctx: RequestContext): Promise<CreditBalance[]> {
    const customer = await this.getCustomerWithCreditBalances(ctx);
    return customer.customFields.creditBalances;
  }

  /**
   * Adds a new credit balance record to the active customer.
   */
  async addCreditBalance(
    ctx: RequestContext,
    balanceChange: number,
    description: string
  ): Promise<CreditBalance[]> {
    const customer = await this.getCustomerWithCreditBalances(ctx);
    const creditBalance = await this.connection
      .getRepository(ctx, CreditBalance)
      .save(
        new CreditBalance({
          balanceChange,
          description,
          customer,
        })
      );

    customer.customFields.creditBalances.push(creditBalance);
    await this.connection
      .getRepository(ctx, Customer)
      .save(customer, { reload: false });
    return this.getCreditBalanceRecords(ctx);
  }

  /**
   * Removes a credit balance record for the active customer.
   */
  async removeCreditBalance(
    ctx: RequestContext,
    id: ID
  ): Promise<CreditBalance[]> {
    const customer = await this.getCustomerWithCreditBalances(ctx);
    const creditToRemove = customer.customFields.creditBalances.find(
      (balance) => balance.id === id
    );

    if (creditToRemove) {
      await this.connection
        .getRepository(ctx, CreditBalance)
        .remove(creditToRemove);

      customer.customFields.creditBalances =
        customer.customFields.creditBalances.filter(
          (balance) => balance.id !== id
        );
      await this.connection.getRepository(ctx, Customer).save(customer);
    }

    return this.getCreditBalanceRecords(ctx);
  }

  /**
   * Gets the active customer with loaded credit balance records.
   */
  private async getCustomerWithCreditBalances(
    ctx: RequestContext
  ): Promise<Customer> {
    if (!ctx.activeUserId) {
      throw new ForbiddenError();
    }
    const customer = await this.connection
      .getRepository(ctx, Customer)
      .findOne({
        where: { user: { id: ctx.activeUserId } },
        relations: {
          customFields: {
            creditBalances: true,
          },
        },
      });
    if (!customer) {
      throw new InternalServerError(`Customer was not found`);
    }
    return customer;
  }
}
