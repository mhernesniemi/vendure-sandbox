import { OnModuleInit } from "@nestjs/common";
import {
  PluginCommonModule,
  Type,
  VendurePlugin,
  OrderStateTransitionEvent,
  EventBus,
} from "@vendure/core";
import { SetupRolesService } from "./setup-roles";
import { CreditBalance } from "./credit-balance.entity";

import "./types";
import { CreditBalanceService } from "./credit-balance.service";
import { shopApiExtensions } from "./api/api-extensions";
import { CreditBalanceResolver } from "./api/credit-balance.resolver";
import { addCreditPermission } from "./constants";

@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [SetupRolesService, CreditBalanceService],
  entities: [CreditBalance],
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [CreditBalanceResolver],
  },
  configuration: (config) => {
    config.customFields.Customer.push({
      name: "creditBalance",
      type: "int",
      defaultValue: 0,
    });

    config.customFields.Product.push({
      name: "creditPrice",
      type: "int",
      nullable: true,
    });

    config.authOptions.customPermissions.push(addCreditPermission);
    return config;
  },
  compatibility: "^3.0.0",
})
export class CreditBalancePlugin {
  constructor(private eventBus: EventBus) {}

  static init(): Type<CreditBalancePlugin> {
    return CreditBalancePlugin;
  }
}
