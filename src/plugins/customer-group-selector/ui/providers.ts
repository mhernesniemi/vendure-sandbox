import { registerReactFormInputComponent } from "@vendure/admin-ui/react";
import { CustomerGroupSelector } from "./components/CustomerGroupSelector.tsx";

export default [
  registerReactFormInputComponent(
    "customer-group-selector",
    CustomerGroupSelector
  ),
];
