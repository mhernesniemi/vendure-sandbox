/**
 * @description
 * The plugin can be configured using the following options:
 */
import { CreditBalance } from "./credit-balance.entity";

declare module "@vendure/core/dist/entity/custom-entity-fields" {
  interface CustomCustomerFields {
    creditBalances: CreditBalance[];
  }
}
