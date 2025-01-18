import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  Allow,
  Ctx,
  Permission,
  RequestContext,
  Transaction,
} from "@vendure/core";

import { CreditBalance } from "../credit-balance.entity";
import { CreditBalanceService } from "../credit-balance.service";

@Resolver()
export class CreditBalanceResolver {
  constructor(private creditBalanceService: CreditBalanceService) {}

  @Query(() => [CreditBalance])
  @Allow(Permission.Owner)
  async activeCustomerCreditBalances(
    @Ctx() ctx: RequestContext
  ): Promise<CreditBalance[]> {
    return this.creditBalanceService.getCreditBalanceRecords(ctx);
  }

  @Mutation(() => [CreditBalance])
  @Transaction()
  @Allow(Permission.Owner)
  async addCreditBalance(
    @Ctx() ctx: RequestContext,
    @Args("balanceChange") balanceChange: number,
    @Args("description") description: string
  ): Promise<CreditBalance[]> {
    return this.creditBalanceService.addCreditBalance(
      ctx,
      balanceChange,
      description
    );
  }

  @Mutation(() => [CreditBalance])
  @Transaction()
  @Allow(Permission.Owner)
  async removeCreditBalance(
    @Ctx() ctx: RequestContext,
    @Args("id") id: string
  ): Promise<CreditBalance[]> {
    return this.creditBalanceService.removeCreditBalance(ctx, id);
  }
}
