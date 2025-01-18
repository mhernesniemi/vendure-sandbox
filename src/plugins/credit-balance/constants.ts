import { PermissionDefinition } from "@vendure/core";

export const addCreditPermission = new PermissionDefinition({
  name: "AddCredit",
  description: "Allows shop admins to add credits to user accounts",
});
export const CREDIT_BALANCE_PLUGIN_OPTIONS = Symbol(
  "CREDIT_BALANCE_PLUGIN_OPTIONS"
);
export const loggerCtx = "CreditBalancePlugin";
