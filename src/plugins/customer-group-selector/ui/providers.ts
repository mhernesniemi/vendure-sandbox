import { registerFormInputComponent } from "@vendure/ui-devkit/compiler";
import { CustomerGroupSelector } from "./components/CustomerGroupSelector";

export default [
  registerFormInputComponent("customer-group-selector", CustomerGroupSelector),
];
